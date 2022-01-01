export const transValidation = {
    email_incorrect: 'Email is wrong format!',
    gender_incorrect: 'Oh, something is not right?',
    password_incorrect: 'Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters.',
    password_confirmation_incorrect: 'Re-enter the incorrect password.',
    update_username: "Username is limited to 3-17 characters and does not contain special characters!",
    update_gender: "Why is his gender like this?",
    update_address: "Addresses are limited to 3-30 characters!",
    update_phone: "Wrong phone number entered!",
    keyword_find_user: "Search keyword error, special characters are not accepted!",
    message_text_emoji_incorrect: "Invalid message. Minimum 1 character, maximum 500 characters.",
    add_new_group_users_incorrect: "Please select friends to add to the group, minimum 2 friends.",
    add_new_group_name_incorrect: "Set the group name to be limited to 5-30 characters and cannot contain special characters.",
};

export const transErrors = {
    account_in_use: "This e-mail is already taken !",
    account_removed: "This account has been removed from the system, if you believe this is a misunderstanding, please contact our support again!",
    account_not_actived: "This account is registered but not activated, please check your email or contact our support again!",
    account_underfined: "TAccount does not exist!",
    token_undefined: "Account activated!",
    login_failed: 'Wrong account or password !',
    server_error: 'Something went wrong on the server side, please report it to our support!',
    avatar_type: 'Invalid image file type. Please select .PNG or .JPG image',
    avatar_size: 'Please choose an image that is less than 1 Megabyte in size!',
    current_password_failed: 'The current password is incorrect!',
    conversation_not_found: "The conversation does not exist.",
    image_message_type: "Invalid file type.",
    image_message_size: "The maximum allowed size is 1 MB.",
    attachment_message_size: "The maximum allowed size is 1 MB."
}

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Account <strong>${userEmail}</strong> has been created, please check your email for activation. Thank you !`
    },
    account_actived: "Account activation is successful, you can log in to the application.",
    login_success: (username) => {
        return `Hello ${username}, have a good day !`
    },
    logout_success: 'Sign out successful !',
    info_updated: 'Successfully updated !',
    updated_password: "Password update successful !"
}

export const transMail = {
    subject: 'Confirm account activation.',
    template: (linkVerify) => {
        return `<h2>You received this email because you signed up for an account on the Chat Room app.</h2>
        <h3>Please click on the link below to confirm account activation.</h3>
        <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        <h4>If you believe this email is mistaken, ignore it. Best regards.</h4>`
    },
    send_failed: "There was an error sending the email, please contact our support again."
}
