const conection = require('../infrastructure/conection');

class stock {
    createStock(stock, res) {
        const sql = 'INSERT INTO stocks SET ?';

        conection.query(sql, stock, (erro, results) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(stock)
            }
        })
    }

    updateStock(id, stock, res) {
        const sql = 'UPDATE stocks SET ? where id_stocks = ?';

        conection.query(sql, [stock, id], (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json({ id, ...stock })
            }
        })
    }

    listStocks(res) {
        const sql = 'SELECT * FROM stocks';

        conection.query(sql, (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(result)
            }
        })
    }

    searchForId(id, res) {
        const sql = `SELECT * FROM stocks WHERE id_stocks = ?`;
        conection.query(sql, id, (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(result)
            }
        })
    }

    deleteStock(id, res) {
        const sql = 'DELETE FROM stocks where id_stocks = ?';
        conection.query(sql, id, (error, result) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json({ id })
            }
        })
    }
}

module.exports = new stock;    