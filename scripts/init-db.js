import {client} from '../server/db.js';
await client.execute('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)');
console.log('todos table initialized');client.close();
