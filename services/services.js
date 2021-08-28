
const { v4: uuidv4 } = require('uuid');
let usersDB = [];
let articlesDB = [];
let loggedUsers = [];

const authUser = async (req, res) => {
    
    if (Object.keys(req.body).length == 0) {
        res.writeHead(400);
        res.end();
    }
    else {
        const pass = req.body.password;
        const user = req.body.user;
        const userdb = usersDB.find(element => { return element.user == user });
        if (userdb) {
            if (userdb.password == pass) {
                const token = uuidv4();
                console.log(`Usuario athenticado ${userdb.user} ${token}`);
                loggedUsers.push({user, token});
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify({ token }));
            }
            else {
                res.writeHead(401);
                res.end();
            }
        }
        else {
            res.writeHead(404);
            res.end();
        }
    }
}

const addUser = async (req, res) => {
    if(Object.keys(req.body).length == 0){
        res.writeHead(400);
        res.end();
    }
    else{
        
        const pass = req.body.password;
        const user = req.body.user;

        if(pass && user){
            console.log(`Se agrega usario ${user}, password: ${pass}`);
            usersDB.push({user, password: pass});
            res.writeHead(201);
            res.end();
        }
        else{
            res.writeHead(400);
            res.end();
        }
    }
}

const logout = async (req, res) => {
    const token = req.headers.authorization.split(" ").pop();
    const user = loggedUsers.find(element => {return element.token == token});
    if(user){
        console.log(`logout user ${user.user}`);
        const index = loggedUsers.findIndex(element => {element.token == token});
        loggedUsers.splice(index);
        res.writeHead(200);
        res.end();
    }
    else{
        res.writeHead(401);
        res.end();
    }
}

const createArticle = async (req, res) => {
    const auth = req.headers.authorization;
    

    if(auth){
        const token = req.headers.authorization.split(" ").pop();
        const user = loggedUsers.find(element => {return element.token == token});
        if(user){
            if(Object.keys(req.body).length == 0){
                res.writeHead(400);
                res.end();
            }
            else{
                const {article_id, title, content, visibility} = req.body;
                if(article_id && title && content && visibility){
                    console.log(`se crea articulo ${req.body}`);
                    let article_db = req.body;
                    article_db.user = user.user;
                    articlesDB.push(article_db);
                    res.writeHead(201);
                    res.end();
                    
                }
                else{
                    res.writeHead(400);
                    res.end();
                }
            }
        }
        else{
            res.writeHead(401);
            res.end();
        }
    }
    else{
        res.writeHead(401);
        res.end();
    }
    
    
}

const listArticles = async (req, res) => {
    const auth = req.headers.authorization;
    if (auth) {
        const token = req.headers.authorization.split(" ").pop();
        const user = loggedUsers.find(element => { return element.token == token });

        if (user) {
            const filtered = articlesDB.filter(element => {
                return (element.visibility == 'public' || element.user == user.user);
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filtered));
        }
        else {
            const filtered = articlesDB.filter(element => {
                return element.visibility == 'public';
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filtered));
        }
    }
    else{
        const filtered = articlesDB.filter(element => {
            return element.visibility == 'public';
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(filtered));
    }

}


module.exports = {
    authUser,
    addUser,
    logout,
    createArticle,
    listArticles
}