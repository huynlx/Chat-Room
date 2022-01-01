import {check} from "express-validator/check";
import {transValidation} from "./../../lang/en";

let checkMessageLength = [
  check("messageVal", transValidation.message_text_emoji_incorrect)
    .isLength({min: 1, max: 500})
];

module.exports = {
  checkMessageLength: checkMessageLength
};
