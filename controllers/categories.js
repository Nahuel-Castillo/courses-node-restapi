
const { response, request } = require('express');
const { Category } = require('../models');

const getCategories = async( req = request, res = response ) => {

    const { page = 1, limit = 5 } = req.query;

    const query = { state: true };

    try {
        
        const [ total, categories ]  = await Promise.all([
            Category.countDocuments(  query ),
            Category.find( query ).populate('user', 'name')
                .skip( Number( page - 1 ) ).limit( Number( limit ) )
        ]); 
    
        res.json( { total, categories } );

    } catch (error) {
        res.status(500).json({ msg: 'Cant get categories' });
    }

}

const getCategoryById = async( req = request, res = response ) => {

    const { id } = req.params;

    try {
        
        const category = await Category.findById( id ).populate( 'user', 'name' ).populate('user', 'name');

        res.json( category );

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

const addCategory = async( req = request, res = response ) => {

    const name  = req.body.name.toUpperCase();

    try {
        const categoryDB = await Category.findOne( { name, state:false });

        if ( categoryDB ) {

            categoryDB.state = true;
            await categoryDB.save();

            return res.status(201).json( categoryDB );
        }
        
        const category = new Category( { name, user: req.user._id } );
    
        await category.save();
    
        res.status(201).json( category );

    } catch (error) {
        res.status(500).json( { msg: 'Cant add category' });
    }
}

const updateCategory = async( req = request, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    const name = data.name.toUpperCase();

    try {
        const category = await Category.findByIdAndUpdate( id, { name, ...data }, { new: true } ).populate('user', 'name');

        res.json( category );
    } catch (error) {
        res.status(500).json({ msg: 'Cant update category '});
    }

}

const deleteCategory = async( req = request, res = response ) => {

    const { id } = req.params;

    try {
        
        const category = await Category.findByIdAndUpdate( id, { state: false } ).populate('user', 'name');
    
        res.json( category );

    } catch (error) {
        res.status(500).json( { msg: 'Cant delete category ' } );
    }
}

module.exports = {
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
}