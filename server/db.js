import 'dotenv/config';
import {createClient} from '@libsql/client';
import {drizzle} from 'drizzle-orm/libsql';
const url=process.env.TURSO_DATABASE_URL;
if(!url) throw Error('Set TURSO_DATABASE_URL in .env (for local: file:local.db)');
const client=createClient({url,authToken:process.env.TURSO_AUTH_TOKEN||undefined});
export const db=drizzle(client);
export {client};
