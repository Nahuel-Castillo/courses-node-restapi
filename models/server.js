const express = require('express');
const cors = require('cors');

const usersRoute = require('../routes/users');

class Server {

    constructor() {
        this.app = express();

        this.port = process.env.PORT;
        this.userRoutePath = '/api/users';

        //Middlewares
        this.middlewares();
        //Routes
        this.routes();
    }

    routes() {
        this.app.use( this.userRoutePath, usersRoute );
    }

    listen() {
        this.app.listen( this.port, () => console.log(`Running on port ${ this.port }`) );
    }

    middlewares() {

        this.app.use( cors() );

        //read and parse to json
        this.app.use( express.json() );

        this.app.use( express.static('public') );
    }

}

module.exports = Server;