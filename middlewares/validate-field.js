const { validationResult } = require("express-validator");

const validateFields = ( req, res, next ) => {

    const errors = validationResult( req );
    
    if ( !errors.isEmpty() ) {
        return res.status( 400 ).json({
            ...errors
        });
    }

    next();
}

const existsFile = ( req, res, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file ) {
        return res.status(400).send({ msg: 'No files were uploaded.'});
    }

    next();
}

module.exports = {
    validateFields,
    existsFile
}