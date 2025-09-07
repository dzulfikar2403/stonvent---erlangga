import { Pool } from "@neondatabase/serverless";
import postgres from 'postgres'
import config from "./config";

export const pool = new Pool({connectionString: config.env.databaseUrl,max: 10})

export const edgeSql = postgres(config.env.databaseUrl!,{
    ssl: 'require'
})