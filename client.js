// client.js
const fs = require('fs');
const net = require('net');
const port = 8124;

const client = new net.Socket();

let q = [];
let index = 0;

const CLIENT_NAME = "CLIENT";
const SERVER_NAME = "SERVER";

const rand_Ans = "UNKNOWN";
const QUESTION = "QA";
const ANSWER_IS_RIGHT = "ACK";
const ANSWER_IS_FALSE = "DEC";

client.setEncoding('utf8');

client.connect(port, function() {
    fs.readFile("qa.json", (err,data)=>{
        if(err){throw err;}
        else{
            q = JSON.parse(data);
            q = q.sort(RANDOMMASSIVE);
            client.write(QUESTION);
        }
    })
});

client.on('data', function(data) {
    if(data === ANSWER_IS_RIGHT){
        client.write(q[0].question);
    }
    if(data === ANSWER_IS_FALSE){
        client.destroy();
        process.terminate();
    }
    if(data !== ANSWER_IS_RIGHT){
        console.log (q[index].question);
        console.log (data);
        console.log (data === q[index].answer ? "Right" "Wrong");
        if((index + 1) === q.length){
            client.destroy();
        }
        else{
            ++index;
            client.write(q[index].question);
            
        }
    }

});

client.on('close', function() {
    console.log('Connection closed');
});

function RANDOMMASSIVE(a,b){
    return Math.random() - 0.5;
}