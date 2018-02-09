const passport = require('passport');
const TwitterStrategy = require('passport-twitter')

module.exports = function(app){

    passport.serializeUser(function(user,done){
        done(null,user.id);
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
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret:'cattower'}))
    return passport
}
