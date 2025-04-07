const User = require('../model/User')
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message':'Username and Password are required' });

    const foundUser = await User.findOne({ username: user }).exec();    
    if(!foundUser) return res.sendStatus(401); //Unauthorized
    
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles).filter(Boolean);
        //create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        );

        const refreshToken = jwt.sign( 
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        //Saving refresh token with current user in DB
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        //sending tokens to client (httpCookie)
        //Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); //1 day
        // res.json({ accessToken }); //access token will be sent in the header for further use
        // res.json({ 'success': `User ${user} is logged in!`, accessToken, refreshToken });
        // res.json({ 'success': `User ${user} is logged in!` });
        res.json({ roles, accessToken }); // Send authorization roles and access token to user
    } else{
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };