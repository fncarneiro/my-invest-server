const moment = require('moment');
const conection = require('../infrastructure/conection');

class investment {
    createInvestment(investment, res) {
        const sqlInsert = 'INSERT INTO investments SET ?';
        const sqlSearch = 'SELECT * FROM investments WHERE period = ?';
        const period = moment.utc(investment.period, 'YYYY-MM-DD hh:mm:ss', true).format('YYYY-MM-DD');

        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, period, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length > 0) {
                        res.status(409).json({ msg: 'Period already exists.', period: period })
                    } else {
                        const investmentOk = { ...investment, period };
                        conn.query(sqlInsert, investmentOk, (error, result) => {
                            if (error) {
                                res.status(400).json(error)
                            } else {
                                const response = {
                                    msg: 'Investment created.',
                                    investment: {
                                        id_investment: result.insertId,
                                        period: investmentOk.period,
                                        request: {
                                            type: 'POST',
                                            description: 'Insert a investment.',
                                            url: process.env.API_HOST + ':' + process.env.API_PORT + '/investments/' + result.insertId
                                        }
                                    }
                                }
                                res.status(201).json(response);
                            }
                        });
                    }
                }
            });
            conn.release();
        });
    }

    updateInvestment(id, investment, res) {
        const sqlUpdate = 'UPDATE investments SET ? where id_investment = ?';
        const sqlSearch = 'SELECT * FROM investments WHERE period = ?';
        const period = moment.utc(investment.period, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');

        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, period, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length > 0) {
                        res.status(409).json({ msg: 'Period already exists.', period: period })
                    } else {
                        const investmentOk = { ...investment, period };
                        conn.query(sqlUpdate, [investmentOk, id], (error, result) => {
                            if (error) {
                                res.status(400).json(error)
                            } else {
                                if (result.affectedRows == 0) {
                                    res.status(409).json({ msg: 'Id not found.', id_investment: id })
                                } else {
                                    const response = {
                                        msg: 'Investment updated.',
                                        investment: {
                                            id_investment: id,
                                            period: investmentOk.period,
                                            request: {
                                                type: 'PUT',
                                                description: 'Update a specific investment.',
                                                url: process.env.API_HOST + ':' + process.env.API_PORT + '/investments/' + id
                                            }
                                        }
                                    }
                                    res.status(202).json(response);
                                }
                            }
                        });
                    }
                }
            });
            conn.release();
        });
    }

    listInvestment(res) {
        const sqlList = 'SELECT * FROM investments order by id_investment';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlList, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    const response = {
                        records: result.length,
                        investments: result.map(investment => {
                            return {
                                id_investment: investment.id_investment,
                                period: investment.period,
                                request: {
                                    type: 'GET',
                                    description: 'List all investments.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/investments/' + investment.id_investment
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
        const sqlSearch = 'SELECT * FROM investments WHERE id_investment= ?';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, id, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length == 0) {
                        res.status(404).json({ msg: 'Id not found', id_investment: id })
                    } else {
                        const response = {
                            records: result.length,
                            investment: {
                                id_investment: id,
                                period: result[0].period,
                                request: {
                                    type: 'GET',
                                    description: 'List a specific investment.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/investments/' + id
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

    deleteInvestment(id, res) {
        const sqlDelete = 'DELETE FROM investments where id_investment = ?';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlDelete, id, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.affectedRows == 0) {
                        res.status(409).json({ msg: 'Id not found.', id_investment: id })
                    } else {
                        const response = {
                            msg: 'Investment deleted',
                            investment: {
                                id_investment: id,
                                request: {
                                    type: 'DELETE',
                                    description: 'Delete a specific investment.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/investments/'
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
}

module.exports = new investment;    