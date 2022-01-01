$(document).ready(function () {
    $("#link-read-more-notif").bind("click", function () {
        let skipNumber = $("ul.list-notifications").find("li").length;

        $("#link-read-more-notif").css("display", 'none');
        $(".read-more-notif-loading").css("display", "inline-block");

       setTimeout(() => {
        $.get(`/notification/read-more?skipNumber=${skipNumber}`, function (data) {
            if (!data.length) {
                alertify.notify("You have no more notifications to view.", "error", 7)
                $("#link-read-more-notif").css("display", 'inline-block');
                $(".read-more-notif-loading").css("display", "none");
                return false;
            }
            data.forEach(element => {
                $("ul.list-notifications").append(`<li>${element}</li>`);
            })

            $("#link-read-more-notif").css("display", 'inline-block');
            $(".read-more-notif-loading").css("display", "none");
        })
       }, 0);

    })
})