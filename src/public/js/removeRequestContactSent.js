function removeRequestContactSent() {
    $(".user-remove-request-contact-sent").unbind("click").on('click', function () { //fix gọi quá nhiều lần => unbind - on
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-sent",
            type: 'delete', // type delete thì jquery ko support
            data: { uid: targetId },
            success: function (data) {
                if (data.success) {
                    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    decreaseNumberNotifiContact("count-request-contact-sent");
                    decreaseNumberNotifications('noti_contact_counter', 1);

                    //Xóa ở modal Đang chờ xác nhận
                    $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact-sent", { contactId: targetId });
                }
            },
            error: function (error) {
                console.log(error);
            }
        })
    })
}

socket.on("response-remove-request-contact-sent", function (user) {
    $(".noti_content").find(`div[data-uid=${user.id}]`).remove();
    $("ul.list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove();

    //Xoá ở modal tab yêu cầu kết bạn
    $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifiContact('count-request-contact-received');
    decreaseNumberNotifications('noti_contact_counter', 1);
    decreaseNumberNotifications('noti_counter', 1);
});

$(document).ready(function(){
    removeRequestContactSent();
})