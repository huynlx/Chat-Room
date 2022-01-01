import passport from 'passport';
import passportGoogle from "passport-google-oauth";
import UserModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import { transErrors, transSuccess } from '../../../lang/en';

//Set .env
require('dotenv').config();

let GoogleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

/* Valid user account type: Google */
let initPassportGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: ggAppId,
        clientSecret: ggAppSecret,
        callbackURL: ggCallbackUrl,
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {

        try {
            let user = await UserModel.findByGoogleUid(profile.id);
            // console.log(profile);
            if (user) {
                return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
            }
            let newUserItem = {
                username: profile.displayName ? profile.displayName : profile.emails[0].value.split("@")[0],
                gender: profile.gender,
                local: { isActive: true },
                google: {
                    uid: profile.id,
                    token: accessToken,
                    email: profile.emails[0].value
                }
            }
            let newUser = await UserModel.createNew(newUserItem);
            return done(null, newUser, req.flash("success", transSuccess.login_success(newUser.username)));
        } catch (error) {
            console.log(error);
            return done(null, false, req.flash('errors', transErrors.server_error));
        }
    }))

    passport.serializeUser((user, done) => { // Save userId to session (sau 1 ngày phải đăng nhập lại vì phiên sẽ hết hạn sau 1 ngày)
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => { //Được call bởi passport.session() => Lấy id đã được lưu trong session, từ id lấy ra thông tin user rồi lưu vào req.user
        try {
            let user = await UserModel.findUserByIdForSessionToUse(id);
            let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

            user = user.toObject();
            user.chatGroupIds = getChatGroupIds;

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    })
}


module.exports = initPassportGoogle;