var express = require('express')
var app = express()
var fs = require('fs')
var gm = require('gm');
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
});

var templateConfig = require('./template-config.json')
var arrTemp = [1,2,3,4,5];
var arrCont = [1,2,3,4,5,6];
var person = {'name':'Pandhu', 'childs':[{'name':'Hutomo'}, {'name':'Aditya'}]}
var data = [];
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
        if(person.childs[0] != ''){
            var contentNumber = getRandomInt(1,6);
            var templateNumber = getRandomInt(1,5);
            count = 0;
            person.childs.forEach(function(child){
                templateNumber = ((templateNumber+count)%arrTemp.length)+1;
                contentNumber = ((contentNumber+count)%arrCont.length)+1;
                count++
    	        readContentTemplate(contentNumber, templateNumber, person, child)
            })
        }
    })
}

/*
function start(){
    console.log('start');
    console.log(data);
    data.forEach(function(person){
        console.log(person.childs)
        if(person.childs[0] != ''){
            var contentNumber = getRandomInt(1,6);
            var templateNumber = getRandomInt(1,5);
            var child = person.childs.toString()
            child = child.replace(/,/g,", ");
            readContentTemplate(contentNumber, templateNumber, person, child)
        }
    })
}
*/

/*
arrTemp.forEach(function(templateNumber){
    arrCont.forEach(function(contentNumber){
        readContentTemplate(contentNumber,templateNumber, person)
    })
})
*/
function readContentTemplate(contentNumber, templateNumber, person, child){
    fs.readFile('input/contents/content-'+contentNumber+'.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      if(person.childs.length < 1){
          return;
      } else {
          var newData = data.replace(/%name%/g, child)
          //var newData = data.replace(/%name%/g, "aku")
          console.log(newData);
          writeText(newData, 'input/templates/template-0'+templateNumber+'.jpg', templateConfig[templateNumber-1], contentNumber, templateNumber, person, child);
      }
    });
}

function writeText(textContent, imagePath, config, contentNumber, templateNumber, person, childs){
    console.log("start processing");
    // resize and remove EXIF profile data
    gm(imagePath)
    .font("assets/fonts/"+config.font, config.fontSize)
    .drawText(config.contentPosition.x, config.contentPosition.y, textContent)
    .drawText(config.parentPosition.x, config.parentPosition.y, 'Untuk Bunda '+person.name+',')
    .drawText(config.childPosition.x, config.childPosition.y, 'Dari,\n'+childs)
    .write('output/'+person.name+'-'+childs+'.jpg', function (err) {
        if (!err) console.log('done');
    });

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
