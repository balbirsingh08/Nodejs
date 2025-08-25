console.log("Hello World");
const fs = require("fs");

fs.writeFile("output.txt", "my name is balbir", (err) => {
    if (err) {
        console.log("error occured");
    } else {
        console.log("success");
    }
});