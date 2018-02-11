/**
 * Created by yuto-note on 2018/02/09.
 */
$(() => {
    var falseMedia = [];
    var trueMedia = [];
    var currentMedia;
    var dataTable = $('#list').dataTable({
        "columns": [{
            "title": "ユーザ名",
            "orderable": "false",
            "width": "10%",
            "data": "in_reply_to_screen_name"
        }, {
            "title": "ツイート内容",
            "orderable": "true",
            "width": "70%",
            "data": "text"
        }, {
            "title": "時間",
            "orderable": "true",
            "width": "10%",
            "data": "created_at"
        }, {
            "title": "画像URL",
            "width": "10%",
            "data": "entities"
        }],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Japanese.json"
        },
        aaSorting: [[2, "asc"]],
        fnCreatedRow: function (nRow, aData, iDataIndex) {
            var $nRow = $(nRow);
            var $td = $nRow.find('td').eq(3);
            $td.html('')
            if (!aData.entities.media) {
                return
            }
            aData.entities.media.forEach((media) => {
                var $img = $('<img>', {src: media.media_url_https, width: "32px"});
                $td.append($img)
            })
            $nRow.click(()=>{
                socket.emit('oembed',aData.id_str,(resp)=>{
                    $('#embedContainer').html(resp.html);
                    $('#truemedia').prop('disabled',false);
                    $('#falsemedia').prop('disabled',false);
                    currentMedia = aData;
                })
            })
        }
    });
    var socket = io.connect('/');
    window.dataTable = dataTable
    socket.on('tweet', function (data) {
        data.created_at = (new Date(data.created_at)).toLocaleString()
        dataTable.fnAddData(data);
    });
    window.socket = socket
    var timer = null;
    $('#start').click(() => {
        if (timer) {
            clearInterval(timer);
        }
        socket.emit('search', {target: $('#target').val()})
        $('#start').prop('disabled', true);
        $('#stop').prop('disabled', false);
        var interval = 60
        var countDown = () => {
            $('#stop').text(`${interval}後に自動停止します。`);
            if (!interval--) {
                $('#stop').click();
            }
        }
        timer = setInterval(countDown, 1000)
        countDown();
    })
    $('#stop').click(() => {
        $('#stop').text('停止');
        clearInterval(timer);
        socket.emit('stop');
        $('#start').prop('disabled', false);
        $('#stop').prop('disabled', true);
    })
    $('#truemedia').click(()=>{
        if(trueMedia.find((m)=>{
            return m.id_str == currentMedia.id_str
            })){
            return;
        }
        $('#truemediaOption').append($('<select/>',{
            text:currentMedia.media.media_url_https
        }))
        trueMedia.push(currentMedia);
    })
    $('#falsemedia').click(()=>{
        if(falseMedia.find((m)=>{
                return m.id_str == currentMedia.id_str
            })){
            return;
        }
        $('#falsemediaOption').append($('<select/>',{
            text:currentMedia.media.media_url_https
        }))
        falseMedia.push(currentMedia);
    })
})
