import 'dotenv/config'
import { DataSource } from 'typeorm';
import databaseConfig from '../config/database.config.js';

const config = databaseConfig();
export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,

  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],

  synchronize: false
});
