function increaseNumberNotifiContact(className) {
    let currentValue = +$(`.${className}`).find("em").text(); // '+' => parseInt
    currentValue += 1;
    if (currentValue === 0) {
        $(`.${className}`).html()
    }else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`)
    }
}

function decreaseNumberNotifiContact(className) {
    let currentValue = +$(`.${className}`).find("em").text(); // '+' => parseInt
    currentValue -= 1;
    if (currentValue === 0) {
        $(`.${className}`).html('')
    }else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`)
    }
}