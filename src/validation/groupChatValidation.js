import { check } from 'express-validator/check';
import { transValidation } from '../../lang/en';

let addNewGroup = [
  check("arrayIds", transValidation.add_new_group_users_incorrect)
    .custom((value) => {
      if (!Array.isArray(JSON.parse(value))) {
        return false;
      }
      if (JSON.parse(value).length < 2) {
        return false;
      }
      return true;
    }),
  check("groupChatName", transValidation.add_new_group_name_incorrect)
    .isLength({ min: 5, max: 30 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
];

module.exports = {
  addNewGroup: addNewGroup
};
