$(document).ready(function() {
    $("#link-read-more-contacts-received").bind("click", function() {
      let skipNumber = $("#request-contact-received").find("li").length;
      $("#link-read-more-contacts-received").css("display", "none");
      $(".read-more-contacts-loading").css("display", "inline-block");
      $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`, function(newContactUsers) {
        if (!newContactUsers.length) {
          alertify.notify("You no longer have any friend requests to view.", "error", 7);
          $("#link-read-more-contacts-received").css("display", "inline-block");
          $(".read-more-contacts-loading").css("display", "none");
          return false;
        }
        newContactUsers.forEach(function(user) {
          $("#request-contact-received").find("ul").append(`<li class="_contactList" data-uid="${user._id}">
                                                          <div class="contactPanel">
                                                              <div class="user-avatar">
                                                                  <img src="images/users/${user.avatar}" alt="">
                                                              </div>
                                                              <div class="user-name">
                                                                  <p>
                                                                    ${user.username}
                                                                  </p>
                                                              </div>
                                                              <br>
                                                              <div class="user-address">
                                                                  <span>&nbsp ${(user.address !== null ? user.address : "")}</span>
                                                              </div>
                                                              <div class="user-approve-request-contact-received" data-uid="${user._id}">
                                                                  Chấp nhận
                                                              </div>
                                                              <div class="user-remove-request-contact-received action-danger" data-uid="${user._id}">
                                                                  Xóa yêu cầu
                                                              </div>
                                                          </div>
                                                    </li>`);
        });

        removeRequestContactReceived();
        approveRequestContactReceived();

        $("#link-read-more-contacts-received").css("display", "inline-block");
        $(".read-more-contacts-loading").css("display", "none");
      });
    });
  });