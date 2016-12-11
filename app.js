var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')

  var Jimp = require("jimp");

// open a file called "lenna.png"
Jimp.read("AF131.jpg", function (err, lenna) {
    if (err) throw err;
    lenna.resize(256, 256)            // resize
         .quality(60)                 // set JPEG quality
         .greyscale()                 // set greyscale
         .write("lena-small-bw.jpg"); // save
});

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
