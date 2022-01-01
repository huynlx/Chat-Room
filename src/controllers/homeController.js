import { contact, notification, message } from '../services/index';
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime } from "./../helpers/clientHelper";
import request from "request";

let getICETurnServer = () => {
    return new Promise(async (resolve, reject) => {
        /* let o = {
            format: "urls"
        };

        let bodyString = JSON.stringify(o);
        let options = {
            url: "https://global.xirsys.net/_turn/awesome-chat",
            // host: "global.xirsys.net",
            // path: "/_turn/awesome-chat",
            method: "PUT",
            headers: {
                "Authorization": "Basic " + Buffer.from("sydvo1402:df8aaee4-953f-11ea-aab7-0242ac150003").toString("base64"),
                "Content-Type": "application/json",
                "Content-Length": bodyString.length
            }
        };

        //call a request to get ICE list of Turn server
        request(options, (error, response, body) => {
            if (error) {
                console.log("Error when get ICE list: " + error);
                return reject(error);
            }
            let bodyJson = JSON.parse(body);
            resolve(bodyJson.v.iceServers);
        }); */
        resolve([]);
    });
};

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

    let iceServerList = await getICETurnServer();

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
        convertTimestampToHumanTime,
        iceServerList: JSON.stringify(iceServerList)
    });
};

module.exports = {
    getHome
};

