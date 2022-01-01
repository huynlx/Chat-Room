$(document).ready(function() {
  $("#link-read-more-all-chat").bind("click", function() {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    $("#link-read-more-all-chat").css("display", "none");
    $(".read-more-all-chat-loading").css("display", "inline-block");
    
    $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
      if (data.leftSideData.trim() === "") {
        alertify.notify("Viewed all chats.", "error", 7);
        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".read-more-all-chat-loading").css("display", "none");
        return false;
      }

      //step 01 handle leftside
      $("#all-chat").find("ul").append(data.leftSideData);
      //step 02 handle scroll
      resizeNineScrollLeft();
      nineScrollLeft();
      //step 03  handle rightside
      $("#screen-chat").append(data.rightSideData);
      //step 04 call function changeScreenChat
      changeScreenChat();
      //step 05 convert emojione
      //step 06 handle image modal
      $("body").append(data.imageModalData);
      //step 07 call function gridPhotos
      gridPhotos(5);
      //step 08 handle attachment modal
      $("body").append(data.attachmentModalData);
      //step 09 check online
      socket.emit("check-status");

      $("#link-read-more-all-chat").css("display", "inline-block");
      $(".read-more-all-chat-loading").css("display", "none");

      //step 11
      readMoreMessages();

      //zoomImageChat();
      userTalk();

      $("body").append(data.groupMembersModal);
    });
  });
});