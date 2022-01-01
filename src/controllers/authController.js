import { validationResult } from 'express-validator/check'
import { auth } from '../services/index';
import { transSuccess } from '../../lang/en';

let getLoginRegister = (req, res) => {
    return res.render('auth/master', {
        errors: req.flash("errors"),
        success: req.flash('success')
    });
};

let postRegister = async (req, res) => {
    // do something
    // console.log(validationResult(req).isEmpty()); // false => có lỗi

    let errorArr = [];
    let successArr = [];

    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg)
        })
        req.flash("errors", errorArr);
        return res.redirect('/login-register');
    }

    const data = {
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password
    }

    try {
        let createUserStatus = await auth.register(data.email, data.gender, data.password, req.protocol, req.get("host"));
        successArr.push(createUserStatus);
        req.flash("success", successArr); //success = successArr
        return res.redirect("/login-register");
    } catch (error) {
        errorArr.push(error);
        req.flash("errors", errorArr); //errors = errorArr
        return res.redirect("/login-register");
    }
};

let verifyAccount = async (req, res) => {
    let errorArr = [];
    let successArr = [];
    try {
        let verifySuccess = await auth.verifyAccount(req.params.token);
        successArr.push(verifySuccess);
        req.flash("success", successArr);
        return res.redirect("/login-register");
    } catch (error) {
        errorArr.push(error);
        req.flash("errors", errorArr);
        return res.redirect("/login-register");
    }
};

let getLogout = (req, res) => {
    req.logout(); //Remove session passport user
    req.flash('success', transSuccess.logout_success);
    return res.redirect("/login-register");
}

let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { //phương thức của thằng passport để kiểm tra đăng nhập hay chưa
        return res.redirect("/login-register");
    }
    next(); //chạy request tiếp theo
}

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) { //phương thức của thằng passport để kiểm tra đăng nhập hay chưa
        return res.redirect("/");
    }
    next(); //chạy request tiếp theo
}

module.exports = {
    getLoginRegister,
    postRegister,
    verifyAccount,
    getLogout,
    checkLoggedIn,
    checkLoggedOut
};

