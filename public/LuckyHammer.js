/**
 * Created by yuto-note on 2018/02/09.
 */
$(()=>{
    $('#list').dataTable({
        "columns":[{
            "title":"ユーザ名",
            "orderable":"false",
            "width":"30%"
        },{
            "title":"ツイート内容",
            "orderable":"true",
            "width":"50%"
        },{
            "title":"時間",
            "orderable":"true",
            "width":"10%"
        },{
            "title":"画像URL",
            "width":"10%"
        }],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Japanese.json"
        }
    });
})