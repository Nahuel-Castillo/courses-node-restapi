const { response, request } = require('express');

const getUser = ( req = request, res = response ) => {

    const params = req.query;

    res.json({
        mjs: 'get User',
        params
    });
}

const postUser = ( req, res = response ) => {

    const { body } = req;

    res.json({
        mjs: 'post User',
        body
    });
}

const putUser = ( req, res = response ) => {

    const { id } = req.params;

    res.json({
        mjs: 'put User',
    });
}

const patchUser = ( req, res = response ) => {

    res.json({
        mjs: 'patch User'
    });
}

const deleteUser = ( req, res = response ) => {

    res.json({
        mjs: 'delete User'
    });
}

module.exports = {
    getUser,
    postUser,
    putUser,
    patchUser,
    deleteUser
}