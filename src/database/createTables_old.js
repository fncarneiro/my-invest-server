import connection from './connection.js';

function createTables() {
    const createUser = `CREATE TABLE IF NOT EXISTS users (
            id_user int NOT NULL AUTO_INCREMENT,
            email varchar(100) NOT NULL,
            password varchar(100) NOT NULL,            
            permission_level int NOT NULL,
            PRIMARY KEY (id_user),
            UNIQUE KEY email_UNIQUE (email)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

    const createInvestment = `CREATE TABLE IF NOT EXISTS investments (
            id_investment int NOT NULL AUTO_INCREMENT,
            period date NOT NULL,
            PRIMARY KEY (id_investment),
            UNIQUE KEY period_UNIQUE (period)) 
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

    const createStock = `CREATE TABLE IF NOT EXISTS stocks (
            id_stock int NOT NULL AUTO_INCREMENT,
            stock_name varchar(6) NOT NULL,
            by_amount int NOT NULL,
            by_price decimal(12,0) NOT NULL,
            by_tax decimal(12,2) DEFAULT NULL,
            target_profit decimal(12,2) NOT NULL,
            sell_profit decimal(12,2) NOT NULL,
            sell_amount int DEFAULT NULL,
            sell_tax decimal(12,2) DEFAULT NULL,
            note varchar(200) DEFAULT NULL,
            id_investment int NOT NULL,
            PRIMARY KEY (id_stock),
            KEY id_investment_idx (id_investment),
            CONSTRAINT id_investment FOREIGN KEY (id_investment) REFERENCES investments (id_investment) ON DELETE CASCADE) 
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

    const tables = [createUser, createInvestment, createStock];

    tables.forEach((table) => {
        connection(table)
            .then((result) => {
                if (process.env.NODE_ENV == 'development') {
                    console.log(`Table ${table.substring(27, 33)} verified.`)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    })
};

export default createTables;