import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import connectDb from '@/db/connectDb'
import User from '@/models/User'
import { notFound } from 'next/navigation'
 const Username = async ({params}) => {

  //if the uset name is not present in the data page, show 404 page
  const checkUser=async()=>{
    await connectDb()
    let u=await User.findOne({username:params.username})
    if(!u){
      notFound()
    }
  }
await checkUser()


    return (
      <>
        <PaymentPage username={params.username} />
      </>
    )
  }

export default Username

export async function generateMetadata({ params }) {
  return {
    title: `Support ${params.username}`,
    description: `Payment page for ${params.username}`,
  }
}