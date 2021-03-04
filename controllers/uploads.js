const { request, response} = require('express');

const { uploadFile, fileTypes, deleteFile, getFilePatch, uploadImageCloudinary, removeImageCloudinaryByUrl } = require('../helpers');
const { User, Product } = require('../models');

const getImage = async(req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;

    try {
        switch ( collection ) {
            case 'users':
                model = await User.findById( id );
    
                if ( !model ) {
                    return res.status(400).json({ msg: `Does not exists user with id ${ id }`});
                }
                break;
            case 'products':
                model = await Product.findById( id );
    
                if ( !model ) {
                    return res.status(400).json({ msg: `Does not exists product with id ${ id }` });
                }
                break;
            default:
                return res.json(500).json({ msg: 'Collection no validated'});
        }
       
        if ( model.img ) {
            const filePath = getFilePatch( '/uploads/' + collection, model.img );
            
            return res.sendFile( filePath );
        }

        const noImgPath = getFilePatch( '/assets/', 'no-image.jpg'); 

        res.sendFile( noImgPath );
        
    } catch (error) {
        res.status(500).json( error );
    } 

}

const loadFiles = async( req = request, res = response ) => {

    try {
        
        const name = await uploadFile( req.files, fileTypes.images );
    
        res.json( { name } );

    } catch (msg) {
        // console.log( msg );
        res.status(400).json( { msg } );
    }
}

const updateImage = async( req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    try {

        switch ( collection ) {
            case 'users':
                
                model = await User.findById( id );
    
                if ( !model ) {
                    return res.status(400).json({ msg: `Does not exists user with id ${ id }`});
                }
    
                break;
        
            case 'products':
    
                model = await Product.findById( id );
    
                if ( !model ) {
                    return res.status(400).json({ msg: `Does not exists product with id ${ id }` });
                }
    
                break;
    
            default:
                return res.json(500).json({ msg: 'Collection no validated'});
        }

        const [ name, existImgFile ] = await Promise.all([
            uploadFile( req.files, fileTypes.images, collection ),
            new Promise( ( resolve ) => {
                if ( model.img ) {
                    resolve( deleteFile( collection, model.img ) );
                }

            })
        ]);

        if ( !existImgFile ) {
            delete model.img;
        }
            
        model.img = name;
    
        await model.save();
    
        res.json( model );
        
    } catch (error) {
        res.status(500).json( error );
    } 
} 

const updateImageCloudinary = async( req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    try {

        switch ( collection ) {
            case 'users':
                
                model = await User.findById( id );
    
                if ( !model ) {
                    return res.status(400).json({ msg: `Does not exists user with id ${ id }`});
                }
    
                break;
        
            case 'products':
    
                model = await Product.findById( id );
    
                if ( !model ) {
                    return res.status(400).json({ msg: `Does not exists product with id ${ id }` });
                }
    
                break;
    
            default:
                return res.json(500).json({ msg: 'Collection no validated'});
        }

        const { tempFilePath } = req.files.file;

        if ( model.img ) {
            removeImageCloudinaryByUrl( model.img );
        }

        const { secure_url } = await uploadImageCloudinary( tempFilePath );
        model.img = secure_url;

        model.save();

        res.json( model );
        
    } catch (error) {
        res.status(500).json( error );
    } 
} 

module.exports = {
    loadFiles,
    updateImage,
    getImage,
    updateImageCloudinary
}