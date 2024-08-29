const bcrypt = require("bcrypt");

async function hashPass(password) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        throw err;
    }
}

async function comparePass(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (isMatch) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw err;
    }
}

module.exports.hashPass = hashPass; 
module.exports.comparePass = comparePass; 
