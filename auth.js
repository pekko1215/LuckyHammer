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
            profile.twitter_token_srcret = tokenSecret;
            process.nextTick(()=>{
                return done(null,profile)
            })
        }
    ))
    app.use(session({secret:'cattower',store:sessionStore}))
    app.use(passport.initialize());
    app.use(passport.session());
    return passport
}
