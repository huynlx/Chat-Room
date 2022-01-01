import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createAt: { type: Number, default: Date.now },
    updateAt: { type: Number, default: null },
    deleteAt: { type: Number, default: null }
})

ContactSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    findAllByUser(userId) {
        return this.find({
            $or: [
                { "userId": userId },
                { "contactId": userId }
            ]
        })
    },
    /* Kiểm tra tồn tại */
    checkExists(userId, contactId) {
        return this.findOne({
            $or: [
                {
                    $and: [ //mình gửi yêu cầu kết bạn vs người khác (đã kết bạn)
                        { "userId": userId },
                        { "contactId": contactId }
                    ]
                },
                {
                    $and: [ //người khác gửi yêu cầu kết bạn vs mình (đã kết bạn)
                        { "userId": contactId },
                        { "contactId": userId }
                    ]
                }
            ]
        })
    },
    /* Xoá lời mời kết bạn */
    removeRequestContactSent(userId, contactId) {
        return this.remove({
            $and: [
                { "userId": userId },
                { "contactId": contactId },
                { "status": false }
            ]
        }).exec();
    },
    removeRequestContactReceived(userId, contactId) {
        return this.remove({
            $and: [
                { "contactId": userId },
                { "userId": contactId },
                { "status": false }
            ]
        }).exec();
    },
    getContacts(userId, limit) {
        return this.find({
            $and: [
                {
                    $or: [
                        { "userId": userId },
                        { "contactId": userId }
                    ]
                },
                { "status": true }
            ]
        }).sort({ "updateAt": -1 }).limit(limit).exec();
    },
    getContactSent(userId, limit) {
        return this.find({
            $and: [
                { "userId": userId },
                { "status": false }
            ]
        }).sort({ "createAt": -1 }).limit(limit).exec();
    },
    getContactReceived(userId, limit) {
        return this.find({
            $and: [
                { "contactId": userId },
                { "status": false }
            ]
        }).sort({ "createAt": -1 }).limit(limit).exec();
    },
    countAllContacts(userId) {
        return this.count({
            $and: [
                {
                    $or: [
                        { "userId": userId },
                        { "contactId": userId }
                    ]
                },
                { "status": true }
            ]
        }).exec();
    },
    countAllContactsSent(userId) {
        return this.count({
            $and: [
                { "userId": userId },
                { "status": false }
            ]
        }).exec();
    },
    countAllContactsReceived(userId) {
        return this.count({
            $and: [
                { "contactId": userId },
                { "status": false }
            ]
        }).exec();
    },
    readMoreContacts(userId, skip, limit) {
        return this.find({
            $and: [
                {
                    $or: [
                        { "userId": userId },
                        { "contactId": userId }
                    ]
                },
                { "status": true }
            ]
        }).sort({ "updateAt": -1 }).skip(skip).limit(limit).exec();
    },
    readMoreContactsSent(userId, skip, limit) {
        return this.find({
            $and: [
                { "userId": userId },
                { "status": false }
            ]
        }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
    },
    readMoreContactsReceived(userId, skip, limit) {
        return this.find({
            $and: [
                { "contactId": userId },
                { "status": false }
            ]
        }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
    },
    approveRequestContactReceived(userId, contactId) {
        return this.update({
            $and: [
                { "contactId": userId },
                { "userId": contactId },
                { "status": false }
            ]
        }, {
            "status": true,
            "updateAt": Date.now()
        }).exec();
    },
    removeContact(userId, contactId) {
        return this.remove({
            $or: [
                {
                    $and: [
                        { "userId": userId },
                        { "contactId": contactId },
                        { "status": true }
                    ]
                },
                {
                    $and: [
                        { "userId": contactId },
                        { "contactId": userId },
                        { "status": true }
                    ]
                }
            ]
        }).exec();
    },
    updateWhenHasNewMessage(userId, contactId) {
        return this.update({
            $or: [
                {
                    $and: [
                        { "userId": userId },
                        { "contactId": contactId }
                    ]
                },
                {
                    $and: [
                        { "userId": contactId },
                        { "contactId": userId }
                    ]
                }
            ]
        }, { "updateAt": Date.now() }).exec();
    },
    getFriends(userId) {
        return this.find({
          $and: [
            {$or: [
              {"userId": userId},
              {"contactId": userId}
            ]},
            {"status": true}
          ]
        }).sort({"updatedAt": -1}).exec();
      },
      
}

module.exports = mongoose.model("contact", ContactSchema);
