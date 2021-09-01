const http = require('http');
const fs = require ('fs');
const _ = require('lodash');
const server = http.createServer ((req,res)=>{
    console.log('request made');
    //loadash
    const num = _.random(0,20);
    
    const greet = _.once(() => {console.log(num);
    });
    greet();
    res.setHeader('Content-Type' , 'text/html');
    let path ='./views/';
    switch(req.url){
    case '/':
        path +='index.html';
        res.statusCode = 200;
        break ;
        case '/about' :
            path +='about.html';
            break;
            res.statusCode = 200;
        case '/about-me' :
            res.statusCode = 301;
            res.setHeader('Location' , '/about');
            res.end();
            break;
        case '/about-us':
                res.statusCode = 301;
                res.setHeader('Location', '/about');
                res.end();
                break;
        default :
        path += '404.html';
        res.statusCode = 404;
        break;
    }
    fs.readFile(path,(err,data) => {
        if(err){
            console.log(err);
            res.end();
        }
        else {
            //res.write(data);
            res.end(data);
        }
    })

});

server.listen(3000,'localhost',() =>{
    console.log('listening for rquest on port 3000');
});