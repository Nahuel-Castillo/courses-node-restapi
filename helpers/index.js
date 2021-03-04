const dbValidators = require('./db-validators');
const bcrypt       = require('./bcrypt');
const cloudinary   = require('./cloudinary'); 
const googleVerify = require('./google-verify');
const jwt          = require('./jwt');
const uploadFile   = require('./files-actions');

module.exports = {
    ...dbValidators,
    ...bcrypt,
    ...googleVerify,
    ...jwt,
    ...uploadFile,
    ...cloudinary
}