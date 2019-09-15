$(function(){
  //messageのHTMLを作成して返す
  function appendMsgToHTML(message){
    var html_image = message.image_url ? `<img src=${message.image_url} class="lower-message__image"></img>` : ``;
    var html = `
      <li class="right-contents__messages__list__message" data-message-id="${message.id}">
        <div class="right-contents__messages__list__message__usertime">
          <p class="right-contents__messages__list__message__usertime_user">
            ${message.user_name}
          </p>
          <p class="right-contents__messages__list__message__usertime_time">
            ${message.created_at}
          </p>
        </div>
        <p class="right-contents__messages__list__message__text">
          ${message.content}
        </p>
        ${html_image}
      </li>
      `;

    return html;
  }
  //リクエストを受けてリロード。要すればhtmlをappend
  function reloadMessages(){
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    last_message_id = $(".right-contents__messages__list__message").last().data("message-id");

    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      //追加するHTMLの入れ物を作る
      var insertHTML = '';
      //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
      //メッセージが入ったHTMLを取得
      //console.log(messages);
      if(messages.length !== 0){
        messages.forEach(function(message){
          insertHTML += appendMsgToHTML(message);
        });
        //メッセージを追加
        $(".right-contents__messages__list").append(insertHTML);

        var target = $(".right-contents__messages__list__message").last();
        var position = target.offset().top + $(".right-contents__messages").scrollTop();
        $(".right-contents__messages").animate({scrollTop: position}, 300, 'swing'); 
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  //Send btnによる発火処理
  $("#new_message").on("submit",function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var message = $("#message_content").val();
    var url =$(this).attr("action");
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false
    })
    .done(function(message){
      if(message.created_at){
        //validete結果passした場合の処理
        var html = appendMsgToHTML(message);
        $(".right-contents__messages__list").append(html);

        var target = $(".right-contents__messages__list__message").last();
        var position = target.offset().top + $(".right-contents__messages").scrollTop();
        $(".right-contents__messages").animate({scrollTop: position}, 300, 'swing');
        
        $("#new_message")[0].reset();
        $(".new__message__submit-btn").removeAttr("disabled");

      }else{
        //validete結果failした場合の処理
        alert("メッセージを入力してください");
        $(".new__message__submit-btn").removeAttr("disabled");
      }
    })
    //500or404error時
    .fail(function(){
      alert("Error");
    })
  });

  //Automatic Updating per 5sec
  var url_current = location.pathname;
  if (  url_current.match(/^\/groups\/\d+\/messages$/) ){
    setInterval(reloadMessages, 5000);
  }
});