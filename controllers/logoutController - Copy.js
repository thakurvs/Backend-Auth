const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete the access token
    // So client will no longer have it
    // and will be forced to log in again
 
    // Get refreshToken from cookies
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    // Is refreshToken in db?
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        // Token no longer in db 
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure:true on https
        return res.sendStatus(204); // No content
    }

    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' }
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure:true on https
    res.sendStatus(204); // No content
}

module.exports = { handleLogout }