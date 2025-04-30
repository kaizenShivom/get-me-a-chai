'use server'

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"
import { notFound } from "next/navigation"

export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()
    let user = await User.findOne({ username: to_username })
    const secret = user.razorpaySecret

    var instance = new Razorpay({ key_id: user.razorpayId, key_secret: secret })
    console.log("Using Razorpay credentials:", user.razorpayId, secret);

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }
    console.log("Creating Razorpay order with:", options);

    try{
        let x = await instance.orders.create(options)
    
        //create a payment object  
        await Payment.create({
            order_id: x.id,
            amount: amount,
            to_user: to_username,
            name: paymentform.name,
            message: paymentform.message,
        })
        return x
    }
    catch (err) {
        console.error("Razorpay error:", err);
        throw err;
    }
}


export const fetchuser = async (username) => {
    await connectDb()
    const u = await User.findOne({ username: username })

    if (!u) return null

    const user = {
        _id: u._id.toString(),
        email: u.email,
        name: u.name,
        username: u.username,
        profilepic: u.profilepic,
        coverpic: u.coverpic,
        razorpayId: u.razorpayId,
        razorpaySecret: u.razorpaySecret,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
    }

    return user
}


export const fetchpayments = async (username) => {
    await connectDb()

    const payments = await Payment.find({ to_user: username, done: true })
        .sort({ amount: -1 })
        .limit(10)
        .lean()

    // sanitize
    const safePayments = payments.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        to_user: p.to_user,
        order_id: p.order_id,
        message: p.message,
        amount: p.amount,
        done: p.done,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        __v: p.__v
    }))

    return safePayments
}


export const updateprofile = async (data, oldusername) => {
    await connectDb()
    //if the username is changed, check if the new username is already taken
    let ndata = data

    if (data.username !== ndata.username) {
        let u = await User.findOne({ username: ndata.username })
        if (u) {
            return { error: "Username already taken" }
        }
        //await User.updateOne({email:ndata.email}, ndata)
        //now update al the usernames i the payments table irrespective of the username change
        await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username })
    }
    else{

        await User.updateOne({ email: ndata.email }, ndata)
    }
}