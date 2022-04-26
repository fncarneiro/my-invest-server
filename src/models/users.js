import * as crypt from '../utils/crypt.js';
import { userTypes } from '../utils/constants.js';
import {
    userAlreadyExist,
    userNotAlowed,
    userNotFound,
    userCreated,
    userDeleted,
    userPasswordUpdated
} from '../utils/messages.js';
import * as formatResponse from '../utils/formatResponse.js';
import connection from '../database/connection.js';

async function doCrypt(password) {
    const cryptPassword = await crypt.encrypt(password);
    if (!cryptPassword) {
        return res.status(500).json(cryptPassword);
    } else {
        return cryptPassword;
    }
};

export async function createUser(user, res) {
    try {
        const userFounded = await connection.users.findUnique({ where: { email: user.email } });

        if (userFounded) {
            return res.status(409).json({ msg: userAlreadyExist, email: user.email })
        } else {
            const resultCrypt = await doCrypt(user.password);
            const permissionLevel = process.env.ADMIN_USER === user.email ? userTypes.ADMIN : userTypes.USER;
            const resultInsert = await connection.users.create({
                data: {
                    email: user.email,
                    password: resultCrypt,
                    permission_level: permissionLevel,
                }
            })

            const userResponse = { ...resultInsert };
            const request = { type: 'POST', description: 'Insert a user.' };

            const response = formatResponse.user(userResponse, request, userCreated);

            return res.status(201).json(response);
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};

export async function updateUser(user, res) {
    try {
        const userFounded = await connection.users.findUnique({ where: { email: user.email } })
        if (!userFounded) {
            return res.status(409).json({ msg: userNotFound, email: user.email })
        } else {
            if (await crypt.compare(user.password, userFounded.password)) {
                const resultCryptNewPassword = await doCrypt(user.new_password);
                const resultUpdate = connection.users.update({
                    where: { email: userFounded.email },
                    data: { password: resultCryptNewPassword }
                })

                const request = { type: 'PUT', description: 'Update user password.' };
                const response = formatResponse.user(userFounded, request, userPasswordUpdated);

                return res.status(202).json(response);
            } else {
                return res.status(409).json({ msg: 'Invalid password.', email: user.email })
            }
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};

export async function listUsers(res) {
    try {
        const resultList = await connection.users.findMany({ orderBy: { email: 'asc' } });

        const request = { type: 'GET', description: 'List all users.' };
        const response = {
            records: resultList.length,
            users: resultList.map(user => {
                return formatResponse.user(user, request);
            })
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export async function getUser(email, res) {
    try {
        const userFounded = await connection.users.findUnique({ where: { email: email } });

        if (!userFounded) {
            res.status(404).json({ msg: userNotFound, email: email })
        } else {
            const request = { type: 'GET', description: 'Get a specific user.' };
            const response = formatResponse.user(userFounded, request);

            return res.status(200).json(response);
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};

export async function deleteUser(email, permissionLevel, res) {
    try {
        if (permissionLevel === userTypes.ADMIN) {
            const userFounded = await connection.users.findUnique({ where: { email: email } })

            if (!userFounded) {
                res.status(404).json({ msg: userNotFound, email: email })
            } else {
                const resultDelete = await connection.users.delete({ where: { email: userFounded.email } });
                const request = { type: 'DELETE', description: 'Delete a specific user.' };
                const response = formatResponse.user(resultDelete, request, userDeleted);

                res.status(200).json(response);
            }
        } else {
            return res.status(401).json({ msg: userNotAlowed });
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};