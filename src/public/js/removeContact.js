function removeContact() {
    $(".user-remove-contact").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        let username = $(this).parent().find("div.user-name p").text();
        Swal.fire({
            title: `Are you sure you want to delete contact with ${username}?`,
            text: "You cannot undo this process!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2980B9",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Confirm!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (!result.value) {
                return false;
            }
            $.ajax({
                url: "/contact/remove-contact",
                type: "delete",
                data: { uid: targetId },
                success: function (data) {
                    if (data.success) {
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                        decreaseNumberNotifiContact("count-contacts"); // js/calculateNotifContact.js giảm danh bạ đi 1

                        socket.emit("remove-contact", { contactId: targetId });

                        //chức năng xóa user ở leftside khi hủy kết bạn
                        //Bước 0 check active
                        let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");
                        //Bước 01 remove user bên leftside
                        $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
                        $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

                        //check active again
                        checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");

                        //Bước 02 remove user bên rightSide
                        $("#screen-chat").find(`div#to_${targetId}`).remove();

                        //Bước 03 remove image modal
                        $("body").find(`div#imagesModal_${targetId}`).remove();

                        //Bước 04 remove attach modal
                        $("body").find(`div#attachmentsModal_${targetId}`).remove();

                        //Bước 05 click first conversation index = 0
                        if (checkActive) {
                            $("ul.people").find("a")[0].click();
                        }
                    }
                }
            });
        });
    });
}

socket.on("response-remove-contact", function (user) {
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotifiContact("count-contacts"); // js/calculateNotifContact.js giảm danh bạ đi 1

    //chức năng xóa user ở leftside khi hủy kết bạn
    //Bước 0 check active
    let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");
    //Bước 01 remove user bên leftside
    $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
    $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

    //Bước 02 remove user bên rightSide
    $("#screen-chat").find(`div#to_${user.id}`).remove();

    //Bước 03 remove image modal
    $("body").find(`div#imagesModal_${user.id}`).remove();

    //Bước 04 remove attach modal
    $("body").find(`div#attachmentsModal_${user.id}`).remove();

    //Bước 05 click first conversation index = 0
    if (checkActive) {
        $("ul.people").find("a")[0].click();
    }
});

$(document).ready(function () {
    removeContact();
});