const pool = require('../infrastructure/conection');

module.exports = {
    async createStock(stock, res) {
        const sqlInsert = 'INSERT INTO stocks SET ?';
        const sqlSearch = 'SELECT id_investment FROM investments WHERE id_investment = ?';

        try {
            const resultSearch = await pool.execQuery(sqlSearch, stock.id_investment);

            if (resultSearch.length == 0) {
                return res.status(409).json({ msg: 'Investment not found.', id_investment: stock.id_investment })
            } else {
                const resultInsert = await pool.execQuery(sqlInsert, stock);

                const response = {
                    msg: 'Stock created.',
                    stock: {
                        id_stock: resultInsert.insertId,
                        id_investment: stock.id_investment,
                        stock_name: stock.stock_name,
                        by_amount: stock.by_amount,
                        by_price: stock.by_price,
                        by_tax: stock.by_tax,
                        target_profit: stock.target_profit,
                        sell_profit: stock.sell_profit,
                        sell_amount: stock.sell_amount,
                        sell_tax: stock.sell_tax,
                        note: stock.note,
                        request: {
                            type: 'POST',
                            description: 'Insert a stock.',
                            url: process.env.HOST + ':' + process.env.PORT + '/stocks/' + resultInsert.insertId
                        }
                    }
                }
                return res.status(201).json(response);
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    async updateStock(id, stock, res) {
        const sqlUpdate = 'UPDATE stocks SET ? where id_stock = ?';

        try {
            const resultUpdate = await pool.execQuery(sqlUpdate, [stock, id]);

            if (resultUpdate.affectedRows == 0) {
                return res.status(409).json({ msg: 'Id not found.', id_stocks: id })
            } else {
                const response = {
                    msg: 'Stock updated.',
                    stock: {
                        id_stock: id,
                        id_investment: stock.id_investment,
                        stock_name: stock.stock_name,
                        by_amount: stock.by_amount,
                        by_price: stock.by_price,
                        by_tax: stock.by_tax,
                        target_profit: stock.target_profit,
                        sell_profit: stock.sellprofit,
                        sell_amount: stock.sell_amount,
                        sell_tax: stock.sell_tax,
                        note: stock.note,
                        request: {
                            type: 'PUT',
                            description: 'Update a specific stock.',
                            url: process.env.HOST + ':' + process.env.PORT + '/stocks/' + id
                        }
                    }
                }
                return res.status(202).json(response);
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    async listStocks(res) {
        const sqlList = 'SELECT * FROM stocks order by stock_name';
        try {
            const resultList = await pool.execQuery(sqlList);

            const response = {
                records: resultList.length,
                stocks: resultList.map(stock => {
                    return {
                        id_stock: stock.id_stock,
                        id_investment: stock.id_investment,
                        stock_name: stock.stock_name,
                        by_amount: stock.by_amount,
                        by_price: stock.by_price,
                        by_tax: stock.by_tax,
                        target_profit: stock.target_profit,
                        sell_profit: stock.sellprofit,
                        sell_amount: stock.sell_amount,
                        sell_tax: stock.sell_tax,
                        note: stock.note,
                        request: {
                            type: 'GET',
                            description: 'List all stocks.',
                            url: process.env.HOST + ':' + process.env.PORT + '/stocks/' + stock.id_stock
                        }
                    }
                })
            }
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    async getStock(id, res) {
        const sqlSearch = 'SELECT * FROM stocks WHERE id_stock = ?';
        try {
            const resultSearch = await pool.execQuery(sqlSearch, id);

            if (resultSearch.length == 0) {
                return res.status(404).json({ msg: 'Id not found', id_stocks: id })
            } else {
                const response = {
                    records: resultSearch.length,
                    stock: {
                        id_stock: resultSearch[0].id_stock,
                        id_investment: resultSearch[0].id_investment,
                        stock_name: resultSearch[0].stock_name,
                        by_amount: resultSearch[0].by_amount,
                        by_price: resultSearch[0].by_price,
                        by_tax: resultSearch[0].by_tax,
                        target_profit: resultSearch[0].target_profit,
                        sell_profit: resultSearch[0].sellprofit,
                        sell_amount: resultSearch[0].sell_amount,
                        sell_tax: resultSearch[0].sell_tax,
                        note: resultSearch[0].note,
                        request: {
                            type: 'GET',
                            description: 'List a specific stock.',
                            url: process.env.HOST + ':' + process.env.PORT + '/stocks/' + id
                        }
                    }
                }
                return res.status(200).json(response);
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    async deleteStock(id, res) {
        const sqlDelete = 'DELETE FROM stocks where id_stock = ?';
        try {
            const resultDelete = await pool.execQuery(sqlDelete, id);

            if (resultDelete.affectedRows == 0) {
                return res.status(409).json({ msg: 'Id not found.', id_stocks: id })
            } else {
                const response = {
                    msg: 'Stock deleted',
                    stock: {
                        id_stocks: id,
                        request: {
                            type: 'DELETE',
                            description: 'Delete a specific stock.',
                            url: process.env.HOST + ':' + process.env.PORT + '/stocks/'
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