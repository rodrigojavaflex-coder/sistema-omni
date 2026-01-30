import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'Ro112543*',
  database: process.env.DATABASE_NAME || 'omni',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true' ? true : ['error', 'warn'],
  ssl: false,
  migrationsTableName: 'migrations',
  extra: {
    charset: 'utf8',
    client_encoding: 'UTF8',
  },
  connectTimeoutMS: 60000,
});
