import dotenv from 'dotenv';
import customExpress from './src/config/customExpress.js';
//import createTables from './src/database/createTables.js';

const node_env = process.env.NODE_ENV?.trim();

switch (node_env) {
  case 'production':
    dotenv.config({ path: './src/config/env/.env.production' });
    break;
  case 'test':
    dotenv.config({ path: './src/config/env/.env.test' });
    break;
  default:
    dotenv.config({ path: './src/config/env/.env.development' });
    break;
}
console.log('Enviroment: ', node_env?.toUpperCase());

const port = process.env.PORT || 3000;

//createTables();

const app = customExpress;

app.listen(port,
  () => { console.log(`\u001b[1;34mServer running on ${process.env.HOST} - port ${port} ... \u001b[0m`); })
  .on('error', function (err) { console.log(`\u001b[1;31mFail on starting server - ${err} \u001b[0m`) });

export default app;