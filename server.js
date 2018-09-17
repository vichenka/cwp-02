// server.js
const fs = require('fs');
const net = require('net');
const port = 8124;

let seed = 0;
let a = [];

const CLIENT_NAME = "CLIENT";
const SERVER_NAME = "SERVER";

const rand_Ans = "UNKNOWN";
const QUESTION = "QA";
const ANSWER_IS_RIGHT = "ACK";
const ANSWER_IS_FALSE = "DEC";

const server = net.createServer((client) => {
    console.log('Client connected');

    client.setEncoding('utf8');

    client.on('data', (data) => {
   if(client.id === undefined)
   {
       client.id = (Date.now() + seed++).toString();
       console.log("id :" + client.id);
   }
   log(client.id,data,CLIENT_NAME);
   if (data === QUESTION)
   {
            client.write(ANSWER_IS_RIGHT);
            log(client.id, ANSWER_IS_RIGHT, SERVER_NAME);
        }
        else
   {
 let ans = randomAns(data)
if(ans === rand_Ans){
    client.write(ANSWER_IS_FALSE);
    log(client.id,data,SERVER_NAME);
    client.disconnect();
}
else{
    client.write(ANSWER_IS_RIGHT);
    log(client.id, data, SERVER_NAME);
}
   }
    });

    client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
    fs.readFile('qa.json', (err,data)=> {
        if(err){ throw err;}
        else{
            a = JSON.parse(data);
        }
    })
});

function randomAns(QUESTION){
    for (let i = 0; i<a.length;i++){
        if(a[i].question === QUESTION){
            return Math.floor(Math.random() * 2) === 0 ? a[i].answer : a[i].wrong_answer;
        }
    }
    return rand_Ans;
}

function log(CLIENT_ID,ANSWER, SENDER){
    fs.appendFileSync("DIRECT" + "/" + CLIENT_ID + ".log", SENDER + ": " + ANSWER + "\r\n");
}