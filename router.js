module.exports = function(app,server,passport){
    app.get('/',function(req,res,next){
        if(req.user){
            console.log(req.user);
            next();
            return;
        }
        passport.autheniticate('twitter')(req,res,next);
    })
    app.get('/oauth',passport.authenticate('twitter',{
        successRedirect:'/',
        failureRedirect:'/error'
    }))
    app.get('/error',function(req,res,next){
        res.send("失敗じゃ")
    })
}