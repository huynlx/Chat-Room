import multer from 'multer';
import { app } from '../config/app';
import { transErrors, transSuccess } from '../../lang/en';
import uuidv4 from "uuid/v4"; //tạo 1 chuỗi id ngẫu nhiên
import { user } from '../services/index';
import fsExtra from 'fs-extra';
import { validationResult } from 'express-validator/check'

let storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.avatar_directoty)
    },
    filename: (req, file, callback) => { // Validate ở phía server (phải validate ở cả client và server)
        let math = app.avatar_type;
        if (math.indexOf(file.mimetype) === -1) { // lỗi định dạng 
            return callback(transErrors.avatar_type, null);
        }

        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatarName);
    }
});

let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: { fileSize: app.avatar_size }
}).single("avatar");

let updateAvatar = (req, res) => {
    avatarUploadFile(req, res, async (error) => {
        if (error) {
            if (error.message) return res.status(500).send(transErrors.avatar_size);
            return res.status(500).send(error);
        }

        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updateAt: Date.now()
            };

            //Update user
            let userUpdate = await user.updateUser(req.user._id, updateUserItem);

            if (userUpdate.avatar !== 'avatar-default.jpg') {
                //Remove old user avatar (ko xoa nua)
                // await fsExtra.remove(app.avatar_directoty + '/' + userUpdate.avatar);
            }

            let result = {
                message: transSuccess.info_updated,
                imageSrc: `images/users/${req.file.filename}`
            }
            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send(error);
        }
    })
}

let updateInfo = async (req, res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg)
        })

        return res.status(500).send(errorArr[0]);
    }
    try {
        let UpdateUserInfo = req.body;
        //Update user
        await user.updateUser(req.user._id, UpdateUserInfo);
        let result = {
            message: transSuccess.info_updated
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

let updatePassword = async (req, res) => {
    let errorArr = [];

    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg)
        })
        return res.status(500).send(errorArr[0]);
    }
    
    try {
        let updateUserItem = req.body;
        await user.updateServicePassword(req.user._id, updateUserItem);

        let result={
            message:transSuccess.updated_password
        };

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    updateAvatar,
    updateInfo,
    updatePassword
}