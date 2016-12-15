var express = require('express')
var app = express()
var fs = require('fs')
var gm = require('gm');
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
});

var templateConfig = require('./template-config.json')
var arrTemp = [5];
var arrCont = [1,2,3,4,5,6];
var person = {'name':'Pandhu', 'childs':[{'name':'Hutomo'}, {'name':'Aditya'}]}
var data = [];
lineReader.on('line', function (line) {
    var arrLine = line.split(',');
    var parentName = arrLine[0];
    var childsName = arrLine[1].split(';');
    var parent = new Object()
    parent.name = parentName;
    parent.childs = childsName;
    data.push(parent);
});
lineReader.on('close', function (line) {
    start()
});
function chooseTemplateContent(){
    //contentNumber = getRandomInt(1,6);
    //templateNumber = getRandomInt(2,2);
    readContentTemplate(contentNumber,templateNumber)

}
function start(){
    console.log('start');
    console.log(data);
    data.forEach(function(person){
        var contentNumber = getRandomInt(1,6);
        var templateNumber = getRandomInt(1,5);
        readContentTemplate(contentNumber, templateNumber, person)
    })
}
/*
arrTemp.forEach(function(templateNumber){
    arrCont.forEach(function(contentNumber){
        readContentTemplate(contentNumber,templateNumber)
    })
})
*/
function readContentTemplate(contentNumber, templateNumber, person){
    fs.readFile('input/contents/content-'+contentNumber+'.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      writeText(data, 'input/templates/template-0'+templateNumber+'.jpg', templateConfig[templateNumber-1], contentNumber, templateNumber, person);
    });
}

function writeText(textContent, imagePath, config, contentNumber, templateNumber, person){
    console.log("start processing");
    // resize and remove EXIF profile data
    gm(imagePath)
    .font("assets/fonts/"+config.font, config.fontSize)
    .drawText(config.contentPosition.x, config.contentPosition.y, textContent)
    .drawText(config.parentPosition.x, config.parentPosition.y, 'Untuk bunda '+person.name+',')
    .drawText(config.childPosition.x, config.childPosition.y, 'Dari,\n'+person.childs.toString())
    .write('output/'+person.name+'.jpg', function (err) {
        if (!err) console.log('done');
    });

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
