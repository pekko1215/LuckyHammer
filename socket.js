/*
 * Created by pekko1215 on 2018/02/10.
 */
const twitter = require('twitter')
module.exports = function (app,http,socket,sessionStore) {
  const io = socket.listen(http);
  io.use(function(socket,next){
      app.session(socket.request,socket.request.res,next);
      });
  io.sockets.on('connection',function(socket){
      var stream = null;
      var tokens = require('./tokens').twitter;
      var {session} = socket.request

      if(!session.passport){
      return socket.disconnect()
      }
      var profile = session.passport.user
      var client = new twitter({
consumer_key:tokens.consumerKey,
consumer_secret:tokens.consumerSecret,
access_token_key:profile.twitter_token,
access_token_secret:profile.twitter_token_secret
})
      console.log('connected '+profile.displayName);
      socket.on('search',(option)=>{
        if(!option || !option.target){return}
        if(stream){
        stream.destroy()
        }
        client.get('users/show',{screen_name:option.target},(err,data)=>{
          if(err){
            socket.emit('error',err);
            return
          }
          client.stream('statuses/filter',{follow:data.id},function(_stream){
            stream = _stream;
            stream.on('data',(data)=>{
              if(data.retweeted_status){return}
              socket.emit('tweet',data);
              })
            })
            stream.on('error',(e)=>{socket.emit('error',e)})
          })
        }) 
})
}
