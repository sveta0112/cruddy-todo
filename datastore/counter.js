const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};


const readCounter = (callback) => {
  return new Promise((resolve, reject) =>{
    fs.readFile(exports.counterFile, (err, fileData) =>{
      if(err){
        reject(err);
      } else {
        resolve(fileData);
      }
    }); 
  });
  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   if (err) {
  //     callback(null, 0);
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  return new Promise((resolve, reject) =>{
    fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      reject('error writing counter');
    } else {
      resolve(null, counterString);
    }
  });
  })
  
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter(function(err, counter) {
    if (err) {
      null;
    } else {
      writeCounter(counter + 1, function(err, counterString) {
        callback(err, counterString);
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
