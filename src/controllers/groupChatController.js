import { validationResult } from "express-validator/check";
import { groupChat, contact } from "./../services/index";
import { resolve } from "bluebird";

let addNewGroup = async (req, res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorsArr.push(item.msg);
    });
    return res.status(500).send(errorsArr);
  }

  try {
    let currentUserId = req.user._id;
    let arrayMemberIds = JSON.parse(req.body.arrayIds);
    let groupChatName = req.body.groupChatName;

    let newGroupChat = await groupChat.addNewGroup(currentUserId, arrayMemberIds, groupChatName);
    return res.status(200).send({ groupChat: newGroupChat });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewGroup: addNewGroup
};