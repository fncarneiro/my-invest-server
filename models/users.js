const conection = require('../infrastructure/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class user {
    createUser(user, res) {
        const sqlInsert = 'INSERT INTO users (email, password) VALUES (?, ?)';
        const sqlSearch = 'SELECT * FROM users WHERE email = ?';

        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, user.email, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length > 0) {
                        res.status(409).json({ msg: 'Email already exists.', email: user.email })
                    } else {
                        bcrypt.hash(user.password, 10, (errBcrypt, hash) => {
                            if (errBcrypt) { res.status(500).json({ error: errBcrypt }) }

                            conection.query(sqlInsert, [user.email, hash], (error, result) => {
                                if (error) {
                                    res.status(400).json(error)
                                } else {
                                    const response = {
                                        msg: 'User created.',
                                        id_user: result.insertId,
                                        email: user.email,
                                        request: {
                                            type: 'POST',
                                            description: 'Insert a user.',
                                            url: process.env.API_HOST + ':' + process.env.API_PORT + '/users/' + result.insertId
                                        }
                                    }
                                    res.status(201).json(response);
                                }

                            });
                        });
                    }
                }
            });
            conn.release();
        });
    }

    updateUser(id, user, res) {
        const sqlUpdate = 'UPDATE users SET password = ? WHERE id_user = ?';
        const sqlSearch = 'SELECT * FROM users WHERE id_user = ?';

        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, id, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length == 0) {
                        res.status(409).json({ msg: 'Id not found.', id_user: id })
                    } else {
                        bcrypt.hash(user.password, 10, (errBcrypt, hash) => {
                            if (errBcrypt) { res.status(500).json({ error: errBcrypt }) }

                            conection.query(sqlUpdate, [hash, id], (error, result) => {
                                if (error) {
                                    res.status(400).json(error)
                                } else {
                                    const response = {
                                        msg: 'User password updated.',
                                        id_user: id,
                                        email: user.email,
                                        request: {
                                            type: 'POST',
                                            description: 'Update a specific user.',
                                            url: process.env.API_HOST + ':' + process.env.API_PORT + '/users/' + id
                                        }
                                    }
                                    res.status(201).json(response);
                                }

                            });
                        });
                    }
                }
            });
            conn.release();
        });
    }

    listUsers(res) {
        const sqlList = 'SELECT * FROM users';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlList, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    const response = {
                        records: result.length,
                        users: result.map(user => {
                            return {
                                id_user: user.id_user,
                                email: user.email,
                                password: user.password,
                                request: {
                                    type: 'GET',
                                    description: 'List all users.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/users/' + user.id_user
                                }
                            }
                        })
                    }
                    res.status(200).json(response);
                }
            });
            conn.release();
        });
    }

    searchForId(id, res) {
        const sqlSearch = `SELECT * FROM users WHERE id_user = ?`;
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, id, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length == 0) {
                        res.status(404).json({ msg: 'Id not found', id_stocks: id })
                    } else {
                        console.log(result)
                        const response = {
                            records: result.length,
                            user: {
                                id_user: result[0].id_user,
                                email: result[0].email,
                                password: result[0].password,
                                request: {
                                    type: 'GET',
                                    description: 'List a specific user.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/users/' + id
                                }
                            }
                        }
                        res.status(200).json(response);
                    }
                }
            });
            conn.release();
        });
    }

    deleteUser(id, res) {
        const sqlDelete = 'DELETE FROM users where id_user = ?';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlDelete, id, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.affectedRows == 0) {
                        res.status(409).json({ msg: 'Id not found.', id_stocks: id })
                    } else {
                        const response = {
                            msg: 'User deleted',
                            stock: {
                                id_user: id,
                                request: {
                                    type: 'DELETE',
                                    description: 'Delete a specific user.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/users/'
                                }
                            }
                        }
                        res.status(202).json(response);
                    }
                }
            });
            conn.release();
        });
    }

    loginUser(user, res) {
        const sqlSearch = 'SELECT * FROM users WHERE email = ?';

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
                                        expiresIn: '1h'
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

module.exports = new user;    