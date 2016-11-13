//NCMB初期化
var ncmb = new NCMB("c578c67b1aa7a69c072b8f090e29e7e64ce17ebb7383d54bc3dd2c26c14fa959"
,"83fed666f63307fb54f97622ae48e9c201498c36511cdda006b3d3ba3cb253fa");

// 【mBaaS】データの保存
function saveMemo (memo) {
// 保存先クラスを作成
var MemoData = ncmb.DataStore("MemoData");
// クラスインスタンスを生成
var memoData = new MemoData();
// 値を設定
memoData.set("memo", memo);
// 保存を実施
memoData.save()
         .then(function (){
             // 保存に成功した場合の処理
             console.log("Save OK!");
         })
         .catch(function (error){
             // 保存に失敗した場合の処理
             console.log("Not Save ! error:" + error); 
         });
}

// 名前入力アラートの表示
function imputMemo(){
    // 入力アラートを表示
    var memo = $('[name=memodesu]').val();
    if (memo == null || memo == "") {
        $("#list-page p").html("保存がキャンセルされました");
    } else {      
        // メモを保存
        saveMemo(memo);
        $("#amozan").html(memo + "を保存したよ。"); 
        $('[name=memodesu]').val(""); 
    }
}

ons.ready(function() {
    document.getElementById('tab').addEventListener('prechange', function() {
        // 保存先クラスを作成
        var memodata = ncmb.DataStore("MemoData");
        // createDataの降順でデータを取得するように設定する
        memodata.order("createData", true)
             .fetchAll()
             .then(function(results){
                // 検索に成功した場合の処理
                console.log("検索に成功しました。");
                // テーブルにデータをセット
                setData(results);
              })
             .catch(function(error){
                // 検索に失敗した場合の処理
                console.log("検索に失敗しました。エラー:" +error);
              })
    })
});

// テーブルにデータを設定
function setData(array) {
   $('table').empty();
   var table = document.getElementById("memoTable");
    for (i=0; i<array.length; i++) {
        $('table').append('<tr><td align="center" width="200"></td></tr>');
        // 名前の設定
        var memo = table.rows[i].cells[0];
        memo.innerHTML = array[i].memo;
    }   
}