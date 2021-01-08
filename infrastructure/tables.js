class Tables {
    init(conection) {
        this.conection = conection;
        this.createTables();
    }

    createTables() {
        const sqlUser = `CREATE TABLE IF NOT EXISTS users (
            id_users int NOT NULL AUTO_INCREMENT,
            email varchar(100) NOT NULL,
            password varchar(100) NOT NULL,
            PRIMARY KEY (id_users),
            UNIQUE KEY email_UNIQUE (email)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`;    
        
        const sqlInvestment = `CREATE TABLE IF NOT EXISTS investments (
            id_investmen int NOT NULL AUTO_INCREMENT,
            period date NOT NULL,
            PRIMARY KEY (id_investment),
            UNIQUE KEY period_UNIQUE (period)) 
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`;  

        const sqlStock = `CREATE TABLE IF NOT EXISTS stocks (
            id_stocks int NOT NULL AUTO_INCREMENT,
            stock_name varchar(6) NOT NULL,
            by_amount int NOT NULL,
            by_price decimal(12,0) NOT NULL,
            by_tax decimal(12,2) DEFAULT NULL,
            target_profit decimal(12,2) NOT NULL,
            sell_profit decimal(12,2) NOT NULL,
            sell_amouunt int DEFAULT NULL,
            sell_tax decimal(12,2) DEFAULT NULL,
            note varchar(200) DEFAULT NULL,
            id_investment int NOT NULL,
            PRIMARY KEY (id_stocks),
            KEY id_investment_idx (id_investment),
            CONSTRAINT id_investment FOREIGN KEY (id_investment) REFERENCES investments (id_investment) ON DELETE CASCADE) 
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`;          
              

        const sql = [sqlUser, sqlInvestment, sqlStock];

        sql.forEach((sql) => {
            this.conection.query(sql, (erro) => {
                if (erro) {
                    console.log(erro);
                } else {
                    console.log(`Table ${sql.substring(27,33)} verified.`);
                }
            })
        })
    }
}
module.exports = new Tables;
