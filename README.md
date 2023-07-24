<p align="center" style="font-family: monospace">
  <a href="https://private-note.vercel.app/"
    >https://private-note.vercel.app/
    </a>
</p>

# Private Note

its a simple service allow you to create a note that will automaticly be deleted after the first time someone open it.

# Stack

- NodeJS
- tRPC
- Prisma
- React
- shadcn/ui

# Run Locally

## Backend

1 - Clone the project

2 - Go to backend directory

3 - Add .env file with the following content

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT="PORT_FOR_BACKEND"
SECRET_KEY="SECRET_KEY_FOR_JWT"
```

4 - install dependencies

```bash
npm install
```

5 - Create database tables

```bash
npx prisma migrate dev
```

6 - Run backend

```bash
npm run dev
```

## Frontend

1 - Go to frontend directory

2- Add .env file with the following content

```bash
VITE_API_URL='http://localhost:YOUR_BACKEND_PORT'
VITE_FRONTEND_URL='http://localhost:5173'
```

3 - install dependencies

```bash
npm install
```

4 - Run frontend

```bash
npm run dev
```
