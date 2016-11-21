//NCMB初期化
var ncmb = new NCMB("c578c67b1aa7a69c072b8f090e29e7e64ce17ebb7383d54bc3dd2c26c14fa959"
,"83fed666f63307fb54f97622ae48e9c201498c36511cdda006b3d3ba3cb253fa");

// メモを保存する。
function imputMemo(){
    // inputの値を取得
    var memo = $('[id=output1]').val();
    // 取得した値が空だったら
    if (memo == null || memo == "") {
        // キャンセルアラートを表示
        $("#amozan").html("何か書いてね");
    // 何か書き込まれていたら
    } else {      
        // メモを保存
        saveMemo(memo);
    }
}

// mBaaSへデータの保存
function saveMemo (memo) {
// 保存先クラスを作成
var MemoData = ncmb.DataStore("MemoData");
    // MemoDataの保存総数を取得
    MemoData.count()
            // MemoDataを検索
            .fetchAll()
            // 検索に成功した場合の処理
            .then(function(results){
                // 保存総数を表示
                console.log(results.count);
                // クラスインスタンスを生成
                var memoData = new MemoData();
                // 値を設定
                memoData.set("memo", memo);
                // 保存を実施
                memoData.save()
                        .then(function (){
                            // pタグに書き込まれた内容を表示
                            $("#amozan").html(memo + " を保存したよ。"); 
                            $("#amozan").fadeOut(3000);
                            // inputの値を空にする
                            $("[id=output1]").val(""); 
                            setTimeout();
                        })
                        .catch(function (err){
                            // 保存に失敗した場合の処理
                            console.log("Not Save ! error:" + err); 
                        });
            })
            .catch(function(err){
                // 検索に失敗した場合の処理
            });
}

// onsenUIのセットアップ完了後に動作
ons.ready(function() {
    // タブを開く前に更新
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
    // テーブルを空にする
    $('table').empty();
    // memoTableを設定
    var table = document.getElementById("memoTable");
        //取得したデータの数だけ回す
        for (i=0; i<array.length; i++) {
            //テーブルの末端に追加
            $('table').append('<tr><td align="center" width="200"></td></tr>');
            // 名前の設定
            var memo = table.rows[i].cells[0];
            // テーブルの書き換え
            memo.innerHTML = array[i].memo;
        }   
}

function randamsetData(){
    randamsetData1();
    randamsetData2();
}

// ランダムに保存したデータを表示する
function randamsetData1(){
    //
    var MemoData = ncmb.DataStore("MemoData");
    MemoData.fetchAll()
            .then(function(results){
        		memonano = results[Math.floor(Math.random() * results.length)]
                //
                $(".word1").text(memonano.get("memo"));
            })
            .catch(function(err){
                console.log("Not Find" + err);
            });
}

// ランダムに保存したデータを表示する
function randamsetData2(){
    //
    var MemoData = ncmb.DataStore("MemoData");
    MemoData.fetchAll()
            .then(function(results){
        		memonano = results[Math.floor(Math.random() * results.length)]
                //
                $(".word2").text(memonano.get("memo"));
            })
            .catch(function(err){
                console.log("Not Find" + err);
            });
}
