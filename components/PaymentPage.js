'use client'
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { initiate } from '@/actions/useractions'
import { useSession } from 'next-auth/react'
import { fetchuser, fetchpayments } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { notFound } from "next/navigation"



const PaymentPage = ({ username }) => {
    // const { data: session } = useSession()
    const [paymentform, setpaymentform] = useState({
        name: "",
        email: "",
        amount: "",
        message: ""
    })

    const [currentUser, setcurrentUser] = useState({})
    const [payments, setpayments] = useState([])
    const SearchParams = useSearchParams()
    const router=useRouter()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (SearchParams.get("paymentdone") == "true") {
            toast('Thanks for your support!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
        router.push(`/${username}`)
    }, [])

    const handleChange = (e) => {
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }
    const getData = async () => {
        let u = await fetchuser(username)
        setcurrentUser(u)
        let dbpayments = await fetchpayments(username)
        setpayments(dbpayments)
    }

    const pay = async (amount) => {
        let a = await initiate(amount, username, paymentform)
        let orderId = a.id
        var options = {
            "key": currentUser.razorpayId, // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Get Me A Chai", //your business name
            "description": "Test Transaction",
            "image": "",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Gaurav Kumar", //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }
     

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>


            <div className='cover w-full bg-red-50 relative'>
                <img className='object-cover w-full h-48 md:h-[300px]' src={currentUser.coverpic} alt="" />
                <div className='absolute -bottom-17 md:right-[46%] right-[38%] border-2 border-white rounded-full overflow-hidden size-36'>
                    <img className='rounded-full object-cover size-36' width={144} height={144} src={currentUser.profilepic} alt="" />
                </div>
            </div>
            <div className="info flex justify-center items-center my-18 flex-col mb-32">
                <div className='font-bold text-2xl gap-1'>
                    @{username}
                </div>
                <div className='text-slate-400'>
                    Lets help {username} to get a chai
                </div>
                <div className='text-slate-400'>
                    {payments.length} Payments. {payments.reduce((a, b) => a + b.amount, 0) / 100} raised so far
                </div>
                <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
                        {/* show list of all the supporters as a leaderboard */}
                        <h2 className='text-2xl font-bold my-5'>Top {payments.length<=10?payments.length:10} supporters</h2>
                        <ul className='mx-5 text-lg'>
                            {payments.length == 0 && <li>No Payments yet</li>}
                            {payments.map((p, i) => {
                                return <li key={i} className='my-4 flex gap-2 items-center'>
                                    <img width={33} src="/user.gif" alt="avatar" />
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount / 100}</span> with a msg &quot;{p.message}&quot;
                                    </span>
                                </li>
                            })}
                        </ul>
                    </div>
                    <div className="makepayment w-full md:w-1/2  bg-slate-900 rounded-lg text-white p-10">
                        <h2 className='text-2xl font-bold my-5'>Make a payment</h2>
                        <div className='flex gap-2 flex-col'>
                            {/* input for name and msg */}
                            <div>
                                <input onChange={handleChange} value={paymentform.name||""} name='name' type="text" placeholder='Enter Name' className='w-full p-2 rounded-lg bg-slate-800 text-white' />
                            </div>
                            <input onChange={handleChange} value={paymentform.message||""} name='message' type="text" placeholder='Enter Message' className='w-full p-2 rounded-lg bg-slate-800 text-white' />

                            <input onChange={handleChange} value={paymentform.amount||""} name='amount' type="text" placeholder='Enter Amount' className='w-full p-2 rounded-lg bg-slate-800 text-white' />

                            <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)} type="button" className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:rifng-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-3000" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4||paymentform.amount?.length<1}>Pay</button>

                        </div>
                        {/* Or choose from these amounts */}
                        <div className='flex flex-col md:flex-row gap-2 my-5'>
                            <button className='bg-slate-800 text-white p-2 rounded-lg' onClick={() => pay(500)}>Pay ₹5</button>
                            <button className='bg-slate-800 text-white p-2 rounded-lg' onClick={() => pay(1000)}>Pay ₹10</button>
                            <button className='bg-slate-800 text-white p-2 rounded-lg' onClick={() => pay(2000)}>Pay ₹20</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PaymentPage
