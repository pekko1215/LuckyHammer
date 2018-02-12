module.exports = (app,server,passport)=>{
    app.get('/',(req,res,next)=>{
        if(req.user){
            next();
            return;
        }
        res.redirect('/twitter')    
    })
    app.get('/twitter',passport.authenticate('twitter'))
    app.get('/oauth',passport.authenticate('twitter',{
        successRedirect:'/',
        failureRedirect:'/error'
    }))
    app.get('/error',(req,res,next)=>{
        res.send("失敗じゃ")
    })
}
