function textAndEmojiChat(divId) {
    $(".emojionearea").unbind("keyup").on("keyup", function (element) {
        let currentEmojioneArea = $(this);

        if (element.which === 13) {
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if (!targetId.length || !messageVal.length) {
                return false;
            }

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal
            };

            if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                dataTextEmojiForSend.isChatGroup = true;
            }

            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
                //success
                let dataToEmit = {
                    message: data.message
                };

                let myMessage = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
                myMessage.text(data.message.text);

                let convertEmojioneMessage = emojione.toImage(myMessage.html());

                if (dataTextEmojiForSend.isChatGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
                    myMessage.html(`${senderAvatar} ${convertEmojioneMessage}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                } else {
                    myMessage.html(convertEmojioneMessage);
                    dataToEmit.contactId = targetId;
                }

                //append message data to screen
                $(`.right .chat[data-chat=${divId}]`).append(myMessage);
                nineScrollRight(divId);

                //remove all data input
                $(`#write-chat-${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                //change data preview left side
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("en").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                // move newest conversation to top
                $(`.person[data-chat=${divId}]`).on("livechat.moveConversationToTop", function () { //khoi tao su kien
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("livechat.moveConversationToTop");
                });
                $(`.person[data-chat=${divId}]`).trigger("livechat.moveConversationToTop"); //kich hoat su kien

                //Emit realtime
                socket.emit("chat-text-emoji", dataToEmit);

                //emit remove typing realtime
                typingOff(divId);

                let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
                if (checkTyping.length) {
                    checkTyping.remove();
                }
            }).fail(function (response) {
                //error
                alertify.notify(response.responseText, "error", 7);
            });
        }
    });

    $(".icon-send").unbind("click").on('click', function () {
        let currentEmojioneArea = $(".emojionearea");

        let targetId = $(`#write-chat-${divId}`).data("chat");
        let messageVal = $(`#write-chat-${divId}`).val();

        if (!targetId.length || !messageVal.length) {
            return false;
        }

        let dataTextEmojiForSend = {
            uid: targetId,
            messageVal: messageVal
        };

        if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
            dataTextEmojiForSend.isChatGroup = true;
        }

        $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
            //success
            let dataToEmit = {
                message: data.message
            };

            let myMessage = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
            myMessage.text(data.message.text);

            let convertEmojioneMessage = emojione.toImage(myMessage.html());

            if (dataTextEmojiForSend.isChatGroup) {
                let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
                myMessage.html(`${senderAvatar} ${convertEmojioneMessage}`);
                increaseNumberMessageGroup(divId);
                dataToEmit.groupId = targetId;
            } else {
                myMessage.html(convertEmojioneMessage);
                dataToEmit.contactId = targetId;
            }

            //append message data to screen
            $(`.right .chat[data-chat=${divId}]`).append(myMessage);
            nineScrollRight(divId);

            //remove all data input
            $(`#write-chat-${divId}`).val("");
            currentEmojioneArea.find(".emojionearea-editor").text("");

            //change data preview left side
            $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("en").startOf("seconds").fromNow());
            $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

            // move newest conversation to top
            $(`.person[data-chat=${divId}]`).on("livechat.moveConversationToTop", function () { //khoi tao su kien
                let dataToMove = $(this).parent();
                $(this).closest("ul").prepend(dataToMove);
                $(this).off("livechat.moveConversationToTop");
            });
            $(`.person[data-chat=${divId}]`).trigger("livechat.moveConversationToTop"); //kich hoat su kien

            //Emit realtime
            socket.emit("chat-text-emoji", dataToEmit);

            //emit remove typing realtime
            typingOff(divId);

            let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
            if (checkTyping.length) {
                checkTyping.remove();
            }
        }).fail(function (response) {
            //error
            alertify.notify(response.responseText, "error", 7);
        });
    });
}

$(document).ready(function () {
    socket.on("response-chat-text-emoji", function (response) {
        let divId = "";

        let yourMessage = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
        yourMessage.text(response.message.text);
        let convertEmojioneMessage = emojione.toImage(yourMessage.html());

        if (response.currentGroupId) {
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
            yourMessage.html(`${senderAvatar} ${convertEmojioneMessage}`);
            divId = response.currentGroupId;

            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) { //vì socketId Group thì tất cả các client trong group đều lắng nghe ("on") nên phải check
                increaseNumberMessageGroup(divId);
            }
        } else {
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
            yourMessage.html(`${convertEmojioneMessage}`);
            divId = response.currentUserId;
        }

        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) { //vì socketId Group thì tất cả các client trong group đều lắng nghe ("on") nên phải check
            $(`.right .chat[data-chat=${divId}]`).append(yourMessage);
            nineScrollRight(divId);
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
        }

        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createAt).locale("en").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        $(`.person[data-chat=${divId}]`).on("livechat.moveConversationToTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("livechat.moveConversationToTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("livechat.moveConversationToTop");
    });
});