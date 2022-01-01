import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
    senderId: String,
    receiverId: String,
    type: String,
    content: String,
    isRead: { type: Boolean, default: false },
    createAt: { type: Number, default: Date.now },
})


NotificationSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    removeRequestContactNotification(senderId, receiverId, type) {
        return this.remove({
            $and: [
                { "senderId": senderId },
                { "receiverId": receiverId },
                { "type": type }
            ]
        }).exec();
    },
    getByUserIdAndLimit(userId, limit) {
        return this.find({ "receiverId": userId }).sort({ "createAt": -1 }).limit(limit).exec(); //createAt = -1 => sắp xếp bản ghi mới lên đầu cũ xuống dưới
    },
    countNotifUnread(userId) {
        return this.count({
            $and: [
                { "receiverId": userId },
                { "isRead": false }
            ]
        }).exec();
    },
    readMore(userId, skip, limit) {
        return this.find({ "receiverId": userId }).sort({ "createAt": -1 }).skip(skip).limit(limit).lean().exec();
    },
    markAllAsRead(userId, targetUsers) {
        return this.updateMany({
            $and: [
                { "receiverId": userId },
                { "senderId": { $in: targetUsers } }
            ]
        }, { "isRead": true }).exec();
    }
}

const NOTIFICATION_TYPE = {
    ADD_CONTACT: "add_contact",
    APPROVE_CONTACT: "approve_contact"
}

const NOTIFICATION_CONTENT = {
    getContent: (notificationType, isRead, userId, username, userAvatar) => {
        if (notificationType === NOTIFICATION_TYPE.ADD_CONTACT) {
            return `<div class=${!isRead ? 'notifi-readed-false' : ''} data-uid="${userId}">
                    <img class="avatar-small" src="images/users/${userAvatar}" alt="">
                    <strong>${username}</strong> sent you a friend request!
                    </div>`;
        }
        if (notificationType === NOTIFICATION_TYPE.APPROVE_CONTACT) {
            if (!isRead) {
                return `<div class="notifi-readed-false" data-uid="${userId}">
                        <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                        <strong>${username}</strong> has accepted your friend request!
                      </div>`;
            }
            return `<div data-uid="${userId}">
                      <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                      <strong>${username}</strong> has accepted your friend request!
                    </div>`;
        }
        return "No matching with any notification type.";
    }
}

module.exports = {
    model: mongoose.model("notification", NotificationSchema),
    types: NOTIFICATION_TYPE,
    contents: NOTIFICATION_CONTENT
}
