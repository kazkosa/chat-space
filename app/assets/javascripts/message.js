$(function(){
  
  function appendMsgToHTML(message){
    var html_image = `<img src=${message.image_url} class="lower-message__image"></img>`;
    var html = `
      <div class="message">
        <li class="right-contents__messages__list__message">
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
      `
      +   (message.image_url? html_image:``) //画像投稿有無に応じてimgタグ(html_image)追加
      + `
        </li>
      </div>
      `;
    $(".right-contents__messages__list").append(html);
  }
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

        appendMsgToHTML(message);

        var target = $(".right-contents__messages__list__message").last();
        var position = target.offset().top + $(".right-contents__messages").scrollTop();
        $(".right-contents__messages").animate({scrollTop: position}, 300, 'swing');
        

        $("#message_content").val("");
        $("input[type='file']").val("");
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
});