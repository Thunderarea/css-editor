export const preventKeyDefault = (e) => {
    let key = 0;
    if (e.ctrlKey) {
        //ctrlKey + C, ctrlKey + V, ctrlKey + X
        if ((e.keyCode !== 67) && (e.keyCode !== 86) && (e.keyCode !== 88)) 
            e.preventDefault();
        }
    else if (e.keyCode === 13 || (e.keyCode === 186 && e.key === ";")) {
        e.preventDefault();
        key = e.keyCode;
    }
    return key;
}

export const onBlur = (e) => {
    let target = e.target;
    e.preventDefault();
    target.setAttribute("contenteditable", "false");
    return !target
        .textContent
        .trim();
}

export const clickEditable = (e) => {
    let target = e.target;
    if (target.contentEditable !== "true") { //may be inherit, initial...
        e.preventDefault();
        target.setAttribute("contenteditable", "true");
        target.focus();
    }
}