const conection = require('../infrastructure/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class login {

    loginUser(user, res) {
        const sqlSearch = 'SELECT email, password FROM users WHERE email = ?';

        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, user.email, (error, result) => {
                
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length == 0) {
                        res.status(401).json({ msg: 'Authentication failed.' })
                    } else {
                        bcrypt.compare(user.password, result[0].password, (errBcrypt, resultBcrypt) => {
                            if (errBcrypt) { res.status(401).json({ msg: 'Authentication failed.' }) }

                            if (resultBcrypt) {
                                const token = jwt.sign({
                                    id_user: result[0].id_user,
                                    email: result[0].email
                                },
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn: process.env.JWT_EXPIRES
                                    });
                                res.status(200).json({
                                    msg: 'Authentication success.',
                                    token: token
                                })
                            } else {
                                res.status(401).json({ msg: 'Authentication failed.' })
                            }
                        });
                    }
                }
            });
            conn.release();
        });
    }
}

module.exports = new login; 