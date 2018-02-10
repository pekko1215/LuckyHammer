/**
 * Created by pekko1215 on 2018/02/10.
 */
module.exports = function (app,http,socket,sessionStore) {
    const cookieParser = require('cookie-parser');
    const parseCookie = cookieParser('cattower');

    var io = socket.listen(http);

    io.set('authorization',function(req,next){
        console.log(req)
        if(req.headers.cookie){
            var cookie = req.headers.cookie;
            parseCookie(req,null,function(err){
                var sessionID = req.signedCookies['connect.sid']
                req.sessionID = sessionID;
                next(null,true)
            })
        }else{
            return next('Not Found Cookie',false);
        }
    })
    io.sockets.on('connection', function (socket) {
        console.log('sessionID ', socket.handshake.sessionID);
        var handshake = socket.handshake;
        // セッションのデータにアクセス
        console.log('sessionID is', handshake.sessionID);

        // 1 分ごとにセッションを更新するループ
        var intervalID = setInterval(function () {
            // 一度セッションを再読み込み
            handshake.session.reload(function() {
                // lastAccess と maxAge を更新
                handshake.session.touch().save();
            });
        }, 1000 * 60);

        socket.on('disconnect', function () {
            console.log('sessionID is', handshake.sessionID, 'disconnected');
            // セッションの更新を停止
            clearInterval(intervalID);
        });
    });
}
