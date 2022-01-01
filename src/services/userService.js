import { transErrors } from '../../lang/en';
import UserModel from '../models/userModel';
import bcrypt from "bcrypt";

const saltRounds = 7;

/* Update user info */
let updateUserInfo = (id, item) => {
    return UserModel.updateUser(id, item);
}

/* Update user password */
let updateUserPassword = (id, item) => {
    return new Promise(async (resolve, reject) => { //sao lại dùng promise => dùng để trả về lỗi mà mình đã định nghĩa trước nếu gặp phải bằng "reject"
        let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
        if (!currentUser) {
            return reject(transErrors.account_underfined);
        }

        let checkCurrentPassword = await currentUser.comparePassword(item.currentPassword);
        if (!checkCurrentPassword) {
            return reject(transErrors.current_password_failed);
        }

        let salt = bcrypt.genSaltSync(saltRounds); //dùng để băm mật khẩu
        await UserModel.updatePassword(id, bcrypt.hashSync(item.newPassword, salt));
        resolve(true);
    })
}

module.exports = {
    updateUser: updateUserInfo,
    updateServicePassword: updateUserPassword
}