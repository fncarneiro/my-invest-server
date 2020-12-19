class Tables {
    init(conection) {
        this.conection = conection;
        this.createTables();
    }

    createTables() {
        const sqlInvestment = `CREATE TABLE IF NOT EXISTS investments (
            id_investmen int NOT NULL AUTO_INCREMENT,
            period date NOT NULL,
            PRIMARY KEY (id_investment)) 
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`;

        const sqlStock = `CREATE TABLE IF NOT EXISTS stocks (
            id_stocks int NOT NULL AUTO_INCREMENT,
            stock_name varchar(6) NOT NULL,
            by_amount int NOT NULL,
            by_price decimal(2,0) NOT NULL,
            by_tax decimal(2,0) DEFAULT NULL,
            target_profit decimal(2,0) NOT NULL,
            sell_profit decimal(2,0) NOT NULL,
            sell_amouunt int DEFAULT NULL,
            sell_tax decimal(10,0) DEFAULT NULL,
            note varchar(200) DEFAULT NULL,
            id_investment int NOT NULL,
            PRIMARY KEY (id_stocks),
            KEY id_investment_idx (id_investment),
            CONSTRAINT id_investment FOREIGN KEY (id_investment) REFERENCES investments (id_investment) ON DELETE CASCADE) 
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`;

        const sql = [sqlInvestment, sqlStock];

        sql.forEach((sql) => {

            this.conection.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log(`Tabela ${sql.substring(26,33)} criada com sucesso.`);
                }
            })
        })
    }
}

module.exports = new Tables;
