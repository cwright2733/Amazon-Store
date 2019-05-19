function FormatString(){
    this.capitalizeString = function(inString){
    var newstr = inString.split(' ')
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')
    return newstr;
    };

    this.formatFloat = function(inFloat){
        return(new Intl.NumberFormat().format(inFloat));
    }
};

module.exports = FormatString;