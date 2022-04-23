import jwt from 'jsonwebtoken';
import * as crypt from '../utils/crypt.js';
import { loginSuccess, loginFailed } from '../utils/messages.js';
import connection from '../database/connection.js';

const signin = async (user, res) => {
    try {
        const userFounded = await connection.users.findUnique({ where: { email: user.email } });

        if (!userFounded) {
            return res.status(401).json({ msg: loginFailed })
        } else {
            const resultCrypt = await crypt.compare(user.password, userFounded.password);

            if (!resultCrypt) {
                return res.status(401).json({ msg: loginFailed })
            } else {
                const token = jwt.sign(
                    {
                        id_user: userFounded.id_user,
                        email: userFounded.email,
                        permission_level: userFounded.permission_level
                    },
                    process.env.JWT_KEY,
                    { expiresIn: process.env.JWT_EXPIRES }
                );
                return res.status(200).json({ msg: loginSuccess, token: token })
            }
        }
    } catch (error) {
        return res.status(400).json(error);
    }
}

export default signin;