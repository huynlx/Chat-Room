import UserModel from './../models/userModel';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4'; //tạo 1 chuỗi id ngẫu nhiên
import { transErrors, transSuccess, transMail } from '../../lang/en';
import sendMail from './../config/mailer';

let saltRounds = 7;

let register = (email, gender, password, protocol, host) => {
    return new Promise(async (resolve, reject) => {
        let userByEmail = await UserModel.findByEmail(email);
        if (userByEmail) {
            if (userByEmail.deleteAt !== null) {
                return reject(transErrors.account_removed) // trả về promise rejection + return để nó dừng hàm luôn
            }
            if (!userByEmail.local.isActive) {
                return reject(transErrors.account_not_actived) // trả về promise rejection
            }
            return reject(transErrors.account_in_use) // trả về promise rejection
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
        };

        let user = await UserModel.createNew(userItem);
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`; // http://localhost:8017/verify/xxx
        //send email
        sendMail(email, transMail.subject, transMail.template(linkVerify))
            .then(success => {
                resolve(transSuccess.userCreated(user.local.email)); // trả về promise resolve
            })
            .catch(async (error) => {
                // remove user
                await UserModel.removeById(user._id);
                console.log(error);
                reject(transMail.send_failed);
            })
    })

}

let verifyAccount = (token) => {
    return new Promise(async (resolve, reject) => {
        let userByToken = await UserModel.findByToken(token);
        if (!userByToken) {
            return reject(transErrors.token_undefined);
        }
        await UserModel.verify(token);
        resolve(transSuccess.account_actived);
    })
}

module.exports = {
    register,
    verifyAccount
}
