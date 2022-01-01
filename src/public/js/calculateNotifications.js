function increaseNumberNotifications(className, number) {
    let currentValue = +$(`.${className}`).text(); // '+' => parseInt
    currentValue += number;
    if (currentValue === 0) {
        $(`.${className}`).css("display", "none").html();
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
}

function decreaseNumberNotifications(className, number) {
    let currentValue = +$(`.${className}`).text(); // '+' => parseInt
    currentValue -= number;
    if (currentValue === 0) {
        $(`.${className}`).css("display", "none").html('');
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
}