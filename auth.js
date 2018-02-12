const TwitterStrategy = require('passport-twitter')
const session = require('express-session')
module.exports = (app,passport,sessionStore)=>{

    passport.serializeUser((user,done)=>{
        done(null,user);
    })

    passport.deserializeUser((obj,done)=>{
        done(null,obj)
    })

    passport.use(new TwitterStrategy(
        require('./tokens').twitter,
        (token,tokenSecret,profile,done)=>{
            profile.twitter_token = token;
            profile.twitter_token_secret = tokenSecret;
            process.nextTick(()=>{
                return done(null,profile)
            })
        }
    ))
    app.use((app.session = session({secret:'cattower',store:sessionStore})))
    app.use(passport.initialize());
    app.use(passport.session());
    return passport
}
