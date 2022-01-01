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

let addNewMembers = async (req, res) => {
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
    let arrayMemberIds = req.body.arrayIds;
    let groupChatId = req.body.groupChatId;

    let addNewMembers = await groupChat.addNewMembers(arrayMemberIds, groupChatId);
    return res.status(200).send({ groupChat: addNewMembers });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let searchMembers = async (req, res) => {
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
    let keyword = req.params.keyword;
    let users = await groupChat.searchMembers(currentUserId, keyword);
    return res.render("main/newMembersGroup/sections/_searchMembers", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeMember = async (req, res) => {
  try {
    let contactId = req.body.uid;
    let groupChatId = req.body.groupChatId;
    let removeMember = await groupChat.removeMember(contactId, groupChatId);
    return res.status(200).send({ success: !!removeMember });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeGroupChat = async (req, res) => {
  try {
    let userId = req.user._id;
    let groupChatId = req.body.groupChatId;
    let removeGroup = await groupChat.removeGroupChat(userId, groupChatId);

    return res.status(200).send({ success: !!removeGroup });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewGroup: addNewGroup,
  addNewMembers: addNewMembers,
  searchMembers: searchMembers,
  removeMember: removeMember,
  removeGroupChat: removeGroupChat
};