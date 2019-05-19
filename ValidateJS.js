function ValidateNumber() {
    this.validateInt = function (inNumber) {
        var reg = /^\d+$/;
        return reg.test(inNumber) || "Please enter number!";
    }

    this.validateFloat = function (inFloat) {
        var reg = /\-?\d+\.\d+/;
        return reg.test(inFloat) || "Please enter Float!";
    }
};

module.exports = ValidateNumber;