/**
 * Created by yuto-note on 2018/02/09.
 */
$(()=>{
    var dataTable = $('#list').dataTable({
        "columns":[{
            "title":"ユーザ名",
            "orderable":"false",
            "width":"10%",
            "data":"in_reply_to_screen_name"
        },{
            "title":"ツイート内容",
            "orderable":"true",
            "width":"70%",
            "data":"text"
        },{
            "title":"時間",
            "orderable":"true",
            "width":"10%",
            "data":"created_at"
        },{
            "title":"画像URL",
            "width":"10%",
            "data":"entities"
        }],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Japanese.json"
        },
        aaSorting:[[2,"asc"]],
        fnCreatedRow:function(nRow,aData,iDataIndex){
          var $nRow = $(nRow);
          var $td = $nRow.find('td').eq(3);
          $td.html('')
          if(!aData.entities.media){return}
          aData.entities.media.forEach((media)=>{
              console.log(media)
              var $img = $('<img>',{src:media.media_url_https,width:"32px"});
              $td.append($img)
          })
        }
    });
    var socket = io.connect('/');
    window.dataTable = dataTable
    socket.on('tweet', function(data) {
        data.created_at = (new Date(data.created_at)).toLocaleString()
        dataTable.fnAddData(data);
        //dataTable.fnSort([2,"desc"])
    });
    window.socket = socket

    $('#start').click(()=>{
      socket.emit('search',{target:$('#target').val()})
    })
})
