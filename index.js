const {v4: uuid} = require('uuid')

const { format } = require('date-fns');
console.log(format(new Date(), 'yyyy-MM-dd'));

console.log('Server-side code running');
console.log('Hello...');

const http = require('http');
const path = require('path');
const fs = require('fs');
const server = http.createServer((req, res) => {
    // const filePath = path.join(__dirname, 'index.html');
    // fs.readFile(filePath, (err, data) => {
    //     if (err) {
    //         res.writeHead(500);
    //         res.end('Error loading index.html');
    //         return;
    //     }
    //     res.writeHead(200);
    //     res.end(data);
    // });
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, this is a basic Node.js server!");
});

const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

// console.log('Server-side code running');
// console.log('Hello...');

// const { log } = require('console');
// const os = require('os');
// log(os.hostname());
// log(os.platform());
// log(os.type());
// log(os.arch());
// log(os.release());
// log(os.uptime());
// log(os.loadavg());
// log(os.totalmem());
// log(os.version());

