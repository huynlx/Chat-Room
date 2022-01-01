function imageChat(divId) {
    $(`#image-chat-${divId}`).unbind("change").on("change", function() {
      let fileData = $(this).prop("files")[0];
      let math = ["image/png", "image/jpg", "image/jpeg"];
      let limit = 1048576; //byte = 1MB
  
      if ($.inArray(fileData.type, math) === -1) {
        alertify.notify("Invalid file type.", "error", 7);
        $(this).val(null);
        return false;
      }

      if (fileData.size > limit) {
        alertify.notify("The maximum allowed size is 1 MB.", "error", 7);
        $(this).val(null);
        return false;
      }
      let targetId = $(this).data("chat");
      let isChatGroup = false;
  
      let messageFromData = new FormData();
      messageFromData.append("my-image-chat", fileData);
      messageFromData.append("uid", targetId);
  
      if ($(this).hasClass("chat-in-group")) {
        messageFromData.append("isChatGroup", true);
        isChatGroup = true;
      }
      $.ajax({
        url: "/message/add-new-image",
        type: "post",
        cache: false,
        contentType: false,
        processData: false,
        data: messageFromData,
        success: function(data) {
          let dataToEmit = {
            message: data.message
          };
  
          let myMessage = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
          let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;
  
          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
            myMessage.html(`${senderAvatar} ${imageChat}`);
            increaseNumberMessageGroup(divId);
            dataToEmit.groupId = targetId;
          } else {
            myMessage.html(imageChat);
            dataToEmit.contactId = targetId;
          }
  
          $(`.right .chat[data-chat=${divId}]`).append(myMessage);
          nineScrollRight(divId);
          zoomImageChat()
  
          $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("en").startOf("seconds").fromNow());
          $(`.person[data-chat=${divId}]`).find("span.preview").html("Image...");
  
          $(`.person[data-chat=${divId}]`).on("livechat.moveConversationToTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("livechat.moveConversationToTop");
          });
          $(`.person[data-chat=${divId}]`).trigger("livechat.moveConversationToTop");
  
          socket.emit("chat-image", dataToEmit);
  
          let imageChatToAddModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">`;

          $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
        },
        error: function(error) {
          alertify.notify(error.responseText, "error", 7);
        }
      });
    });
  }
  
  $(document).ready(function() {
    socket.on("response-chat-image", function(response) {
      let divId = "";
  
      let yourMessage = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
      let imageChat = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat">`;
      
      if (response.currentGroupId) {
        let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
        yourMessage.html(`${senderAvatar} ${imageChat}`);
        divId = response.currentGroupId;
  
        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
          increaseNumberMessageGroup(divId);
        }
      } else {
        yourMessage.html(imageChat);
        divId = response.currentUserId;
      }
  
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        $(`.right .chat[data-chat=${divId}]`).append(yourMessage);
        nineScrollRight(divId);
        zoomImageChat();
        $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
      }
  
      $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("en").startOf("seconds").fromNow());
      $(`.person[data-chat=${divId}]`).find("span.preview").html("Image...");
  
      $(`.person[data-chat=${divId}]`).on("livechat.moveConversationToTop", function() {
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("livechat.moveConversationToTop");
      });
      $(`.person[data-chat=${divId}]`).trigger("livechat.moveConversationToTop");
  
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        let imageChatToAddModal = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}">`;
        $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
      }
    });
  });