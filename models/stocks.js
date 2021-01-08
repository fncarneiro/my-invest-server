const conection = require('../infrastructure/conection');

class stock {
    createStock(stock, res) {
        const sqlInsert = 'INSERT INTO stocks SET ?';
        const sqlSearch = 'SELECT * FROM stocks WHERE id_investment = ?';

        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, stock.id_investment, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length == 0) {
                        res.status(409).json({ msg: 'Investment not found.', id_investment: stock.id_investment })
                    } else {
                        conn.query(sqlInsert, stock, (error, result) => {
                            if (error) {
                                res.status(400).json(error)
                            } else {
                                const response = {
                                    msg: 'Stock created.',
                                    stock: {
                                        id_stock: result.insertId,
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
                                            type: 'POST',
                                            description: 'Insert a stock.',
                                            url: process.env.API_HOST + ':' + process.env.API_PORT + '/stocks/' + result.insertId
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

    updateStock(id, stock, res) {
        const sqlUpdate = 'UPDATE stocks SET ? where id_stocks = ?';

        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlUpdate, [stock, id], (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.affectedRows == 0) {
                        res.status(409).json({ msg: 'Id not found.', id_stocks: id })
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
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/stocks/' + id
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

    listStocks(res) {
        const sqlList = 'SELECT * FROM stocks order by id_stocks';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlList, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    const response = {
                        records: result.length,
                        stocks: result.map(stock => {
                            return {
                                id_stock: stock.id_stocks,
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
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/stocks/' + stock.id_stocks
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
        const sqlSearch = 'SELECT * FROM stocks WHERE id_stocks= ?';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlSearch, id, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.length == 0) {
                        res.status(404).json({ msg: 'Id not found', id_stocks: id })
                    } else {
                        const response = {
                            records: result.length,
                            stock: {
                                id_stock: result[0].id_stocks,
                                id_investment: result[0].id_investment,
                                stock_name: result[0].stock_name,
                                by_amount: result[0].by_amount,
                                by_price: result[0].by_price,
                                by_tax: result[0].by_tax,
                                target_profit: result[0].target_profit,
                                sell_profit: result[0].sellprofit,
                                sell_amount: result[0].sell_amount,
                                sell_tax: result[0].sell_tax,
                                note: result[0].note,
                                request: {
                                    type: 'GET',
                                    description: 'List a specific stock.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/stocks/' + id
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

    deleteStock(id, res) {
        const sqlDelete = 'DELETE FROM stocks where id_stocks = ?';
        conection.getConnection((error, conn) => {
            if (error) { return res.status(500).json(error) }

            conn.query(sqlDelete, id, (error, result) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (result.affectedRows == 0) {
                        res.status(409).json({ msg: 'Id not found.', id_stocks: id })
                    } else {
                        const response = {
                            msg: 'Stock deleted',
                            stock: {
                                id_stocks: id,
                                request: {
                                    type: 'DELETE',
                                    description: 'Delete a specific stock.',
                                    url: process.env.API_HOST + ':' + process.env.API_PORT + '/stocks/'
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

module.exports = new stock;    