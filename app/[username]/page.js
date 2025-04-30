import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from "next/navigation"
import connectDb from '@/db/connectDb'
import User from '@/models/User'

const Username = async ({ params }) => {
  const { username } = await params;
  await connectDb();
  const user = await User.findOne({ username });

  if (!user) {
    notFound(); 
  }

  return (
    <>
      <PaymentPage username={username} />
    </>
  );
};

export default Username;
export async function generateMetadata({ params }) {
  const { username } =await params;

  return {
    title: `Support ${username} - Get Me A Chai`,
    description: `Payment page for ${username}`,
  };
}
