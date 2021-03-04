const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../db/config');

const { 
    products: productsRouter, 
    users: usersRouter, 
    auth: authRouter, 
    categories: categoriesRouter ,
    search: searchRouter,
    uploads: uploadsRouter
} = require('../routes');

class Server {

    constructor() {
        this.app = express();

        this.port = process.env.PORT;

        //routes
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            users: '/api/users',
            uploads: '/api/uploads'
        }; 

        //Connect to database
        this.connectDB();

        //Middlewares
        this.middlewares();
        //Routes
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    routes() {

        const { auth, users, categories, products, search, uploads } = this.paths;

        this.app.use( auth, authRouter );
        this.app.use( categories, categoriesRouter );
        this.app.use( products, productsRouter );
        this.app.use( search, searchRouter );
        this.app.use( users, usersRouter );
        this.app.use( uploads, uploadsRouter );
    }
    
    listen() {
        this.app.listen( this.port, () => console.log(`Running on port ${ this.port }`) );
    }

    middlewares() {

        //cors
        this.app.use( cors() );

        //read and parse to json
        this.app.use( express.json() );

        this.app.use( express.static('public') );

        //files upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

}

module.exports = Server;