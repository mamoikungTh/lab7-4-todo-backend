# LAB 7-4 — Todo Backend API (Turso + Drizzle + Vercel)

โปรเจกต์ **Backend อย่างเดียว** แยกจาก Lab 7-5 ตามภาพโจทย์ หน้า 72–74

## API
- `GET /health` และ `GET /api/health` เช็คการเชื่อมฐานข้อมูล
- `GET /api/todos` ดึงรายการ
- `GET /api/todos/:id` ดึงรายการเดียว
- `POST /api/todos` ส่ง JSON `{"title":"อ่านหนังสือ"}`
- `PATCH /api/todos/:id` ส่ง JSON `{"completed":true}` หรือ `{"title":"ชื่อใหม่"}`
- `DELETE /api/todos/:id` สำเร็จ HTTP 204

## รันและทดสอบบนเครื่อง
```powershell
npm install
Copy-Item .env.example .env
npm run db:init
npm test
npm run check
npm run dev
```
เปิด http://localhost:3000/health แล้วเรียก http://localhost:3000/api/todos

## เตรียม Turso + Deploy
1. สร้างฐานข้อมูลใน Turso แล้วรับ Database URL (`libsql://...`) และ Auth Token
2. สร้างตาราง SQL ใน Turso: `CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0);` (ใช้ Turso SQL shell หรือ `npm run db:init` โดยกำหนด env จริงในเครื่อง)
3. Push **เฉพาะโฟลเดอร์นี้** ไป GitHub repo สำหรับ Lab 7-4 โดยอย่า Push `.env`, token หรือ `.db`
4. Vercel > Add New Project > Import Repo > Framework **Other**, Root `./` (หาก repository นี้มี backend อยู่ root)
5. ใน Environment Variables ของ Vercel เพิ่ม `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `FRONTEND_ORIGIN` ซึ่งช่วงแรกกำหนด `http://localhost:5173` เพื่อทดสอบ ก่อนแก้เป็น Public Frontend URL
6. Deploy แล้วตรวจ `https://YOUR-BACKEND.vercel.app/health` และ `/api/todos` จากภายนอก
7. หลัง Deploy ใหม่ ตรวจว่า Todo ที่เพิ่มยังอยู่ (DB persist ใน Turso ไม่ใช่ disk บน Vercel)

**หมายเหตุ:** หาก deployment platform ส่ง path ไปที่ Function ต่างจาก original path ให้ตรวจ Vercel Function Logs/การ Rewrite ก่อนสรุปว่างานผ่าน

## หลักฐานส่ง Lab 7-4
- Public Backend URL และ screenshot GET /health, GET /api/todos
- ผลทดสอบ POST/PATCH/DELETE ด้วย Postman/curl และ status 201/200/204
- Screenshot ว่าข้อมูลอยู่หลัง redeploy, แสดง Vercel environment variable **เฉพาะชื่อ ห้ามแสดงค่าลับ**
- GitHub URL ที่ไม่มี Token

**ยังไม่ได้ Deploy จริง** ต้องใช้บัญชี Turso + Vercel ของผู้เรียนและตรวจผลลัพธ์หลัง Deploy
