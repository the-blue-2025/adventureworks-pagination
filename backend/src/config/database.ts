import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Default configuration for development
const config = {
  database: process.env.DB_NAME || 'AdventureWorks2019',
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPassword123',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  dialect: 'mssql' as const,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  },
  logging: false
};

console.log('Database configuration:', {
  host: config.host,
  port: config.port,
  database: config.database,
  username: config.username
});

const sequelize = new Sequelize(config);

export default sequelize;
