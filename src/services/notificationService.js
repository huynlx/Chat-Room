import NotificationModel from '../models/notificationModel';
import UserModel from '../models/userModel';

const LIMIT_NUMBER = 10;

let getNotifications = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER);

            let getNotifiContent = notifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            })
            resolve(await Promise.all(getNotifiContent)); //'map' nó ko đợi sender tải xong mà nó return luôn => phải promise.all vào thì nó mới đợi
        } catch (error) {
            reject(error)
        }
    })
}

/* count all notifications unread */
let countNotifUnread = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
            resolve(notificationsUnread);
        } catch (error) {
            reject(error)
        }
    })
}

let readMore = (currentUserId, skipNumberNotif) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotif, LIMIT_NUMBER);
           
            let getNotifContents = newNotifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            resolve(await Promise.all(getNotifContents));
        } catch (error) {
            reject(error)
        }
    })
}

let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
      try {
        //   console.log(currentUserId);
        //   console.log(targetUsers);
       let x= await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
       console.log(x);
        resolve(true);
      } catch (error) {
        console.log(`Error when mark notifications as read: ${error}`);
        reject(false);
      }
    });
  };


module.exports = {
    getNotifications,
    countNotifUnread,
    readMore,
    markAllAsRead
}