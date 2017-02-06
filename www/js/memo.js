//NCMB初期化
var ncmb = new NCMB("c578c67b1aa7a69c072b8f090e29e7e64ce17ebb7383d54bc3dd2c26c14fa959", "83fed666f63307fb54f97622ae48e9c201498c36511cdda006b3d3ba3cb253fa");

// メモを保存する。
function imputMemo() {
    // inputの値を取得
    var seed = $('#output1').val();
    // 取得した値が空だったら
    if (seed == null || seed == "") {
        // キャンセルアラートを表示
        $("#amozan").html("何か書いてね");
    } else {
        // メモを保存
        saveMemo(memo);
    }
}

// mBaaSへデータの保存
function saveMemo(memo) {
    // 保存先クラスを作成
    var memoData = ncmb.DataStore("MemoData");
    // MemoDataの保存総数を取得
    memoData.count()
        // MemoDataを検索
        .fetchAll()
        // 検索に成功した場合の処理
        .then(function(results) {
            // 保存総数を表示
            //console.log(results.count);
            // クラスインスタンスを生成
            var memoData = new MemoData();
            // 値を設定
            memoData.set("memo", memo);
            // 保存を実施
            memoData.save()
                .then(function() {
                    // pタグに書き込まれた内容を表示
                    $("#amozan").text(memo + " を保存したよ。");
                    // inputの値を空にする
                    $("#output1").val("");
                })
                .catch(function(err) {
                    // 保存に失敗した場合の処理
                    console.log("Not Save ! error:" + err);
                });
        })
        .catch(function(err) {
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
            .then(function(results) {
                // 検索に成功した場合の処理
                // リストを空にする
                $('ons-list').empty();
                //取得したデータの数だけ回す
                for (i = 0; i < results.length; i++) {
                    //リストの末端に追加
                    $('ons-list').append('<ons-list-item id="oya' + [i] + '" modifier="longdivider">' + results[i].memo + '<div class="right"><ons-switch class="oyaswitch"></ons-switch></div></ons-list-item>');
                }
            })
            .catch(function(error) {
                // 検索に失敗した場合の処理
                console.log("検索に失敗しました。エラー:" + error);
            })
    })
});

$(document).on('change', '.oyaswitch', function(event) {
    // clickイベントで発動する処理
    var oya = $(this).closest("ons-list-item");
    var oyaid = $(oya).attr("id");
    var idnum = oyaid.slice(3);
    var memoname = $(oya).text();
    var memoname = memoname.substring(0, memoname.indexOf(" "));
    console.log(oyaid);
    if (this.checked == true) {
        $.ajax({
            type: 'GET',
            url: 'https://api.apitore.com/api/8/word2vec-neologd-jawiki/distance?access_token=b8be493b-a34a-42d6-a5e8-7f606e3d13ee&word=' + memoname + '&num=8'
            //url: 'https://api.apitore.com/api/8/word2vec-neologd-jawiki/distance?access_token=96b1c2aa-eac1-4692-a0ad-e29d8fddd9a9&word=' + memoname + '&num=8'
        }).success(function(data) {
            var item = "";
            for (var i = 0, l = 8; i < l; i++) {
                var word = data.distances[i].word;
                var item = item + '<ons-list-item id="ko' + idnum + '_' + [i] + '" class="' + oyaid + ' ko"> ・ ' + word + '<div class="right"><ons-switch class="' + oyaid + ' koswitch"></ons-switch></div></ons-list-item>';
            }
            $("#" + oyaid).after(item);
        }).error(function(data) {
            alert('error!!!');
        });
    } else {
        $("." + oyaid).remove();
    }
});

$(document).on('change', '.koswitch', function(event) {
    // clickイベントで発動する処理
    var ko = $(this).closest("ons-list-item");
    var koid = $(ko).attr("id");
    var koclass = $(ko).attr("class");
    var koclass = koclass.substring(0, koclass.indexOf(" "));
    var idnum = koclass.slice(2);
    var memoname = $(ko).text();
    var memoname = memoname.slice(3);
    var memoname = memoname.substring(0, memoname.indexOf(" "));
    if (this.checked == true) {
        $.ajax({
            type: 'GET',
            url: 'https://api.apitore.com/api/8/word2vec-neologd-jawiki/distance?access_token=b8be493b-a34a-42d6-a5e8-7f606e3d13ee&word=' + memoname + '&num=8'
            //url: 'https://api.apitore.com/api/8/word2vec-neologd-jawiki/distance?access_token=96b1c2aa-eac1-4692-a0ad-e29d8fddd9a9&word=' + memoname + '&num=8'
        }).success(function(data) {
            var item = "";
            for (var i = 0, l = 8; i < l; i++) {
                var word = data.distances[i].word;
                var item = item + '<ons-list-item id=mago' + idnum + '_' + [i] + ' class="' + koid + '_' + idnum + ' ' + koclass + ' mago" modifier="nodivider" tappable>' + ' ・・ ' + word + '</ons-list-item>';
            }
            $("#" + koid).after(item);
        }).error(function(data) {
            alert('error!!!');
        });
    } else {
        $("." + koid + "_" + idnum).remove();
    }
});

// ランダムに保存したデータを表示する
function randamsetData() {
    var word = $('#word1').val();
    var idea = $('#output2').val();
    if (word == null || word == "") {
        var MemoData = ncmb.DataStore("MemoData");
        MemoData.fetchAll()
            .then(function(results) {
                memonano1 = results[Math.floor(Math.random() * results.length)].memo;
                memonano2 = results[Math.floor(Math.random() * results.length)].memo;
                while (memonano1 == memonano2) {
                    memonano2 = results[Math.floor(Math.random() * results.length)].memo;
                }
                $('#word1').val(memonano1);
                $('#word2').val(memonano2);
                $('#randambutton').text("保存する");
                $('#randambutton').after('<ons-button id="randambutton2" modifier="large" onclick="randamsetData2()">もう一度生み出す</ons-button>');
            })
            .catch(function(err) {
                console.log("Not Find" + err);
            });
    } else if (idea.length >= 1){
        // 保存先クラスを作成
        var MemoData = ncmb.DataStore("MemoData");
        MemoData.fetchAll()
            // 検索に成功した場合の処理
            .then(function(results) {
                // クラスインスタンスを生成
                var memoData = new MemoData();
                // 値を設定
                memoData.set("memo",idea);
                // 保存を実施
                memoData.save()
                    .then(function() {
                        // inputの値を空にする
                        $('#word1').val("");
                        $('#word2').val("");
                        $("#output2").val("");
                    })
                    .catch(function(err) {
                        // 保存に失敗した場合の処理
                        console.log("Not Save ! error:" + err);
                    })
            })
            .catch(function(err) {
                // 検索に失敗した場合の処理
            });
    } else {
      $("#output2").attr("placeholder","");
    }
}

function randamsetData2(){
  var MemoData = ncmb.DataStore("MemoData");
  MemoData.fetchAll()
      .then(function(results) {
          memonano1 = results[Math.floor(Math.random() * results.length)].memo;
          memonano2 = results[Math.floor(Math.random() * results.length)].memo;
          while (memonano1 == memonano2) {
              memonano2 = results[Math.floor(Math.random() * results.length)].memo;
          }
          $('#word1').val(memonano1);
          $('#word2').val(memonano2);
      })
      .catch(function(err) {
          console.log("Not Find" + err);
      });
}
