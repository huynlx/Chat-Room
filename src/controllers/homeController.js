import { contact, notification, message } from '../services/index';
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime } from "./../helpers/clientHelper";

let getHome = async (req, res) => {
    //only 10 item one time
    let notifications = await notification.getNotifications(req.user._id);
    //get amount notifications unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    //get contact 10 items one time
    let contacts = await contact.getContacts(req.user._id);
    //get contact 10 items one time
    let contactsSent = await contact.getContactSent(req.user._id);
    //get contact 10 items one time
    let contactsReceived = await contact.getContactReceived(req.user._id);
    //count
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);
    let getAllConversationItems = await message.getAllConversationItems(req.user._id);
    let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

    return res.render('main/home/home', {
        //các biến này dùng trong .ejs
        errors: req.flash("errors"),
        success: req.flash('success'),
        user: req.user,
        notifications,
        countNotifUnread,
        contacts,
        contactsSent,
        contactsReceived,
        countAllContacts,
        countAllContactsSent,
        countAllContactsReceived,
        allConversationWithMessages,
        bufferToBase64,
        lastItemOfArray,
        convertTimestampToHumanTime
    });
};

module.exports = {
    getHome
};

