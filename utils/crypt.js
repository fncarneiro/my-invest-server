const bcrypt = require('bcrypt');

module.exports = {

    encrypt(value) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(value, 10, (errBcrypt, hash) => {
                if (errBcrypt) {
                    reject(errBcrypt)                    
                } else {
                    resolve(hash)
                }
            })
        })
    },

    compare(value1, value2) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(value1, value2, (errBcrypt, resultBcrypt) => {
                if (errBcrypt) {
                    reject(errBcrypt)
                } else {                    
                    resolve(resultBcrypt)
                }
            });
        });
    }
}