let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
    let timerInterval;
    Swal.fire({
        position: 'top-end',
        title: 'Automatically log out after 5 seconds',
        html: "Time: <strong></strong>",
        showConfirmButton: false,
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    }).then(result => {
        $.get("/logout", function () {
            location.reload();
        })
    })
}

function updateUserInfo() {
    //avatar
    $("#input-change-avatar").bind("change", function () {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576;

        /* Validate ở phía client */
        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify("Invalid image file type. Please select .PNG or .JPG image", "error", 7);
            $(this).val(null);
            return false;
        }

        if (fileData.size > limit) {
            alertify.notify('Please choose a photo less than 1 Megabyte in size!', "error", 7);
            $(this).val(null);
            return false;
        }


        if (typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            let fileReader = new FileReader();
            fileReader.onload = function (element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);
            userAvatar = formData;
        } else {
            alertify.notify("Your browser does not support File Reader!", "error", 7);
        }
    });

    //info
    $("#input-change-username").bind("change", function () {
        let username = $(this).val();
        let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

        if (!regexUsername.test(username) || username.length < 3 || username.length > 17) {
            alertify.notify("Username is limited to 3-17 characters and does not contain special characters!", "error", 7);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        }

        userInfo.username = $(this).val();
    })

    $("#input-change-gender-male").bind("change", function () {
        let gender = $(this).val();

        if (gender !== "male") {
            alertify.notify("Why is his gender like this ?", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = $(this).val();
    })

    $("#input-change-gender-female").bind("change", function () {
        let gender = $(this).val();

        if (gender !== "female") {
            alertify.notify("Why is his gender like this ?", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = $(this).val();
    })

    $("#input-change-address").bind("change", function () {
        let address = $(this).val();

        if (address.length < 3 || address.length > 30) {
            alertify.notify("Addresses are limited to 3-30 characters !", "error", 7);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return false;
        }

        userInfo.address = $(this).val();
    })

    $("#input-change-phone").bind("change", function () {
        let phone = $(this).val();
        let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);

        if (!regexPhone.test(phone)) {
            alertify.notify("Enter the wrong phone number!", "error", 7);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }

        userInfo.phone = $(this).val();
    })

    //password
    $("#input-change-current-password").bind("change", function () {
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(currentPassword)) {
            alertify.notify("Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters.", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }

        userUpdatePassword.currentPassword = currentPassword;
    })
    $("#input-change-new-password").bind("change", function () {
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(newPassword)) {
            alertify.notify("Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters.", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }

        userUpdatePassword.newPassword = newPassword;
    })
    $("#input-change-confirm-new-password").bind("change", function () {
        let confirmPassword = $(this).val();

        if (!userUpdatePassword.newPassword) {
            alertify.notify("You have not entered a new password !", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return false;
        }
        if (confirmPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Re-enter incorrect password !", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return false;
        }

        userUpdatePassword.confirmPassword = confirmPassword;
    })
};

function callUpdateAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: 'put',
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function (result) {
            //Display success
            $('.user-modal-alert-success span').text(result.message);
            $('.user-modal-alert-success').css("display", 'block');

            //Update avatar image
            $("#navbar-avatar").attr('src', result.imageSrc);

            //Update originAvatarSrc
            originAvatarSrc = result.imageSrc;

            //Reset all
            $("#input-btn-cancer-update-user").click();
        },
        error: function (error) {  // Lỗi khi check ở server
            //Display errors
            $('.user-modal-alert-error span').text(error.responseText);
            $('.user-modal-alert-error').css('display', 'block');
            //Reset all
            $("#input-btn-cancer-update-user").click();
        }
    });
}
function callUpdateInfo() {
    $.ajax({
        url: "/user/update-info",
        type: 'put',
        data: userInfo,
        success: function (result) {
            //Display success
            $('.user-modal-alert-success span').text(result.message);
            $('.user-modal-alert-success').css("display", 'block');

            originUserInfo = Object.assign(originUserInfo, userInfo); //ghi đè value from userInfo to originUserInfo

            //update username at navbar
            $("#navbar-username").text(originUserInfo.username);

            //Reset all
            $("#input-btn-cancer-update-user").click();
        },
        error: function (error) { // Lỗi khi check ở server
            //Display errors
            $('.user-modal-alert-error span').text(error.responseText);
            $('.user-modal-alert-error').css('display', 'block');
            //Reset all
            $("#input-btn-cancer-update-user").click();
        }
    });
}
function callUpdatePassword() {
    $.ajax({
        url: "/user/update-password",
        type: 'put',
        data: userUpdatePassword,
        success: function (result) {
            //Display success
            $('.user-modal-password-alert-success span').text(result.message);
            $('.user-modal-password-alert-success').css("display", 'block');

            //Reset all
            $("#input-btn-cancer-update-user-password").click();

            //Auto logout after change password success
            callLogout();
        },
        error: function (error) { // Lỗi khi check ở server
            //Display errors
            $('.user-modal-password-alert-error span').text(error.responseText);
            $('.user-modal-password-alert-error').css('display', 'block');

            //Reset all
            $("#input-btn-cancer-update-user-password").click();
        }
    });
}

$(document).ready(function () {
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: $("#input-change-gender-male").is(":checked") ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val()
    }

    /* update User info after change value to update */
    updateUserInfo(); //add event listener

    originAvatarSrc = $('#user-modal-avatar').attr('src');

    /* info */
    $("#input-btn-update-user").bind("click", () => {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("Information has not been changed!", "error", 7);
            return false;
        }
        if (userAvatar) {
            callUpdateAvatar();
        }
        if (!$.isEmptyObject(userInfo)) {
            callUpdateInfo();
        }
    })
    $("#input-btn-cancer-update-user").bind("click", () => {
        userAvatar = null;
        userInfo = {};

        //reset user avatar
        $('#user-modal-avatar').attr('src', originAvatarSrc);

        //reset user info
        $("#input-change-username").val(originUserInfo.username);
        originUserInfo.gender === 'male' ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    })

    /* password */
    $("#input-btn-update-user-password").bind("click", () => {
        if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmPassword) {
            alertify.notify("The data field has not been fully entered !", "error", 7);
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to change your password? ?',
            text: "You will not be able to undo this process !",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2980B9',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Confirm',
            cancerButtonText: 'Cancel'
        }).then((result) => {
            if (!result.value) {
                $("#input-btn-cancer-update-user-password").click();
                return false;
            }
            callUpdatePassword();
        })
    })
    $("#input-btn-cancer-update-user-password").bind("click", () => {
        userUpdatePassword = {};
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-new-password").val(null);
    })
});
