import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";

// new line

const KUDOS_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {

        async jwt({ token, account, user }) {
            await connectToDatabase();

            if (account && user) {
                const dbUser = await UserModel.findOne({ email: user.email });

                if (!dbUser) {
                    const newUser = new UserModel({
                        email: user.email,
                        profilePicture: user.image,
                        kudos: 3,
                        lastKudosRefresh: Date.now(),
                        username: "",
                    })
                    await newUser.save();

                    token._id = newUser._id.toString();
                    token.username = newUser.username;
                    token.kudos = newUser.kudos;
                    token.lastKudosRefresh = newUser.lastKudosRefresh; // new line added
                } else {

                    // kudos refresh logic

                    const timeSinceLastRefresh = Date.now() - (dbUser.lastKudosRefresh ? dbUser.lastKudosRefresh: 0);
                    if(timeSinceLastRefresh > KUDOS_REFRESH_INTERVAL) {
                        dbUser.kudos = 3;
                        dbUser.lastKudosRefresh = Date.now();
                        await dbUser.save();
                    }

                    token._id = dbUser._id.toString();
                    token.username = dbUser.username;
                    token.kudos = dbUser.kudos;
                    token.lastKudosRefresh = dbUser.lastKudosRefresh; // new line added
                }
            }

            else if (token.email) {
                const dbUser = await UserModel.findOne({ email: token.email });

                if (dbUser) {

                    // kudos refresh logic

                    const timeSinceLastRefresh = Date.now() - (dbUser.lastKudosRefresh ? dbUser.lastKudosRefresh : 0);
                    if (timeSinceLastRefresh > KUDOS_REFRESH_INTERVAL) {
                        dbUser.kudos = 3;
                        dbUser.lastKudosRefresh = Date.now();
                        await dbUser.save();
                    }

                    token._id = dbUser._id.toString();
                    token.username = dbUser.username;
                    token.kudos = dbUser.kudos;
                    token.lastKudosRefresh = dbUser.lastKudosRefresh; // new line added
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.kudos = token.kudos;
                session.user.lastKudosRefresh = token.lastKudosRefresh; // new line added
            }

            return session;
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET
}