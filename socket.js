/*
 * Created by pekko1215 on 2018/02/10.
 */
//socket.ioによる通信
const twitter = require('twitter')
module.exports = (app, http, socket, sessionStore)=> {
    //socket.ioの初期化
    const io = socket.listen(http);
    //expressのセッションをとってくる
    io.use((socket, next)=> {
        app.session(socket.request, socket.request.res, next);
    });
    //接続時
    io.sockets.on('connection', (socket)=> {
        var stream = null;
        var tokens = require('./tokens').twitter;
        var {session} = socket.request
        //passportのセッションがなければ切断
        if (!session.passport) {
            return socket.disconnect()
        }
        //profileのトークンから認証情報を作成
        var profile = session.passport.user
        var client = new twitter({
            consumer_key: tokens.consumerKey,
            consumer_secret: tokens.consumerSecret,
            access_token_key: profile.twitter_token,
            access_token_secret: profile.twitter_token_secret
        });
        console.log('Connected ' + profile.displayName);
        //searchイベント
        //option : Object
        //option.target : 対象となるscreen_name
        socket.on('search', (option) => {
            if (!option || !option.target) {
                return
            }
            if (stream) {
                stream.destroy()
            }
            //userIdをscreen_nameから取得
            client.get('users/show', {screen_name: option.target})
                .then((result) => {
                    return client.stream('statuses/filter', {follow: result.id})
                })
                .then((_stream) => {
                    stream = _stream;
                    stream.on('data', (data) => {
                        //リツイートは除外
                        if (data.retweeted_status) {
                            return
                        }
                        //ソケットに送信
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
        //ストリームの停止
        socket.on('stop', () =>{
            if (stream) {
                stream.destroy();
            }
        })
        //埋め込みようのHTMLを作成
        socket.on('oembed',(id, next)=> {
            client.get('statuses/oembed', {id: id})
                .then((resp)=>{
                    next(resp);
                })
        })
        socket.on('disconnect',()=>{
            if(stream){
                stream.destroy();
            }
            console.log('Disconnected ' + profile.displayName);
        })
    })
}