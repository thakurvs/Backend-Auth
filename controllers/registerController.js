const User = require('../model/User')
const bcrypt  = require('bcryptjs');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message':'Username and Password are required' });

    //check for duplicate username in DB
    const duplicate = await User.findOne({ username: user }).exec();
    if(duplicate) return res.sendStatus(409); //Conflict
 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); //salt rounds

        //create and store the new user in mongoDB
        const newUser = await User.create({
            "username" : user,
            "password": hashedPwd
        });
        console.log(newUser);
        res.status(201).json({ success: `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {handleNewUser};