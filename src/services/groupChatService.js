import _ from "lodash";
import chatGroupModel from "./../models/chatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      //thêm userId vào đầu mảng array members
      arrayMemberIds.unshift({userId: `${currentUserId}`});
      arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");

      let newGroupItem = {
        name: groupChatName,
        userAmount: arrayMemberIds.length,
        userId: `${currentUserId}`,
        members: arrayMemberIds
      };

      let newGroup  = await chatGroupModel.createNew(newGroupItem);
      
      resolve(newGroup);
    } catch (error) {
      reject(error);
    }
  });
};

let countMember = (groupChatId) => {
  return new Promise(async (resolve, reject) => {
    let count = await chatGroupModel.countMember(groupChatId);
    console.log(count);
  });
}

module.exports = {
  addNewGroup: addNewGroup,
  countMember: countMember
};
