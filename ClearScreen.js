function ClearScreen(){
    process.stdout.write("\033c");
}

 
module.exports = ClearScreen;