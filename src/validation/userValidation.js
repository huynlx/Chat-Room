import { check } from 'express-validator/check';
import { transValidation } from '../../lang/en';

let updateInfo = [
    check("username", transValidation.update_username)
        .optional() //cho phép null (nếu người dùng ko thay đổi trường này)
        .isLength({ min: 3, max: 17 })
        .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
    check("gender", transValidation.update_gender)
        .optional()
        .isIn(["male", "female"]),
    check("address", transValidation.update_address)
        .optional()
        .isLength({ min: 3, max: 30 }),
    check("phone", transValidation.update_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)
];

let updatePassword = [
    check("currentPassword", transValidation.password_incorrect)
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("newPassword", transValidation.password_incorrect)
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("confirmPassword", transValidation.password_confirmation_incorrect)
        .custom((value, { req }) => value === req.body.newPassword)
]

module.exports = {
    updateInfo,
    updatePassword
}
