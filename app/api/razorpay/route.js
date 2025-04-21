import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import Razorpay from "razorpay";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
    await connectDb();
    let body = await req.formData()
    body = Object.fromEntries(body)

    //check if razorpay orderid is present on the server
    let p = await Payment.findOne({ order_id: body.razorpay_order_id })
    if (!p) {
        return NextResponse.json({ success: false, message: "Order id not found" })
    }

    //fetch the sercret of the user who is getting the payment
    let user=await User.findOne({username:p.to_user})
    const secret=user.razorpaySecret

    //check if payment is already done
    let xx = validatePaymentVerification({ "order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id }, body.razorpay_signature, secret)

    if (xx) {
        //update the payment object
        const updatedPayment = await Payment.findOneAndUpdate({ order_id: body.razorpay_order_id }, { done: true }, { new: true })
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`)
    }

    else {
        return NextResponse.json({ success: false, message: "Payment not verified" })
    }
}
