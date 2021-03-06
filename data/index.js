const fs = require('fs');
const url = require('url');
const http = require('http');

// Read Data File
const json = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const laptopData = JSON.parse(json);
//console.log(laptopData);

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    console.log(pathName);
    //console.log(id);


    if (pathName === '/overview' || pathName === '') {
        res.writeHead(200, {'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardOutput = laptopData.map(el => replaceTemplate(data, el).join(''));
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardOutput);
                res.end(overviewOutput);
            });
        });


        res.end('Server is called!');
    }

    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    }

    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL is not found in server!');
    };
    
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listen to a respone');
});


function replaceTemplate(original, laptop) {

    let output = original.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
};
