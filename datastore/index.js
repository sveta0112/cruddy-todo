const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

var items = {
  '0001': 'do laundry'
};
let readdirAsync = Promise.promisify(fs.readdir);
let readFileAsync = Promise.promisify(fs.readFile);
let writeFileAsync = Promise.promisify(fs.writeFile);
let unlinkAsync = Promise.promisify(fs.unlink);
// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // counter.getNextUniqueId(function (err, id) {
  //   fs.writeFile(exports.dataDir + `/${id}.txt`, text, function(err) {
  //     if (err) {
  //       throw err;
  //     } 
  //     callback(null, { id, text });
  //   });
  // });
  let id;
  counter.getNextUniqueId().then(idNo => {
    debugger;
    id = idNo;
    return writeFileAsync(exports.dataDir + `/${id}.txt`, text);
  }).then(() => callback(null, {id, text}));
};



// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, function (err, files) { 
//     if (err) {
//       throw err;
//     } else {
//       Promise.all(files.map(fileName => { 
//         debugger;
//         return exports.readOneAsync(fileName.split('.')[0]);
//       })).then((err, list) => callback(err, list));
      
//     }
//   });
  
// };

exports.readAll = (callback) => {
  readdirAsync(exports.dataDir)
    .then(files => Promise.all(files.map(fileName => 
      exports.readOneAsync(fileName.split('.')[0])
    ))).then(list => callback(null, list))
    .catch(err => callback(err));
};



exports.readOne = (id, callback) => {
  readFileAsync(exports.dataDir + `/${id}.txt`,'utf8',id)
    .then((data) => callback(null, {id: id, text: data}));
  // fs.readFile(exports.dataDir + `/${id}.txt`, 'utf8', function (err, data) {
  //   if (err) {
  //     callback(new Error(`No item with id: ${id}`));
  //   } else {
  //     callback(null, { id: id, text: data });
  //   }
  // });
};

exports.readOneAsync = Promise.promisify(exports.readOne);

exports.update = (id, text, callback) => {
  readFileAsync(exports.dataDir + `/${id}.txt`, 'utf8')
    .then(() => writeFileAsync(exports.dataDir + `/${id}.txt`, text))
    .then(() => callback(null, { id, text }))
    .catch(err => callback(new Error(`No item with id: ${id}`)));
  // fs.readFile(exports.dataDir + `/${id}.txt`, 'utf8', function (err, data) {
  //   if (err) {
  //     callback(new Error(`No item with id: ${id}`));
  //   } else {
  //     fs.writeFile(exports.dataDir + `/${id}.txt`, text, function() {
  //       callback(null, { id, text });
  //     });
  //   }
  // });
};

exports.delete = (id, callback) => {
  // unlinkAsync(exports.dataDir + `/${id}.txt`)
  // .then(() => callback())
  // .catch(err => callback(new Error(`No item with id: ${id}`)));
  fs.unlink(exports.dataDir + `/${id}.txt`, function(err) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  
  
  
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
