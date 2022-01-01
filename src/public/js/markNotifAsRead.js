function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: { targetUsers: JSON.stringify(targetUsers) },
    success: function (result) {
      if (result) {
        targetUsers.forEach(function (uid) {
          $(".noti_content").find(`div[data-uid = ${uid}]`).removeClass("notifi-readed-false");
          $("ul.list-notifications").find(`li>div[data-uid = ${uid}]`).removeClass("notifi-readed-false");
        });
        decreaseNumberNotifications("noti_counter", targetUsers.length);
      }
    }
  });
}


$(document).ready(function () {
  $("#popup-mark-notifi-as-read").bind('click', function () {
    let targetUsers = [];
    $(".noti_content").find("div.notifi-readed-false").each(function (index, notification) {
      targetUsers.push($(notification).data("uid"));
    });
    if (!targetUsers.length) {
      alertify.notify("You have no more unread notifications.", "error", 7);
      return false;
    }
    markNotificationsAsRead(targetUsers);
  })

  $("#modal-mark-notifi-as-read").bind('click', function () {
    let targetUsers = [];
    $("ul.list-notifications").find("li>div.notifi-readed-false").each(function (index, notification) {
      targetUsers.push($(notification).data("uid"));
    });
    if (!targetUsers.length) {
      alertify.notify("You have no more unread notifications.", "error", 7);
      return false;
    }
    markNotificationsAsRead(targetUsers);
  })
})