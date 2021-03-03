

const isAdmin = ( req, res, next ) => {

    const user = req.user;

    if ( !user ) {
        return res.status(500).json({ msg: 'Cant verify role, first verify token' });
    }

    if ( user.role !== 'ADMIN' ) {
        return res.status( 401 ).json({ msg: 'Not authorized for this action' });
    }

    next();
}

const haveRole = ( ...roles ) => {

    return ( req, res, next ) => {
        const user = req.user;
    
        if ( !roles.includes( user.role )) {
            
            return res.status(500).json({ 
                msg: `Required roles: ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    isAdmin,
    haveRole
}