const userDB = {
    users : require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message':'Username and Password are required' });

    const foundUser = userDB.users.find(person => person.username === user);
    if(!foundUser) return res.sendStatus(401); //Unauthorized
    
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        //create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign
        ( { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //Saving refresh token with current user
        const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        userDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        );
        //sending tokens to client 
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); //1 day
        res.json({ accessToken }); //access token will be sent in the header
        // res.json({ 'success': `User ${user} is logged in!` });
        // res.json({ 'success': `User ${user} is logged in!`, accessToken });
        // res.json({ 'success': `User ${user} is logged in!`, accessToken, refreshToken });

        res.json({ 'success': `User ${user} is logged in!` });
    } else{
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };