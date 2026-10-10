import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const dir=mkdtempSync(join(tmpdir(),'todo-api-'));
process.env.TURSO_DATABASE_URL=`file:${join(dir,'test.db')}`;
process.env.FRONTEND_ORIGIN='http://localhost:5173';
const { client } = await import('../server/db.js');
await client.execute('CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)');
const { default: app } = await import('../server/app.js');
let server; let origin;
before(async()=>{server=await new Promise(resolve=>{const s=app.listen(0, '127.0.0.1',()=>resolve(s));});origin=`http://127.0.0.1:${server.address().port}`;});
after(async()=>{await new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()));client.close();rmSync(dir,{recursive:true,force:true});});
const request=async(path,method='GET',body)=>{const r=await fetch(origin+path,{method,headers:body!==undefined?{'Content-Type':'application/json'}:{},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,data:r.status===204?null:await r.json()};};
test('health and CRUD success/persistence',async()=>{
 assert.equal((await request('/health')).status,200);
 let result=await request('/api/todos','POST',{title:'Read Vue'});assert.equal(result.status,201);const id=result.data.id;
 result=await request('/api/todos');assert.equal(result.data.length,1);
 result=await request(`/api/todos/${id}`,'PATCH',{completed:true});assert.equal(result.data.completed,true);
 result=await request(`/api/todos/${id}`);assert.equal(result.data.completed,true);
 result=await request(`/api/todos/${id}`,'DELETE');assert.equal(result.status,204);
 result=await request('/api/todos');assert.equal(result.data.length,0);
});
test('invalid and missing items return correct status',async()=>{
 assert.equal((await request('/api/todos','POST',{title:' '})).status,400);
 assert.equal((await request('/api/todos/99999')).status,404);
 assert.equal((await request('/api/todos/nope')).status,400);
});
