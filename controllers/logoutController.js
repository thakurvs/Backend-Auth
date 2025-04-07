const User = require('../model/User')

const handleLogout = async (req, res) => {
    // On client, also delete the access token
    // So client will no longer have it
    // and will be forced to log in again
 
    // Get refreshToken from cookies
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    // Is refreshToken in db?
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        // Token no longer in db 
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure:true on https
        return res.sendStatus(204); // No content
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure:true on https
    // res.sendStatus(204); // No content
    res.status(204).json({ success: `user logged out successfully!` });
}

module.exports = { handleLogout }