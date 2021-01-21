const moment = require('moment');
const pool = require('../infrastructure/conection');

module.exports = {
    async createInvestment(investment, res) {
        const sqlInsert = 'INSERT INTO investments SET ?';
        const sqlSearch = 'SELECT id_investment, period FROM investments WHERE period = ?';
        const period = moment.utc(investment.period, 'YYYY-MM-DD hh:mm:ss', true).format('YYYY-MM-DD');

        try {
            const resultSearch = await pool.execQuery(sqlSearch, period);

            if (resultSearch.length > 0) {
                return res.status(409).json({ msg: 'Period already exists.', period: period });
            } else {
                const investmentOk = { ...investment, period };
                const resultInsert = await pool.execQuery(sqlInsert, investmentOk);

                const response = {
                    msg: 'Investment created.',
                    investment: {
                        id_investment: resultInsert.insertId,
                        period: investmentOk.period,
                        request: {
                            type: 'POST',
                            description: 'Insert a investment.',
                            url: process.env.HOST + ':' + process.env.PORT + '/investments/' + resultInsert.insertId
                        }
                    }
                }
                return res.status(201).json(response);
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    async updateInvestment(id, investment, res) {
        const sqlUpdate = 'UPDATE investments SET ? where id_investment = ?';
        const sqlSearch = 'SELECT id_investment, period FROM investments WHERE period = ?';
        const period = moment.utc(investment.period, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');
        try {
            const resultSearch = await pool.execQuery(sqlSearch, period);

            if (resultSearch.length > 0) {
                return res.status(409).json({ msg: 'Period already exists.', period: period })
            } else {
                const investmentOk = { ...investment, period };
                const resultUpdate = await pool.execQuery(sqlUpdate, [investmentOk, id]);

                if (resultUpdate.affectedRows == 0) {
                    return res.status(409).json({ msg: 'Id not found.', id_investment: id })
                } else {
                    const response = {
                        msg: 'Investment updated.',
                        investment: {
                            id_investment: id,
                            period: investmentOk.period,
                            request: {
                                type: 'PUT',
                                description: 'Update a specific investment.',
                                url: process.env.HOST + ':' + process.env.PORT + '/investments/' + id
                            }
                        }
                    }
                    res.status(202).json(response);
                }
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    async listInvestment(res) {
        try {
            const sqlList = 'SELECT id_investment, period FROM investments order by period';

            const resultList = await pool.execQuery(sqlList);

            const response = {
                records: resultList.length,
                investments: resultList.map(investment => {
                    return {
                        id_investment: investment.id_investment,
                        period: investment.period,
                        request: {
                            type: 'GET',
                            description: 'List all investments.',
                            url: process.env.HOST + ':' + process.env.PORT + '/investments/' + investment.id_investment
                        }
                    }
                })
            }
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    async getInvestment(id, res) {
        try {
            const sqlSearch = 'SELECT id_investment, period FROM investments WHERE id_investment = ?';

            const resultSearch = await pool.execQuery(sqlSearch, id);

            if (resultSearch.length == 0) {
                return res.status(404).json({ msg: 'Id not found', id_investment: id })
            } else {
                const response = {
                    records: resultSearch.length,
                    investment: {
                        id_investment: id,
                        period: resultSearch[0].period,
                        request: {
                            type: 'GET',
                            description: 'List a specific investment.',
                            url: process.env.HOST + ':' + process.env.PORT + '/investments/' + id
                        }
                    }
                }
                return res.status(200).json(response);
            }
        }
        catch (error) {
            return res.status(400).json(error)
        }
    },

    async deleteInvestment(id, res) {
        try {
            const sqlDelete = 'DELETE FROM investments where id_investment = ?';

            const resultDelete = await pool.execQuery(sqlDelete, id);

            if (resultDelete.affectedRows == 0) {
                return res.status(409).json({ msg: 'Id not found.', id_investment: id })
            } else {
                const response = {
                    msg: 'Investment deleted',
                    investment: {
                        id_investment: id,
                        request: {
                            type: 'DELETE',
                            description: 'Delete a specific investment.',
                            url: process.env.HOST + ':' + process.env.PORT + '/investments/'
                        }
                    }
                }
                return res.status(202).json(response);
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}  