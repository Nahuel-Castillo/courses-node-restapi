const bcrypt = require('bcryptjs');

const encrypt = password => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync( password, salt );
}

const compare = (password, hash ) => {
   return bcrypt.compareSync( password, hash );
}

module.exports = { encrypt, compare }