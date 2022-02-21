function addFriendsToGroup() {
  $("ul#group-chat-friends").find("div.add-user").bind("click", function () {
    let uid = $(this).data("uid");
    $(this).remove();
    let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

    let promise = new Promise(function (resolve, reject) {
      $("ul#friends-added").append(html);
      $("#groupChatModal .list-user-added").show();
      resolve(true);
    });
    promise.then(function (success) {
      $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
    });
  });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function () {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function (index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriends(element) {
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input-search-friends-to-add-group-chat").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if (!keyword.length) {
      alertify.notify("You have not entered the search text.", "error", 7);
      return false;
    }
    if (!regexKeyword.test(keyword)) {
      alertify.notify("Special characters are not accepted.", "error", 7);
      return false;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $("ul#group-chat-friends").html(data); //data là html chứ ko phải json
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();
      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat() {
  $("#btn-create-group-chat").unbind("click").on("click", function () {
    let countUsers = $("ul#friends-added").find("li");
    if (countUsers.length < 2) {
      alertify.notify("Please select friends to add to the group, minimum 2 friends.", "error", 7);
      return false;
    }

    let groupChatName = $("#input-name-group-chat").val();
    let regexGroupChatName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if (!regexGroupChatName.test(groupChatName) || groupChatName.length < 5 || groupChatName > 30) {
      alertify.notify("Set the group name to be limited to 5-30 characters and cannot contain special characters.", "error", 7);
      return false;
    }

    let membersFinal=[];
    let arrayIds = [];

    $("ul#friends-added").find("li").each(function (index, item) {
      arrayIds.push({ "userId": $(item).data("uid") });
      membersFinal.push({
        "id":$(item).data("uid"),
        "avatar":$(item).find(".user-avatar img").attr('src'),
        "username":$(item).find(".user-name p").text().trim(),
        "address":$(item).find(".user-address span").text().trim()
      })
    });
    membersFinal.push({
      "id":$('#dropdown-navbar-user').data("uid"),
      "avatar":$("#navbar-avatar").attr('src'),
      "username":$("#navbar-username").text().trim(),
      "address":$("#input-change-address").val().trim()
    })

    Swal.fire({
      title: `Are you sure you want to create a chat group &nbsp;${groupChatName} &nbsp;?`,
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2980B9",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Confirm!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (!result.value) {
        return false;
      }
      $.post("/group-chat/add-new", {
        arrayIds: JSON.stringify(arrayIds),
        groupChatName: groupChatName
      }, function (data) {
        console.log(data);
        //B01 ẩn modal tạo nhóm trò chuyện mới sau khi tạo thành công nhóm trò chuyện
        $("#input-name-group-chat").val();
        $("#btn-cancel-group-chat").click();
        $("#groupChatModal").modal("hide");
        //B02 handle leftSide.ejs
        let subGroupChatName = data.groupChat.name;
        if (subGroupChatName.length > 15) {
          subGroupChatName = subGroupChatName.substr(0, 14)+'...';
        }
        let leftSideData = `<a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
                              <li class="person group-chat" data-chat="${data.groupChat._id}">
                                  <div class="left-avatar">
                                      <img src="images/users/group-avatar.png" alt="">
                                  </div>
                                  <span class="name">
                                      <span class="group-chat-name">
                                          ${subGroupChatName}<span></span>
                                      </span>
                                  </span>
                                  <span class="time"></span>
                                  <span class="preview"></span>
                              </li>
                          </a>`;
        $("#all-chat").find("ul").prepend(leftSideData);
        $("#group-chat").find("ul").prepend(leftSideData);

        //B03 handle rightSide
        let rightSideData = `
          <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
            <div class="top">
              <span>To: <span class="name" style="color: #FF7675;">
              ${data.groupChat.name} Group
              </span></span>
              <span>
              <span class="chat-menu-right">
                  <a title='Attachments' href="#attachmentsModal_${data.groupChat._id}" class="show-attachments"
                      data-toggle="modal">
                      
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a title='Images' href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                      
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a title='Members' href="#groupMembersModal_${data.groupChat._id}" class="number-members" data-toggle="modal">
                      <span class="show-number-members">
                          ${data.groupChat.userAmount}
                      </span>
                      <i class="fa fa-users"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
          </span>
            </div>
            <div class="content-chat">
              <div class="chat chat-in-group" data-chat="${data.groupChat._id}"></div>
            </div>
            <div class="write" data-chat="${data.groupChat._id}">
                        <input type="text" id="write-chat-${data.groupChat._id}" class="write-chat chat-in-group"
                            data-chat="${data.groupChat._id}">
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                            <label title="Images" for="image-chat-${data.groupChat._id}">
                                <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
                                    class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label title="Attachments" for="attachment-chat-${data.groupChat._id}">
                                <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat"
                                    class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}">
                                <i class="fa fa-paperclip"></i>
                            </label>
                            <a class="icon-send" data-chat="${data.groupChat._id}"><i class="fa fa-send-o"></i></a>
                        </div>
                    </div>
            </div>
        `;
        $("#screen-chat").prepend(rightSideData);

        //B04 call function changeSreenChat in mainConfig
        changeScreenChat();


        
        //B05 handle image modal
        let imageModalData = `
          <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Uploaded Images</h4>
                    </div>
                    <div class="modal-body">
                        <div class="all-images" style="visibility: hidden;"></div>
                    </div>
                </div>
            </div>
          </div>
        `;
        $("body").append(imageModalData);

        //B06 call function gridPhotos in mainConfig
        gridPhotos(5);

        //B07 handle attachment modal
        let attachmentModalData = `
          <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Tệp đã tải lên</h4>
                    </div>
                    <div class="modal-body">
                        <ul class="list-attachments"></ul>
                    </div>
                </div>
            </div>
          </div>
        `;
        $("body").append(attachmentModalData);

        let groupMembersModalData = `
          <div class="modal fade" id="groupMembersModal_${data.groupChat._id}" role="dialog">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Chat group members</h4>
                  </div>
                  <div class="modal-body">
                    <ul class="membersList">

                    </ul>              
                  </div>
              </div>
            </div>
          </div>
          `;
        $("body").append(groupMembersModalData);

        let members = membersFinal.map(function(user) { 
          if(user.id===$('#dropdown-navbar-user').data("uid")){
            return ` <li class="_membersList" data-uid="${user._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="${user.avatar}" alt="">
                </div>
                <div class="user-name is-you">
                    <p>
                        ${user.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${user.address}</span>
                </div>
                <div data-uid="${user._id}" class="is-you">
                    <span style="font-weight: bold;">( You )</span>
                </div>
            </div>
        </li>
            `
          }
          return `<li class="_membersList" data-uid="${user.id}">
             <div class="contactPanel">
                 <div class="user-avatar">
                     <img src="${user.avatar}" alt="">
                 </div>
                 <div class="user-name">
                     <p>
                         ${user.username}
                     </p>
                 </div>
                 <br>
                 <div class="user-address">
                     <span>&nbsp${user.address}</span>
                 </div>
                 <div class="user-talk" data-uid="${user.id}">
                     Chat
                 </div>
             </div>
           </li>`                                    
        });

        $(`#groupMembersModal_${data.groupChat._id}`).find(".membersList").append(members);

        //B08 emit created new group
        socket.emit("new-group-created", { groupChat: data.groupChat, membersFinal: membersFinal });

        //B10 update online
        socket.emit("check-status");

        userTalk();

      }).fail(function (response) {
        alertify.notify(response.responseText, "error", 7);
      });
    });
  });
}

$(document).ready(function () {
  $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);
  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);
  callCreateGroupChat();
  socket.on("response-new-group-created", function (response) {
    console.log(response);
    //B01 ẩn modal tạo nhóm trò chuyện mới sau khi tạo thành công nhóm trò chuyện
    //B02 handle leftSide.ejs
    let subGroupChatName = response.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 14)+'...';
    }
    let leftSideData = `<a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
                          <li class="person group-chat" data-chat="${response.groupChat._id}">
                              <div class="left-avatar">
                                  <img src="images/users/group-avatar.png" alt="">
                              </div>
                              <span class="name">
                                  <span class="group-chat-name">
                                      ${subGroupChatName}<span></span>
                                  </span>
                              </span>
                              <span class="time"></span>
                              <span class="preview"></span>
                          </li>
                      </a>`;
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#group-chat").find("ul").prepend(leftSideData);

    //B03 handle rightSide
    let rightSideData = `
      <div class="right tab-pane" data-chat="${response.groupChat._id}" id="to_${response.groupChat._id}">
      <div class="top">
      <span>To: <span class="name" style="color: #FF7675;">
      ${response.groupChat.name} Group
      </span></span>
      <span>
      <span class="chat-menu-right">
          <a title='Attachments' href="#attachmentsModal_${response.groupChat._id}" class="show-attachments"
              data-toggle="modal">
              
              <i class="fa fa-paperclip"></i>
          </a>
      </span>
      <span class="chat-menu-right">
          <a href="javascript:void(0)">&nbsp;</a>
      </span>
      <span class="chat-menu-right">
          <a title='Images' href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
              
              <i class="fa fa-photo"></i>
          </a>
      </span>
      <span class="chat-menu-right">
          <a href="javascript:void(0)">&nbsp;</a>
      </span>
      <span class="chat-menu-right">
          <a title='Members' href="#groupMembersModal_${response.groupChat._id}" class="number-members" data-toggle="modal">
              <span class="show-number-members">
                  ${response.groupChat.userAmount}
              </span>
              <i class="fa fa-users"></i>
          </a>
      </span>
      <span class="chat-menu-right">
          <a href="javascript:void(0)">&nbsp;</a>
      </span>
  </span>
    </div>
        <div class="content-chat">
          <div class="chat chat-in-group" data-chat="${response.groupChat._id}"></div>
        </div>
        <div class="write" data-chat="${response.groupChat._id}">
        <input type="text" id="write-chat-${response.groupChat._id}" class="write-chat chat-in-group"
            data-chat="${response.groupChat._id}">
        <div class="icons">
            <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
            <label title="Images" for="image-chat-${response.groupChat._id}">
                <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat"
                    class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
                <i class="fa fa-photo"></i>
            </label>
            <label title="Attachments" for="attachment-chat-${response.groupChat._id}">
                <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat"
                    class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}">
                <i class="fa fa-paperclip"></i>
            </label>
            <a class="icon-send" data-chat="${response.groupChat._id}"><i class="fa fa-send-o"></i></a>
        </div>
    </div>
      </div>
    `;
    $("#screen-chat").prepend(rightSideData);

    //B04 call function changeSreenChat in mainConfig
    changeScreenChat();

    //B05 handle image modal
    let imageModalData = `
      <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Uploaded Images</h4>
                </div>
                <div class="modal-body">
                    <div class="all-images" style="visibility: hidden;"></div>
                </div>
            </div>
        </div>
      </div>
    `;
    $("body").append(imageModalData);

    //B06 call function gridPhotos in mainConfig
    gridPhotos(5);

    //B07 handle attachment modal
    let attachmentModalData = `
      <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Tệp đã tải lên</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachments"></ul>
                </div>
            </div>
        </div>
      </div>
    `;
    $("body").append(attachmentModalData);

    //B12
    let groupMembersModalData = `
    <div class="modal fade" id="groupMembersModal_${response.groupChat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Chat group members</h4>
            </div>
            <div class="modal-body">
              <ul class="membersList">
              </ul>              
            </div>
        </div>
      </div>
    </div>
    `;
    $("body").append(groupMembersModalData);

    let members = response.membersFinal.map(function(user) { 
      if(user.id===$('#dropdown-navbar-user').data("uid")){
        return ` <li class="_membersList" data-uid="${user._id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="${user.avatar}" alt="">
            </div>
            <div class="user-name is-you">
                <p>
                    ${user.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>&nbsp ${user.address}</span>
            </div>
            <div data-uid="${user._id}" class="is-you">
                <span style="font-weight: bold;">( You )</span>
            </div>
        </div>
    </li>
        `
      }
      return `<li class="_membersList" data-uid="${user.id}">
         <div class="contactPanel">
             <div class="user-avatar">
                 <img src="${user.avatar}" alt="">
             </div>
             <div class="user-name">
                 <p>
                     ${user.username}
                 </p>
             </div>
             <br>
             <div class="user-address">
                 <span>&nbsp${user.address}</span>
             </div>
             <div class="user-talk" data-uid="${user.id}">
                 Chat
             </div>
         </div>
       </li>`                                    
    });

    $(`#groupMembersModal_${response.groupChat._id}`).find(".membersList").append(members);

    //B08 emit created new group
    //B09
    socket.emit("member-received-group-chat", { groupChatId: response.groupChat._id });
    //B10 update online
    socket.emit("check-status");

    //B11
    userTalk();
  });
});