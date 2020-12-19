const conection = require('../infrastructure/conection');

class investment {
    createInvestment(investment){
        const sql = 'INSERT INTO investments SET ?';

        conection.query(sql, investment, (erro, results) => {
            if(erro){
                console.log(erro)
            }else {
                console.log(results)
            }
        })
    }
}

module.exports = new investment;