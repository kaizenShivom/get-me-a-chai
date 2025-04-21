import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import mongoose from 'mongoose'
import User from '@/models/User'
import payment from '@/models/Payment'
import connectDb from '@/db/connectDb'

export const authOptions = {
    debug: true,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account.provider == 'github') {
                await connectDb();
                //check if the user exists
                const currentUser = await User.findOne({
                    email: user.email
                });
                if (!currentUser) {
                    //create a new user
                    const newUser = await User.create({
                        email: user.email,
                        username: user.email.split('@')[0],
                    });
                    return true;
                }
                return true;
            }
        },
        async session({ session, token, user }) {
            const dbUser=await User.findOne({email: session.user.email});
            session.user.name = dbUser.username;
            return session;
        },
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
