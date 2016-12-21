var express = require('express')
var app = express()
var fs = require('fs')
var gm = require('gm');

var templateConfig = require('./template-config.json')
var arrTemp = [1,2,3,4,5];
var arrCont = [1,2,3,4,5,6];
var person = {'name':'Pandhu', 'childs':[{'name':'Hutomo'}, {'name':'Aditya'}]}
var data = [];
var args = process.argv.slice(2);

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(args[0])
});

//baca file data agen dan menyimpannya dalam bentuk array of js object dalam variable data
lineReader.on('line', function (line) {
    var arrLine = line.split(',');
    var parentName = arrLine[0];
    var childsName;
    try{
        childsName = arrLine[1].split(';');
    } catch(e){
        childsName = [];
    }
    var parent = new Object()
    parent.name = parentName;
    parent.childs = childsName;
    data.push(parent);
});

//setelah selesai membaca file, jalankan fungsi start()
lineReader.on('close', function (line) {
    console.log(args)
    start()
});

function start(){
    console.log('start');
    //untuk setiap agen pada variable data dilakukan looping
    data.forEach(function(person){
        //proses data jika agen memiliki anak
        if(person.childs[0] != ''){
            //memilih secara acak konten dan template desain
            var contentNumber = getRandomInt(1,6);
            var templateNumber = getRandomInt(1,5);
            count = 0;
            //untuk setiap anak agen
            person.childs.forEach(function(child){
                //increament nomor konten dan nomor template untuk anak ke-2 dst.
                templateNumber = ((templateNumber+count)%arrTemp.length)+1;
                contentNumber = ((contentNumber+count)%arrCont.length)+1;
                count++
    	        readContentTemplate(contentNumber, templateNumber, person, child, false)
            })
        }
    })
    startSingle()
}


function startSingle(){
    console.log('start');
    console.log(data);
    data.forEach(function(person){
        console.log(person.childs)
        if(person.childs[0] != ''){
            var contentNumber = getRandomInt(1,6);
            var templateNumber = getRandomInt(1,5);
            var child = person.childs.toString()
            child = child.replace(/,/g,", ");
            readContentTemplate(contentNumber, templateNumber, person, child, true)
        }
    })
}


/*
arrTemp.forEach(function(templateNumber){
    arrCont.forEach(function(contentNumber){
        readContentTemplate(contentNumber,templateNumber, person)
    })
})
*/

//fungsi ini digunakan untuk membaca data dari template content.
function readContentTemplate(contentNumber, templateNumber, person, child, isSingle){
    //menggunakan fungsi readFile untuk membaca string dalam file
    fs.readFile('input/contents/content-'+contentNumber+'.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      if(person.childs.length < 1){
          return;
      } else {
          //mengganti %name% pada template dengan nama anak

          var newData
          if(isSingle)
            newData = data.replace(/%name%/g, "aku")
            else
            newData = data.replace(/%name%/g, child)

          console.log(newData);
          //memanggil fungsi writeText()
          writeText(newData, 'input/templates/template-0'+templateNumber+'.jpg', templateConfig[templateNumber-1], contentNumber, templateNumber, person, child, isSingle);
      }
    });
}

//fungsi ini digunakan untuk menuliskan string pada gambar.
function writeText(textContent, imagePath, config, contentNumber, templateNumber, person, childs, isSingle){
    console.log("start processing");
    var savePath;

    if(isSingle){
        savePath = args[1]+'/output-single/'
    } else {
        savePath = args[1]+'/output/'
    }
    if (!fs.existsSync(args[1])){
        fs.mkdirSync(args[1]);
    }
    if (!fs.existsSync(savePath)){
        fs.mkdirSync(savePath);
    }
    // membuka file gambar di
    gm(imagePath)
    .font("assets/fonts/"+config.font, config.fontSize)
    .drawText(config.contentPosition.x, config.contentPosition.y, textContent)
    .drawText(config.parentPosition.x, config.parentPosition.y, 'Untuk Bunda '+person.name+',')
    .drawText(config.childPosition.x, config.childPosition.y, 'Dari,\n'+childs)
    .write(savePath+person.name+'-'+childs+'.jpg', function (err) {
        if (!err) console.log('done');
    });

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
