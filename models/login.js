const pool = require('../infrastructure/conection');
const crypt = require('../utils/crypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (user, res) => {
    try {
        const sqlSearch = 'SELECT email, password FROM users WHERE email = ?';
        const resultSearch = await pool.execQuery(sqlSearch, user.email);
        
        if (resultSearch.length == 0) {
            return res.status(401).json({ msg: 'Authentication failed.' })
        } else {
            const resultCrypt = await crypt.compare(user.password, resultSearch[0].password);
            
            if (!resultCrypt) {
                return res.status(401).json({ msg: 'Authentication failed.' })
            } else {
                const token = jwt.sign(
                    { id_user: resultSearch[0].id_user, email: resultSearch[0].email },
                    process.env.JWT_KEY,
                    { expiresIn: process.env.JWT_EXPIRES }
                );
                return res.status(200).json({ msg: 'Authentication success.', token: token })
            }
        }
    } catch (error) {
        return res.status(400).json(error);
    }
}