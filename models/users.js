const pool = require('../infrastructure/conection');
const crypt = require('../utils/crypt');

module.exports = {
    async createUser(user, res) {
        const sqlInsert = 'INSERT INTO users (email, password) VALUES (?, ?)';
        const sqlSearch = 'SELECT id_user, email, password FROM users WHERE email = ?';

        try {
            const resultList = await pool.execQuery(sqlSearch, user.email);

            if (resultList.length > 0) {
                return res.status(409).json({ msg: 'Email already exists.', email: user.email })
            } else {
                const resultCrypt = await crypt.encrypt(user.password);

                if (!resultCrypt) {
                    return res.status(500).json(resultCrypt)
                } else {
                    const resultInsert = await pool.execQuery(sqlInsert, [user.email, resultCrypt]);

                    const response = {
                        msg: 'User created.',
                        user: {
                            id_user: resultInsert.insertId,
                            email: user.email,
                            request: {
                                type: 'POST',
                                description: 'Insert a user.',
                                url: process.env.HOST + ':' + process.env.PORT + '/users/'
                            }
                        }
                    }
                    return res.status(201).json(response);
                }
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async updateUser(user, res) {
        const sqlUpdate = 'UPDATE users SET password = ? WHERE email = ?';
        const sqlSearch = 'SELECT id_user, email, password FROM users WHERE email = ?';

        try {
            const resultList = await pool.execQuery(sqlSearch, user.email);

            if (resultList.length == 0) {
                return res.status(409).json({ msg: 'Email not found.', email: user.email })
            } else {
                const resultCrypt = await crypt.encrypt(user.password);

                if (!resultCrypt) {
                    return res.status(500).json(resultCrypt)
                } else {
                    const resultUpdate = await pool.execQuery(sqlUpdate, [resultCrypt, user.email]);

                    const response = {
                        msg: 'User password updated.',
                        user: {
                            id_user: resultList[0].id_user,
                            email: resultList[0].email,
                            request: {
                                type: 'PUT',
                                description: 'Update user password.',
                                url: process.env.HOST + ':' + process.env.PORT + '/users/'
                            }
                        }
                    }
                    return res.status(201).json(response);
                }
            }
        } catch (erro) {
            return res.status(400).json(error);
        }
    },


    async listUsers(res) {
        const sqlList = 'SELECT id_user, email, password FROM users';
        try {
            const resultList = await pool.execQuery(sqlList);
            const response = {
                records: resultList.length,
                users: resultList.map(user => {
                    return {
                        user: {
                            id_user: user.id_user,
                            email: user.email,
                            request: {
                                type: 'GET',
                                description: 'List all users.',
                                url: process.env.HOST + ':' + process.env.PORT + '/users/'
                            }
                        }
                    }
                })
            }
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async getUser(email, res) {
        const sqlSearch = 'SELECT id_user, email, password FROM users WHERE email = ?';

        try {
            const resultList = await pool.execQuery(sqlSearch, email);

            if (resultList.length == 0) {
                res.status(404).json({ msg: 'Email not found', email: email })
            } else {
                const response = {
                    records: resultList.length,
                    user: {
                        id_user: resultList[0].id_user,
                        email: resultList[0].email,
                        request: {
                            type: 'GET',
                            description: 'List a specific user.',
                            url: process.env.HOST + ':' + process.env.PORT + '/users/' + email
                        }
                    }
                }
                res.status(200).json(response);
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async deleteUser(email, res) {
        const sqlDelete = 'DELETE FROM users where email = ?';

        try {
            const resultDelete = await pool.execQuery(sqlDelete, email);

            if (resultDelete.affectedRows == 0) {
                res.status(409).json({ msg: 'Email not found.', email: email })
            } else {
                const response = {
                    msg: 'User deleted',
                    user: {
                        email: email,
                        request: {
                            type: 'DELETE',
                            description: 'Delete a specific user.',
                            url: process.env.HOST + ':' + process.env.PORT + '/users/'
                        }
                    }
                }
                res.status(202).json(response);
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}