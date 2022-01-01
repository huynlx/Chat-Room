function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function() {
    let fileData = $(this).prop("files")[0];
    let limit = 1048576; //byte = 1MB

    if (fileData.size > limit) {
      alertify.notify("The maximum allowed size is 1 MB.", "error", 7);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;

    let messageFromData = new FormData();
    messageFromData.append("my-attachment-chat", fileData);
    messageFromData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFromData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFromData,
      success: function(data) {
        let dataToEmit = {
          message: data.message
        };

        let myMessage = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
        let attachmentChat = `<a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">${data.message.file.fileName}</a>`;

        if (isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          myMessage.html(`${senderAvatar} ${attachmentChat}`);
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          myMessage.html(attachmentChat);
          dataToEmit.contactId = targetId;
        }

        $(`.right .chat[data-chat=${divId}]`).append(myMessage);
        nineScrollRight(divId);

        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("en").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

        $(`.person[data-chat=${divId}]`).on("livechat07.moveConversationToTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("livechat07.moveConversationToTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("livechat07.moveConversationToTop");

        socket.emit("chat-attachment", dataToEmit);

        let attachmentChatToAddModal = `
          <li>
            <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">
                ${data.message.file.fileName}
            </a>
          </li>`;
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
      },
      error: function(error) {
        alertify.notify(error.responseText, "error", 7);
      }
    });
  });
}

$(document).ready(function() {
  socket.on("response-chat-attachment", function(response) {
    let divId = "";

    let yourMessage = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
    let attachmentChat = `<a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">${response.message.file.fileName}</a>`;

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      yourMessage.html(`${senderAvatar} ${attachmentChat}`);
      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      yourMessage.html(attachmentChat);
      divId = response.currentUserId;
    }

    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(yourMessage);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("en").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

    $(`.person[data-chat=${divId}]`).on("livechat07.moveConversationToTop", function() {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("livechat07.moveConversationToTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("livechat07.moveConversationToTop");

    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let attachmentChatToAddModal = `
          <li>
            <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">
                ${response.message.file.fileName}
            </a>
          </li>`;
      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
    }
  });
});