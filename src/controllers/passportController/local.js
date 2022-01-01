import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import { transErrors, transSuccess } from '../../../lang/en';

let LocalStrategy = passportLocal.Strategy;

/* Valid user account type: local */

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email);
            if (!user) {
                return done(null, false, req.flash("errors", transErrors.login_failed));
            }
            if (!user.local.isActive) {
                return done(null, false, req.flash("errors", transErrors.account_not_actived));
            }
            let checkPassword = await user.comparePassword(password);
            if (!checkPassword) {
                return done(null, false, req.flash("errors", transErrors.login_failed));
            }
            return done(null, user, req.flash('success', transSuccess.login_success(user.username)));
        } catch (error) {
            console.log(error);
            return done(null, false, req.flash('errors', transErrors.server_error));
        }
    }))

    passport.serializeUser((user, done) => { // Save userId to session (sau 1 ngày phải đăng nhập lại vì phiên sẽ hết hạn sau 1 ngày)
        done(null, user._id);
    })

    passport.deserializeUser(async(id, done) => { //Được call bởi passport.session() => Lấy id đã được lưu trong session, từ id lấy ra thông tin user rồi lưu vào req.user
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
};

module.exports = initPassportLocal;
