
const net = require('net');
const fs = require('fs');
const port = 8124;
const initialString = 'QA';
const ANSWER_IS_FALSE = 'DEC';
const ANSWER_IS_TRUE = 'ACK';

const client = new net.Socket();
let currentIndex = -1;
client.setEncoding('utf8');

let questions = [];
client.connect({port: port, host: '127.0.0.1'}, () => {
    fs.readFile("qa.json", (err, text) => {
        if (!err) {
            questions = JSON.parse(text);
            client.write(initialString);
        }
        else console.error(err);
    });
});

client.on('data', (data) => {
    if (data === ANSWER_IS_FALSE)
        client.destroy();
    if (data === ANSWER_IS_TRUE)
        sendQuestion();
    else {
        let qst = questions[currentIndex];
        let answer = qst.good;
        console.log('\n' + qst.quest);
        console.log('Answer:' + data);
        console.log('Server:' + answer);
        console.log('Result:' + (data === answer ? 'It is a right answer': 'Bad answer'));
        sendQuestion();
    }
});

client.on('close', function () {
    console.log('Connection closed');
});



function sendQuestion() {
    if (currentIndex < questions.length -1) {
        let qst = questions[++currentIndex].quest;
        client.write(qst);
    }
    else
        client.destroy();
}
