import express from 'express';
import { auth, home, user, contact, notification, message, groupChat } from '../controllers/index';
import { authValid, userValid, contactValid, messageValid, groupChatValid } from './../validation';
import passport from 'passport';
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from '../controllers/passportController/google';

// Init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

// Init all route
// @param app from exactly express module

let initRoutes = (app) => {
    router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister); //phải đăng xuất rồi thì mới chạy được
    router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);
    router.get('/verify/:token', auth.checkLoggedOut, auth.verifyAccount);
    router.post('/login', auth.checkLoggedOut, passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/login-register',
        //cho phép truyền req.flash về
        successFlash: true,
        failureFlash: true
    }))

    //Google login
    router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", { scope: ['email'] }));
    router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
        successRedirect: '/',
        failureRedirect: '/login-register'
    }))

    //Facebook login
    router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", {scope: ["email"]}));
    router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login-register"
    }));

    //Home
    router.get("/", auth.checkLoggedIn, home.getHome);  //phải đăng nhập rồi thì mới chạy được

    //Logout
    router.get('/logout', auth.checkLoggedIn, auth.getLogout);

    //Update user info
    router.put('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar);
    router.put('/user/update-info', auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
    router.put('/user/update-password', auth.checkLoggedIn, userValid.updatePassword, user.updatePassword); //route => check login => check validate => controller => service

    //Contact
    router.get('/contact/find-users/:keyword', auth.checkLoggedIn, contactValid.findUsersContact, contact.findUsersContact);
    router.post('/contact/add-new', auth.checkLoggedIn, contact.addNew);
    router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
    router.delete("/contact/remove-request-contact-sent", auth.checkLoggedIn, contact.removeRequestContactSent);
    router.delete("/contact/remove-request-contact-received", auth.checkLoggedIn, contact.removeRequestContactReceived);
    router.put("/contact/approve-request-contact-received", auth.checkLoggedIn, contact.approveRequestContactReceived);
    router.get('/contact/read-more-contacts', auth.checkLoggedIn, contact.readMoreContacts);
    router.get('/contact/read-more-contacts-sent', auth.checkLoggedIn, contact.readMoreContactsSent);
    router.get("/contact/read-more-contacts-received", auth.checkLoggedIn, contact.readMoreContactsReceived);
    router.get("/contact/search-friends/:keyword", auth.checkLoggedIn, contactValid.searchFriends, contact.searchFriends);

    //notif
    router.get('/notification/read-more', auth.checkLoggedIn, notification.readMore);
    router.put('/notification/mark-all-as-read', auth.checkLoggedIn, notification.markAllAsRead);

    //message
    router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
    router.post("/message/add-new-image", auth.checkLoggedIn, message.addNewImage);
    router.post("/message/add-new-attachment", auth.checkLoggedIn, message.addNewAttachment);
    router.get("/message/read-more-all-chat", auth.checkLoggedIn, message.readMoreAllChat);
    router.get("/message/read-more", auth.checkLoggedIn, message.readMore);

    //group chat
    router.post("/group-chat/add-new", auth.checkLoggedIn, groupChatValid.addNewGroup, groupChat.addNewGroup);
    router.delete("/group-chat/remove-member", auth.checkLoggedIn, groupChat.removeMember);
    router.post("/group-chat/add-more-member", auth.checkLoggedIn, groupChat.addNewMembers);

    return app.use("/", router)
}

module.exports = initRoutes;

