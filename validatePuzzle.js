function validate(c1, c2, c3, c4, op1, op2, op3) {
    var string = c1 + op1 + c2 + op2 + c3 + op3 + c4;
    if (eval(string) == 24) {
        return true;
    }
    return false;
}

function displayValidate() {
    if (validate(13, 12, 6, 2, "*", "/", "-")) {
        alert("you win");
    } else {
        alert("you lose");
    }
}