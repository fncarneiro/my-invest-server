const moment = require('moment');
const conection = require('../infrastructure/conection');

class investment {
    createInvestment(investment, res) {

        const sql = 'INSERT INTO investments SET ?';
        const period = moment.utc(investment.period, 'YYYY-MM-DD hh:mm:ss', true).format('YYYY-MM-DD');
        const investmentOk = { ...investment, period };

        conection.query(sql, investmentOk, (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(201).json(investment)
            }
        })
    }

    updateInvestment(id, investment, res) {
        const sql = 'UPDATE investments SET ? where id_investment = ?';
        const period = moment.utc(investment.period, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');
        const investmentOk = { ...investment, period };

        conection.query(sql, [investmentOk, id], (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json({ id, ...investment })
            }
        })
    }

    listInvestment(res) {
        const sql = 'SELECT * FROM investments';
        conection.query(sql, (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(result)
            }
        })
    }

    searchForId(id, res) {
        const sql = 'SELECT * FROM investments WHERE id_investment= ?';
        conection.query(sql, id, (error, result) => {           
                if (error) {
                    res.status(400).json(error)
                } else {
                    res.status(200).json(result)
                }           
        })
    }

    deleteInvestment(id, res) {
        const sql = 'DELETE FROM investments where id_investment = ?';
        conection.query(sql, id, (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json({ id })
            }
        })
    }
}

module.exports = new investment;    