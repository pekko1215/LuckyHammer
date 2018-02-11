const TwitterStrategy = require('passport-twitter')
const session = require('express-session')
module.exports = function(app,passport,sessionStore){

    passport.serializeUser(function(user,done){
        done(null,user);
    })

    passport.deserializeUser(function(obj,done){
        done(null,obj)
    })

    passport.use(new TwitterStrategy(
        require('./tokens').twitter,
        (token,tokenSecret,profile,done)=>{
            profile.twitter_token = token;
            profile.displayName = profile.displayName.slice(8)
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
