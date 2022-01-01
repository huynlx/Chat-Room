function approveRequestContactReceived() {
    $(".user-approve-request-contact-received").unbind("click").on('click', function () { //fix gọi quá nhiều lần => unbind - on
        let targetId = $(this).data("uid");
        let targetName = $(this).parent().find("div.user-name>p").text().trim();
        let targetAvatar = $(this).parent().find("div.user-avatar>img").attr("src");

        $.ajax({
            url: "/contact/approve-request-contact-received",
            type: 'put',
            data: { uid: targetId },
            success: function (data) {
                if (data.success) {
                    let userInfo = $("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove();
                    $(userInfo).find("div.user-remove-request-contact-received").remove();
                    $(userInfo).find("div.contactPanel")
                        .append(`<div class="user-talk" data-uid="${targetId}">
                                    Chat
                              </div>
                              <div class="user-remove-contact action-danger" data-uid="${targetId}">
                                    Delete contact
                              </div>`);
                    let userInfoHtml = userInfo.get(0).outerHTML;
                    $("#contacts").find("ul").prepend(userInfoHtml);

                    removeContact();
                    
                    $(userInfo).remove();
                    decreaseNumberNotifiContact("count-request-contact-received"); // js/calculateNotifContact.js
                    increaseNumberNotifiContact("count-contacts"); // js/calculateNotifContact.js
                    decreaseNumberNotifications("noti_contact_counter", 1); // js/calculateNotification.js

                    socket.emit("approve-request-contact-received", { contactId: targetId });
                    
                    //step 01
                    $("#contactsModal").modal("hide");

                    //step 02
                    let subUsername = targetName;
                    if (subUsername.length > 15) {
                        subUsername = subUsername.substr(0, 14);
                    }
                    let leftSideData = `
                        <a href="#uid_${targetId}" class="room-chat" data-target="#to_${targetId}">
                        <li class="person" data-chat="${targetId}">
                            <div class="left-avatar">
                                <div class="dot"></div>
                                <img src="${targetAvatar}" alt="">
                            </div>
                            <span class="name">
                                ${subUsername}
                            </span>
                            <span class="time"></span>
                            <span class="preview"></span>
                        </li>
                        </a>
                    `;
                    $("#all-chat").find("ul").prepend(leftSideData);
                    $("#user-chat").find("ul").prepend(leftSideData);

                    //step 03
                    let rightSideData = `
                        <div class="right tab-pane" data-chat="${targetId}" id="to_${targetId}">
                            <div class="top">
                                <span>To: <span class="name">${targetName}</span></span>
                                <span class="chat-menu-right">
                                    <a href="#attachmentsModal_${targetId}" class="show-attachments" data-toggle="modal">
                                        Attachments
                                        <i class="fa fa-paperclip"></i>
                                    </a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="javascript:void(0)">&nbsp;</a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                                        Images
                                        <i class="fa fa-photo"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="content-chat">
                                <div class="chat" data-chat="${targetId}"></div>
                            </div>
                            <div class="write" data-chat="${targetId}">
                                <input type="text" id="write-chat-${targetId}" class="write-chat" data-chat="${targetId}">
                                <div class="icons">
                                    <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                                    <label for="image-chat-${targetId}">
                                        <input type="file" id="image-chat-${targetId}" name="my-image-chat" class="image-chat" data-chat="${targetId}">
                                        <i class="fa fa-photo"></i>
                                    </label>
                                    <label for="attachment-chat-${targetId}">
                                        <input type="file" id="attachment-chat-${targetId}" name="my-attachment-chat" class="attachment-chat" data-chat="${targetId}">
                                        <i class="fa fa-paperclip"></i>
                                    </label>
                                    <a href="javascript:void(0)" id="video-chat-${targetId}" class="video-chat" data-chat="${targetId}">
                                        <i class="fa fa-video-camera"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                    $("#screen-chat").prepend(rightSideData);

                    //step 04
                    changeScreenChat();

                    //step 05
                    let imageModalData = `
                        <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Uploaded Images</h4>
                                </div>
                                <div class="modal-body">
                                    <div class="all-images" style="visibility: hidden;"></div>
                                </div>
                            </div>
                        </div>
                        </div>
                    `;
                    $("body").append(imageModalData);

                    //step 06 call function gridPhotos in mainConfig
                    gridPhotos(5);

                    //step 07 handle attachment modal
                    let attachmentModalData = `
                        <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Files Uploaded</h4>
                                </div>
                                <div class="modal-body">
                                    <ul class="list-attachments"></ul>
                                </div>
                            </div>
                        </div>
                        </div>
                    `;
                    $("body").append(attachmentModalData);

                    //step 08 update online
                    socket.emit("check-status");
                }
            },
            error: function (error) {
                console.log(error);
            }
        })
    })
}

socket.on("response-approve-request-contact-received", function (user) {
    let notifi = `<div class='notifi-readed-false' data-uid="${user.id}">
                    <img class="avatar-small" src="images/users/${user.avatar}" alt="">
                    <strong>${user.username}</strong> has accepted your friend request!
                  </div>`;
    $(".noti_content").prepend(notifi); //prepend => chèn vào trên cùng
    $("ul.list-notifications").prepend(`<li>${notifi}</li>`);

    decreaseNumberNotifications('noti_contact_counter', 1);
    increaseNumberNotifications('noti_counter', 1);

    decreaseNumberNotifiContact("count-request-contact-sent"); // js/calculateNotifContact.js
    increaseNumberNotifiContact("count-contacts"); // js/calculateNotifContact.js

    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();
    
    let userInfoHtml = `
      <li class="_contactList" data-uid="${user.id}">
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
                <span>&nbsp ${user.address}</span>
            </div>
            <div class="user-talk" data-uid="${user.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Xóa liên hệ
            </div>
        </div>
      </li>
    `;
    $("#contacts").find("ul").prepend(userInfoHtml);
    removeContact();

    //step 01
    //step 02
    let subUsername = user.username;
    if (subUsername.length > 15) {
        subUsername = subUsername.substr(0, 14);
    }
    let leftSideData = `
        <a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
        <li class="person" data-chat="${user.id}">
            <div class="left-avatar">
                <div class="dot"></div>
                <img src="images/users/${user.avatar}" alt="">
            </div>
            <span class="name">
                ${subUsername}
            </span>
            <span class="time"></span>
            <span class="preview"></span>
        </li>
        </a>
    `;
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#user-chat").find("ul").prepend(leftSideData);

    //step 03
    let rightSideData = `
        <div class="right tab-pane" data-chat="${user.id}" id="to_${user.id}">
            <div class="top">
                <span>To: <span class="name">${user.username}</span></span>
                <span class="chat-menu-right">
                    <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
                        Tệp đính kèm
                        <i class="fa fa-paperclip"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                        Images
                        <i class="fa fa-photo"></i>
                    </a>
                </span>
            </div>
            <div class="content-chat">
                <div class="chat" data-chat="${user.id}"></div>
            </div>
            <div class="write" data-chat="${user.id}">
                <input type="text" id="write-chat-${user.id}" class="write-chat" data-chat="${user.id}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${user.id}">
                        <input type="file" id="image-chat-${user.id}" name="my-image-chat" class="image-chat" data-chat="${user.id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attachment-chat-${user.id}">
                        <input type="file" id="attachment-chat-${user.id}" name="my-attachment-chat" class="attachment-chat" data-chat="${user.id}">
                        <i class="fa fa-paperclip"></i>
                    </label>
                    <a href="javascript:void(0)" id="video-chat-${user.id}" class="video-chat" data-chat="${user.id}">
                        <i class="fa fa-video-camera"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    $("#screen-chat").prepend(rightSideData);

    //step 04
    changeScreenChat();

    //step 05
    let imageModalData = `
        <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Uploaded Images</h4>
                </div>
                <div class="modal-body">
                    <div class="all-images" style="visibility: hidden;"></div>
                </div>
            </div>
        </div>
        </div>
    `;
    $("body").append(imageModalData);

    //step 06 call function gridPhotos in mainConfig
    gridPhotos(5);

    //step 07 handle attachment modal
    let attachmentModalData = `
        <div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Files Uploaded</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachments"></ul>
                </div>
            </div>
        </div>
        </div>
    `;
    $("body").append(attachmentModalData);

    //step 08 update online
    socket.emit("check-status");
});

$(document).ready(function () {
    approveRequestContactReceived();
})