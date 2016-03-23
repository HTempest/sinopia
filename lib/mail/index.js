var email = require('emailjs');
//var chalk = require('chalk');

var server = email.server.connect({
  //user: 'jing.liu.FE@dianrong.com',
  user: '8275922@qq.com',
  password: 'szpuatejivbbcajh',
  ssl: true,
  host: 'smtp.qq.com',
  port: 465,
});

var message = {
  text: 'i hope this works',
  from: 'web-fun-house NPM registry <8275922@qq.com>',
  to: 'liujing.break@163.com',
  //cc:		'else <else@your-email.com>',
  subject: 'testing emailjs',
};

server.send(message, function(err, message) {
  console.log('cool!');
  console.log(err || message);
});

// var server2 = email.server.connect({
//   user: 'liujing.break@163.com',
//   password: 'Uiop7890',
//   ssl: true,
//   host: 'smtp.163.com',
//   port: 465,
// });
//
// server2.send({
//   text: 'i hope this works',
//   from: 'liujing.break@163.com',
//   to: 'jing.liu.FE@dianrong.com',
//   //cc:		'else <else@your-email.com>',
//   subject: 'testing emailjs',
// }, function(err, message) {
//   console.log('cool!');
//   console.log(err || message);
// });
