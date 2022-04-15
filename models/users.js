const pool = require('../infrastructure/connection');
const crypt = require('../utils/crypt');
const { userTypes } = require('../utils/constants');
const messages = { userAlreadyExist, userNotAlowed, userNotFound } = require('../utils/messages');

async function findUser(email) {
    const sqlSearch = 'SELECT id_user, email, permission_level, password FROM users WHERE email = ?';
    const resultList = await pool.execQuery(sqlSearch, email);
    return resultList.length > 0 ?
        {
            id: resultList[0].id_user,
            email: resultList[0].email,
            permissionLevel: resultList[0].permission_level,
            password: resultList[0].password
        }
        : false;
};

function formatUserResponse(user, request, msg) {
    return {
        msg: msg,
        user: {
            id_user: user.id || user.id_user,
            email: user.email,
            permission_level: user.permissionLevel || user.permission_level,
            request: {
                type: request.type,
                description: request.description,
                url: process.env.HOST + ':' + process.env.PORT + '/api/users/' + user.email
            }
        }
    }
};


module.exports = {

    async createUser(user, res) {
        const sqlInsert = 'INSERT INTO users (email, password, permission_level) VALUES (?, ?, ?)';

        try {
            const userFounded = await findUser(user.email);
            if (userFounded) {
                return res.status(409).json({ msg: messages.userAlreadyExist, email: user.email })
            } else {
                const resultCrypt = await crypt.encrypt(user.password);

                if (!resultCrypt) {
                    return res.status(500).json(resultCrypt)
                } else {
                    const permissionLevel = process.env.ADMIN_USER === user.email ? userTypes.ADMIN : userTypes.USER;
                    const resultInsert = await pool.execQuery(sqlInsert, [user.email, resultCrypt, permissionLevel])

                    const userResponse = { ...user, permissionLevel, id: resultInsert.insertId };
                    const request = { type: 'POST', description: 'Insert a user.' }

                    const response = formatUserResponse(userResponse, request, messages.userCreated);

                    return res.status(201).json(response);
                }
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async updateUser(user, res) {
        const sqlUpdate = 'UPDATE users SET password = ? WHERE email = ?';

        async function doCrypt(password) {
            const crypted = await crypt.encrypt(password);
            if (!crypted) {
                return res.status(500).json(crypted);
            } else {
                return crypted;
            }
        }

        try {
            const userFounded = await findUser(user.email);
            if (!userFounded) {
                return res.status(409).json({ msg: messages.userNotFound, email: user.email })
            } else {
                if (await crypt.compare(user.password, userFounded.password)) {
                    const resultCryptNewPassword = await doCrypt(user.new_password);

                    const resultUpdate = await pool.execQuery(sqlUpdate, [resultCryptNewPassword, user.email]);

                    const request = { type: 'PUT', description: 'Update user password.' }
                    const response = formatUserResponse(userFounded, request, messages.userPasswordUpdated);

                    return res.status(202).json(response);
                } else {
                    return res.status(409).json({ msg: 'Invalid password.', email: user.email })
                }
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    },


    async listUsers(res) {
        const sqlList = 'SELECT id_user, email, password, permission_level FROM users';
        try {
            const resultList = await pool.execQuery(sqlList);

            const request = { type: 'GET', description: 'List all users.' };

            const response = {
                records: resultList.length,
                users: resultList.map(user => {
                    return formatUserResponse(user, request);
                })
            }
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async getUser(email, res) {
        try {
            const userFounded = await findUser(email);

            if (!userFounded) {
                res.status(404).json({ msg: messages.userNotFound, email: email })
            } else {
                const request = { type: 'GET', description: 'Get a specific user.' };
                const response = formatUserResponse(userFounded, request);

                return res.status(200).json(response);
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async deleteUser(email, permissionLevel, res) {
        const sqlDelete = 'DELETE FROM users where email = ?';

        try {
            if (permissionLevel === userTypes.ADMIN) {
                const userFounded = await findUser(email);

                if (!userFounded) {
                    res.status(404).json({ msg: messages.userNotFound, email: email })
                } else {
                    const resultDelete = await pool.execQuery(sqlDelete, email);

                    const request = { type: 'DELETE', description: 'Delete a specific user.' };
                    const response = formatUserResponse(userFounded, request, messages.userDeleted);

                    res.status(200).json(response);
                }
            } else {
                return res.status(401).json({ msg: messages.userNotAlowed });
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}