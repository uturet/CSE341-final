// src/auth/passport.ts
import dotenv from "dotenv";
dotenv.config();

import passport from 'passport';
import { UserModel } from "../models/user.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type {Profile, VerifyCallback} from 'passport-google-oauth20'

// Determine the correct callback URL based on environment
const getCallbackURL = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production: use full absolute URL
    return 'https://cse341-final-j0y2.onrender.com/auth/google/callback';
  } else {
    // Development: use localhost
    return 'http://localhost:3000/auth/google/callback';
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: getCallbackURL(),
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          user = await UserModel.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;