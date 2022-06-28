//input "npm run start:dev" in the console to run server.js using nodemon
//or "npm start" to run server.js using node

const http = require('http');
const fs = require('fs');
const os = require('os');

host = '127.0.0.1';
port = 3000;

let CPU_Data = JSON.stringify({
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    numberOfCPUs: os.cpus().length,
    networkInterfaces: os.networkInterfaces(),
    uptime: os.uptime()
}, null, 2);

const server = http.createServer((req, res) => {
    const urlpath = req.url;

    if (urlpath === '/' || urlpath === '/home'){
        res.statusCode = 200;
        res.setHeader = {'content-Type': 'text/html'};
        fs.createReadStream('./pages/index.html').pipe(res);
    }else if (urlpath === '/about'){
        res.statusCode = 200;
        res.setHeader = {'content-Type': 'text/html'};
        fs.createReadStream('./pages/about.html').pipe(res);
    }else if (urlpath === '/sys'){
        if(!fs.existsSync('./osfile.json')){
            fs.writeFile('./osfile.json', CPU_Data, (err) => {
                if(err){
                    console.error(err);
                    return;
                }else{
                    res.statusCode = 201;
                    res.setHeader = {'content-Type': 'text/plain'};
                    res.write('Your OS Info has been saved successfully!');
                    res.end();
                }
            })    
        }else{
            res.statusCode = 201;
            res.setHeader = {'content-Type': 'text/plain'};
            res.write(`OS Info file already exist!! \n input '${host}:${port}/del_sys' to delete the file.`);
            res.end();
        }
    }else if(urlpath === '/del_sys'){
        if(fs.existsSync('./osfile.json')){
            fs.unlink('./osfile.json', (err) => {
                if(err){
                    console.error(err);
                    return;
                }else{
                    res.statusCode = 201;
                    res.setHeader = {'content-Type': 'text/plain'};
                    res.write('file deleted successfully!!');
                    res.end();
                }
            });
        }else{
            res.statusCode = 201;
            res.setHeader = {'content-Type': 'text/plain'};
            res.write(`file does not exist!! \n Please, input '${host}:${port}/sys' to create the OS file.`);
            res.end();
        }
    }else{
        res.statusCode = 404;
        res.setHeader = {'content-Type': 'text/html'};
        fs.createReadStream('./pages/404.html').pipe(res);
    }    
});

server.listen(port, host, () => {
    console.log(`server is running at ${host}:${port}`);
});