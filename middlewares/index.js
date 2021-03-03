const validateField = require('./validate-field');
const validateJWT = require('../middlewares/validate-jwt');
const validateRole = require('./validate-role');


module.exports = {
    ...validateField,
    ...validateJWT,
    ...validateRole
}