var Client = require('emailjs-smtp-client');
var chalk = require('chalk');

var client = new Client('smtp.qq.com', 465);

var options = {
	useSecureTransport: true,
	name: 'LJ',
	auth: {
		user: '8275922@qq.com',
		pass: 'szpuatejivbbcajh'
	},
	authMethod: 'PLAIN'
}

module.exports = send;

var currSendingMail;

client.onidle = function(){
	console.log('mailer idle');
	isIdle = true;
	checkMailQueue();
    // this event will be called again once a message has been sent
    // so do not just initiate a new message here, as infinite loops might occur
};

client.onready = function() {
	console.log('sending mail');
	currSendingMail = queue[0];
	client.send("Subject: test\r\n");
	client.send("\r\n");
	client.send("Message body");
	client.end();
};

client.ondone = function() {
	queue.shift();
};

client.onerror = function(err) {
	console.log(chalk.red('Failure:'))
	console.log(err);
};

client.onclose = function() {
	console.log('reconnecting');
	process.nextTick(()=> {
		client.connect();
	});
};

client.connect(options);

var queue = [];

function send(packageName, version) {
	queue.push({
		name: packageName,
		version: version
	});
	checkMailQueue();
}

function checkMailQueue() {
	if (isIdle && queue.length > 0 ) {
		isIdle = false;
		useEnvelope();
	}
}

function useEnvelope() {
	client.useEnvelope({
		from: 'liujing.break@163.com',
		to: ['jing.liu.FE@dianrong.com']
	});
}
