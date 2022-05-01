const http = require('http');
const fs = require('fs');
const path = require('path');

const file = fs.createWriteStream('download.jpg');
http.get('http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg', function (response) {
    response.pipe(file);

    file.on("finish", () => file.close());
});