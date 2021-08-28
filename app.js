const { authUser, addUser, logout, createArticle, listArticles } = require('./services/services');

const http = require('http');


const requestBodyBuilder =  (req) => {
    return  new Promise((resolve, reject) => {
        let body = [];
        let bodyobj;
        req.on('error', (error) => {
            console.log(error);
            reject(error);
        })
        .on('data', (chunk) => {
            body.push(chunk);
        })
        .on('end', () => {
            const bodystr = Buffer.concat(body).toString();
            if (bodystr.length != 0) {
                bodyobj = JSON.parse(bodystr);
            }
            else {
                bodyobj = {};
            }
            resolve(bodyobj);
        });
            
    }); 
}


const app = async (req, res) => {
    try {
        req.body = await requestBodyBuilder(req);
        const { method, url } = req;
        console.log(req.body);
        console.log(url);

        if (method == 'POST') {
            if (url == '/authenticate') {
                await authUser(req, res);
            }
            else if (url == '/users') {
                await addUser(req, res);
            }
            else if (url == '/logout') {
                await logout(req, res);
            }
            else if (url == '/articles') {
                await createArticle(req, res);
            }
            else {
                res.writeHead(404);
                res.end();
            }
        }
        else if (method == 'GET') {
            if (url == '/articles') {
                await listArticles(req, res);
            }
            else {
                res.writeHead(404);
                res.end();
            }
        }
        else {
            res.writeHead(404);
            res.end();
        }

    }
    catch (error) {
        console.log(error);
    }

}


module.exports = app;