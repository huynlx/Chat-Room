import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    senderId: String,
    receiverId: String,
    conversationType: String,
    messageType: String,
    sender: {
        id: String,
        name: String,
        avatar: String
    },
    receiver: {
        id: String,
        name: String,
        avatar: String
    },
    text: String,
    file: { data: Buffer, contentType: String, fileName: String },
    createAt: { type: Number, default: Date.now },
    updateAt: { type: Number, default: null },
    deleteAt: { type: Number, default: null }
})

const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL: "personal",
    GROUP: "group"
};

const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file"
};

MessageSchema.statics = {
    /**
     * tạo mới tin nhắn
     * @param {object} item 
     */
    createNew(item) {
        return this.create(item);
    },

    /**
     * Lấy tin nhắn cuộc trò chuyện cá nhân
     * @param {String} senderId currentUserId
     * @param {String} receiverId id personal
     * @param {Number} limit 
     */
    getMessagesInPersonal(senderId, receiverId, limit) {
        return this.find({
            $or: [
                {
                    $and: [
                        { "senderId": senderId },
                        { "receiverId": receiverId }
                    ]
                },
                {
                    $and: [
                        { "receiverId": senderId },
                        { "senderId": receiverId }
                    ]
                }
            ]
        }).sort({ "createAt": -1 }).limit(limit).exec();
    },

    /**
     * Lấy tin nhắn cuộc trò chuyện nhóm
     * @param {String} groupId groupChat's id
     * @param {Number} limit 
     */
    getMessagesInGroup(groupId, limit) {
        return this.find({ "receiverId": groupId }).sort({ "createAt": -1 }).limit(limit).exec();
    },

    readMoreMessagesInPersonal(senderId, receiverId, skip, limit) {
        return this.find({
            $or: [
                {
                    $and: [
                        { "senderId": senderId },
                        { "receiverId": receiverId }
                    ]
                },
                {
                    $and: [
                        { "receiverId": senderId },
                        { "senderId": receiverId }
                    ]
                }
            ]
        }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
    },

    readMoreMessagesInGroup(receiverId, skip, limit) {
        return this.find({ "receiverId": receiverId }).sort({ "createAt": -1 }).skip(skip).limit(limit).exec();
    }
};

module.exports = {
    model: mongoose.model("message", MessageSchema),
    conversationTypes: MESSAGE_CONVERSATION_TYPES,
    messageTypes: MESSAGE_TYPES
}
