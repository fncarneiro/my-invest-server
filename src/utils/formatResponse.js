
export function user(user, request, msg) {
    return {
        msg: msg,
        user: {
            id_user: user.id_user,
            email: user.email,
            permission_level: user.permission_level,
            request: {
                type: request.type,
                description: request.description,
                url: process.env.HOST + ':' + process.env.PORT + '/api/users/' + user.email
            }
        }
    }
};

export function investment(investment, request, msg) {
    return {
        msg: msg,
        investment: {
            id_investment: investment.id_investment,
            email: user.email,
            permission_level: user.permission_level,
            request: {
                type: request.type,
                description: request.description,
                url: process.env.HOST + ':' + process.env.PORT + '/api/users/' + user.email
            }
        }
    }
};