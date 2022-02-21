function readMoreMessages() {
  $(".right .chat").unbind("scroll").on("scroll", function() {
    //get the first message
    let firstMessage = $(this).find(".bubble:first");
    //get the position of the first message
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();

    if ($(this).scrollTop() === 0) {
      
      let targetId = $(this).data("chat");
      let skipMessage = $(this).find("div.bubble").length;
      let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

      let thisDom = $(this);
      $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
        if (data.rightSideData.trim() === "") {
          alertify.notify("Viewed all chat messages.", "error", 7);
          thisDom.find("img.message-loading").remove();
          return false;
        }

        //step 01 handle rightSide
        $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);
        //step 02 prevent scroll
        $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);
        //step 03 convert emojione convertEmoji();
        //step 04 handle imageModal
        $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);
        //step 05 grid photo
        gridPhotos(5);
        //step 06 handle attachment modal
        $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);
        //step 07 remove message loading
        thisDom.find("img.message-loading").remove();
      });
    }
  });
}

$(document).ready(function() {
  readMoreMessages();
});