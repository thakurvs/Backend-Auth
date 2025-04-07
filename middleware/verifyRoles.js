const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(req.roles);
        // req.roles = 5150;
        // console.log(req.roles);
        console.log('allowedRoles', ...allowedRoles);
        console.log('inside verifyroles');
        if(!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;

