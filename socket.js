/*
 * Created by pekko1215 on 2018/02/10.
 */
const twitter = require('twitter')
module.exports = (app, http, socket, sessionStore)=> {
    const io = socket.listen(http);
    io.use((socket, next)=> {
        app.session(socket.request, socket.request.res, next);
    });
    io.sockets.on('connection', (socket)=> {
        var stream = null;
        var tokens = require('./tokens').twitter;
        var {session} = socket.request

        if (!session.passport) {
            return socket.disconnect()
        }
        var profile = session.passport.user
        var client = new twitter({
            consumer_key: tokens.consumerKey,
            consumer_secret: tokens.consumerSecret,
            access_token_key: profile.twitter_token,
            access_token_secret: profile.twitter_token_secret
        });
        console.log('connected ' + profile.displayName);
        socket.on('search', (option) => {
            if (!option || !option.target) {
                return
            }
            if (stream) {
                stream.destroy()
            }
            client.get('users/show', {screen_name: option.target})
                .then((result) => {
                    return client.stream('statuses/filter', {follow: data.id})
                })
                .then((_stream) => {
                    stream = _stream;
                    stream.on('data', (data) => {
                        if (data.retweeted_status) {
                            return
                        }
                        socket.emit('tweet', data);
                    })
                    stream.on('error', (e) => {
                        throw e;
                    })
                })
                .catch((e) => {
                    socket.emit('error', e)
                })
        })
        socket.on('stop', () =>{
            if (stream) {
                stream.destroy()
            }
        })
        socket.on('oembed',(id, next)=> {
            client.get('statuses/oembed', {id: id})
                .then((resp)=>{
                    next(resp);
                })
        })
    })
}