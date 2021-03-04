const fs = require('fs');
const path = require('path');

const { v4: uuid } = require('uuid');

const types = {
    images: ['png', 'jpg', 'jpeg', 'gif'],
    text: [ 'txt', 'md' ], 
    pdf: [ 'pdf' ]
} 

const uploadsPath = path.join( __dirname, '../uploads/');

const uploadFile = ( { file }, validTypes =  [ 'png', 'jpg', 'jpeg', 'gif'], dir = '') => {
    return new Promise( ( resolve, reject ) => {

        const nameSplited = file.name.split('.');

        const fileType = nameSplited[ nameSplited.length - 1 ];

        if ( !validTypes.includes( fileType ) ) {
            reject(`File type not valid - Valid types: ${ validTypes }`);
            return;
        }

        const name = uuid() + '.' + fileType;
    
        const filePath = path.join( uploadsPath, dir, name);

        file.mv(filePath, (err) => {
            if (err) {
              console.log( err );
              reject( `Cant upload file - ${ err }`);
            }
        
            resolve( name );
        });
    });
}

const deleteFile = ( dir, name ) => {

    const filePath = path.join( uploadsPath, dir, name );

    if ( fs.existsSync( filePath ) ) {
        fs.unlinkSync( filePath );
        return name;
    }
    
    return null;
}

const getFilePatch = ( dir, name ) => {

    const filePath = path.join( __dirname, '../' + dir, name );

    if ( fs.existsSync( filePath ) ) {
       return filePath;
    }
    
    return null;
}

module.exports = {
    uploadFile,
    fileTypes : types,
    deleteFile,
    getFilePatch
}