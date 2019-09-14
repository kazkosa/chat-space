$(function(){
  
  //検索結果を表示
  function buildHTML_SearchResult(user){
    var html = `
      <div class="chat-group-user">
        <p class="chat-group-user__name">
          ${user.name}
        </p>
        <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user_id="${user.id}", data-user_name="${user.name}" >
          追加
        </a>
      </div>
    `;
    $(".search_result").append(html);
  }
  //検索ヒットしなかったとき
  function buildHTML_SearchResult_NoHit(text){
    var html = `
      <div class="chat-group-user">
          ${text}
      </div>
    `;
    $(".search_result").append(html);
  }
  //グループメンバー候補に追加
  function buildHTML_AddMember(user_id, user_name){
    var html = `
      <div class="chat-group-user clearfix js-chat-member" id="chat-group-user-${user_id}">
        <input name="group[user_ids][]" type="hidden" value=${user_id}>
        <p class="chat-group-user__name">${user_name}</p>
        <a class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn" data-user_id="${user_id}", data-user_name="${user_name}">削除</a>
      </div>
    `;
    $(".chat-group-users").append(html);
  }

  //検索ワードが入力される度発火
  $("#user-search-field").on("keyup", function(e){
    e.preventDefault();
    $(".search_result").empty();  //検索結果初期化
    var input = $("#user-search-field").val();

    url = "/users";
    if(input !=="" ){             //空文字対策
      $.ajax({
        url: url,
        type:"GET",
        data: {keyword: input },
        dataType: "json",
      })
      .done(function(users){
        if(users.length !== 0){
          users.forEach(function(user){
            buildHTML_SearchResult(user);
          });
        }else{
          buildHTML_SearchResult_NoHit("一致するユーザーが見つかりません");
        }
      })
      .fail(function(){
        console.log("ユーザー検索に失敗しました");
        alert("ユーザー検索に失敗しました");
      })
    }   
  })
  //Event triggered By Clicking Add button
  $(document).on("click",".user-search-remove", function(e){
    e.preventDefault();

    var selected_user_id = $(this).data("user_id");
    var selected_user_name = $(this).data("user_name");
    
    $(this).parent().remove();
  });

  //Event triggered By Clicking Remove button
  $(document).on("click",".user-search-add", function(e){
    e.preventDefault();

    var selected_user_id = $(this).data("user_id");
    var selected_user_name = $(this).data("user_name");
    buildHTML_AddMember(selected_user_id,selected_user_name);
    $(this).parent().remove();
    
  });
});