import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConect';
import UserModel from '@/models/user.model';

export const authOptions: NextAuthOptions = {
    providers: [
    CredentialsProvider({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
    email: { label: 'Email', type: 'text' },
    password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials: any): Promise<any> {
    await dbConnect();
    try {
    const user = await UserModel.findOne({
    $or: [
    { email: credentials.identifier },
    { username: credentials.identifier },
    ],
    });
    if (!user) {
    throw new Error('No user found with this email');
    }
    const isPasswordCorrect = await bcrypt.compare(
    credentials.password,
    user.Password
    );
    if (isPasswordCorrect) {
    return user;
    } else {
    throw new Error('Incorrect password');
    }
    } catch (err: any) {
    throw new Error(err);
    }
    },
    }),
    ],
    callbacks: {
    async jwt({ token, user }) {
    if (user) {
    token._id = user._id?.toString(); // Convert ObjectId to string
    token.Username = user.UserName;
    token.email= user.Email;
    token.mobilenumber = user.MobileNumber
    }
    return token;
    },
    async session({ session, token }) {
    if (token) {
    session.user._id = token._id;
    session.user.username = token.username;
    session.user.email = token.email;
    session.user.mobilenumber =  token.mobilenumber
    }
    return session;
    },
    },
    session: {
    strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
    signIn: '/sign-in',
    },
    };