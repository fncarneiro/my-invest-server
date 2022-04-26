import { formatDateYYYYMMDD } from "./util.js";

export function user(user, request, msg) {
    const formatedCreateAt = formatDateYYYYMMDD(user.create_at);
    return {
        msg: msg,
        user: {
            id_user: user.id_user,
            email: user.email,
            permission_level: user.permission_level,
            create_at: formatedCreateAt,
            request: {
                type: request.type,
                description: request.description,
                url: process.env.HOST + ':' + process.env.PORT + '/api/users/' + user.email
            }
        }
    }
};

export function investment(investment, request, msg) {
    const formatedPeriod = formatDateYYYYMMDD(investment.period);
    return {
        msg: msg,
        investment: {
            id_investment: investment.id_investment,
            period: formatedPeriod,
            id_user: investment.id_user,
            request: {
                type: request.type,
                description: request.description,
                url: process.env.HOST + ':' + process.env.PORT + '/api/investments/' + investment.id_investment
            }
        }
    }
};