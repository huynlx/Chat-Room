import { validationResult } from 'express-validator/check'
import { contact } from '../services/index';

let findUsersContact = async (req, res) => {
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
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUsersContact", { users });
    } catch (error) {
        return res.status(500).send(error)
    }
}

let addNew = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let newContact = await contact.addNew(currentUserId, contactId);
        // console.log(!!newContact); //log true or false
        return res.status(200).send({ success: !!newContact })
    } catch (error) {
        return res.status(500).send(error)
    }
}

let removeContact = async (req, res) => {
    try {
        let contactId = req.body.uid;
        let currentUserId = req.user._id;
        let removeContact = await contact.removeContact(currentUserId, contactId);
        return res.status(200).send({ success: !!removeContact });
    } catch (error) {
        return res.status(500).send(error);
    }
};

let removeRequestContactSent = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);
        // console.log(!!removeReq); //log true or false
        return res.status(200).send({ success: !!removeReq })
    } catch (error) {
        return res.status(500).send(error)
    }
}

let removeRequestContactReceived = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);
        return res.status(200).send({ success: !!removeReq });
    } catch (error) {
        return res.status(500).send(error);
    }
};

let readMoreContacts = async (req, res) => {
    try {
        let skipNumberContacts = +(req.query.skipNumber);
        let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumberContacts);
        return res.status(200).send(newContactUsers);
    } catch (error) {
        return res.status(500).send(error);
    }
};

let readMoreContactsSent = async (req, res) => {
    try {
        let skipNumberContacts = +(req.query.skipNumber);
        let newContactUsers = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);
        return res.status(200).send(newContactUsers);
    } catch (error) {
        return res.status(500).send(error);
    }
};

let readMoreContactsReceived = async (req, res) => {
    try {
        let skipNumberContacts = +(req.query.skipNumber);
        let newContactUsers = await contact.readMoreContactsReceived(req.user._id, skipNumberContacts);
        return res.status(200).send(newContactUsers);
    } catch (error) {
        return res.status(500).send(error);
    }
};

let approveRequestContactReceived = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);
        return res.status(200).send({ success: !!approveReq });
    } catch (error) {
        return res.status(500).send(error);
    }
};

let searchFriends = async (req, res) => {
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
    let users = await contact.searchFriends(currentUserId, keyword);
    return res.render("main/groupChat/sections/_searchFriends", {users}); //trả về html
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
    findUsersContact,
    addNew,
    removeContact,
    removeRequestContactSent,
    removeRequestContactReceived,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsReceived,
    approveRequestContactReceived,
    searchFriends
}