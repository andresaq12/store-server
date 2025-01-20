import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from 'dotenv'

dotenv.config()

export const configureGoogleStrategy = (passport) => {
  const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback',
    scope: ['profile', 'email']
  }

  const googleStrategyCallback = async (access_token, refreshToken, profile, done) => {
    try {
      const { id, displayName, emails, photos } = profile

      const user = {
        googleId: id,
        name: displayName,
        email: emails[0].value,
        picture: photos[0].value,
        password: null
      }

      return done(null, user)
    } catch (error) {
      done(error, null)
    }
  }

  // CONFIG STRATEGY GOOGLE
  passport.use(new GoogleStrategy(googleOptions, googleStrategyCallback))
}


