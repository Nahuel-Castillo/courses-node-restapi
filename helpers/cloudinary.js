const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);


const uploadImageCloudinary = ( path ) => {
    return cloudinary.uploader.upload( path );
}

const removeImageCloudinaryByUrl = ( url = '') => {

    const urlSplited = url.split('/');
    const imageName = urlSplited[ urlSplited.length - 1];

    const [ image_id ] = imageName.split('.');

    return cloudinary.uploader.destroy( image_id );
}


module.exports = {
    uploadImageCloudinary,
    removeImageCloudinaryByUrl
}

