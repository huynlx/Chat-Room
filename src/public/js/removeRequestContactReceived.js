function removeRequestContactReceived() {
    $(".user-remove-request-contact-received").unbind("click").on('click', function () { //fix gọi quá nhiều lần => unbind - on
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: 'delete', // type delete thì jquery ko support
            data: { uid: targetId },
            success: function (data) {
                if (data.success) {
                    //chuc nang nay chua muon lam ok
                    // $(".noti_content").find(`div[data-uid=${user.id}]`).remove(); //popup
                    // $("ul.list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove(); //modal
                    // decreaseNumberNotifications('noti_counter', 1);

                    decreaseNumberNotifiContact("count-request-contact-received");
                    decreaseNumberNotifications('noti_contact_counter', 1)

                    //Xoá ở modal tab yêu cầu kết bạn
                    $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact-received", { contactId: targetId });
                }
            },
            error: function (error) {
                console.log(error);
            }
        })
    })
}

socket.on("response-remove-request-contact-received", function (user) {
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");

    //Xóa ở modal Yeu cau ket ban
    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifiContact('count-request-contact-sent');
    decreaseNumberNotifications('noti_contact_counter', 1);

});

$(document).ready(function () {
    removeRequestContactReceived();
})