# 💰 Expense Manager

A full-stack web application to track income and expenses with interactive charts — built with **React.js**, **Node.js**, **Express.js**, **SQLite**, and **JWT Authentication**.

> Built by **Lawan Kumar Bairi** | [LinkedIn](https://linkedin.com/in/lawangoud) | [GitHub](https://github.com/LawanGoud)

---

## 🚀 Live Demo

- **Frontend:** `https://your-app.vercel.app` *(update after deployment)*
- **Backend API:** `https://your-api.onrender.com` *(update after deployment)*

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login
- ➕ **Add Transactions** — Track income and expenses with categories
- 📊 **Pie Chart** — Visual expense breakdown by category
- 📈 **Line Chart** — Monthly income vs expense trend
- 💰 **KPI Cards** — Balance, total income, total expense, transaction count
- ✏️ **Edit & Delete** — Update any transaction anytime
- 🔍 **Search & Filter** — Filter by income/expense, search by title or category
- ⬇️ **CSV Export** — Download all transactions as a spreadsheet
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Frontend   | React.js, React Router v6, Chart.js  |
| Backend    | Node.js, Express.js                  |
| Database   | SQLite (via better-sqlite3)          |
| Auth       | JWT (jsonwebtoken), bcryptjs         |
| Styling    | Pure CSS (no UI library)             |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
expense-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── routes/
│   │   ├── auth.js              # Register & Login
│   │   └── transactions.js      # CRUD + summary
│   ├── database.js              # SQLite setup
│   ├── server.js                # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AddTransaction.js
│   │   │   ├── TransactionCard.js
│   │   │   └── Charts.js
│   │   ├── utils/
│   │   │   └── exportCSV.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v16+ installed
- npm installed

### Step 1 — Clone the repo
```bash
git clone https://github.com/LawanGoud/expense-manager.git
cd expense-manager
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Open .env and set a strong JWT_SECRET
node server.js
# ✅ Server running on http://localhost:5000
```

### Step 3 — Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api
npm start
# ✅ App opens at http://localhost:3000
```

---

## 🌐 Deployment

### Backend → Render.com (Free)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variables:
   - `JWT_SECRET` = your strong secret key
   - `FRONTEND_URL` = your Vercel frontend URL
7. Deploy and copy the URL

### Frontend → Vercel (Free)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo
3. Set **Root Directory**: `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-render-url.onrender.com/api`
5. Deploy → live!

---

## 📡 API Reference

### Auth
| Method | Route               | Description      |
|--------|---------------------|------------------|
| POST   | /api/auth/register  | Create new user  |
| POST   | /api/auth/login     | Login, get token |

### Transactions (JWT required)
| Method | Route                        | Description           |
|--------|------------------------------|-----------------------|
| GET    | /api/transactions            | Get all transactions  |
| GET    | /api/transactions/summary    | Get balance & charts  |
| POST   | /api/transactions            | Add transaction       |
| PUT    | /api/transactions/:id        | Update transaction    |
| DELETE | /api/transactions/:id        | Delete transaction    |

---

## 🗂️ Categories

**Income:** Salary, Freelance, Business, Investment, Other

**Expense:** Food, Rent, Transport, Shopping, Entertainment, Health, Education, Other

---

## 📸 Screenshots

> *(Add screenshots after deployment)*

---

## 🤝 Contact

**Lawan Kumar Bairi**
- 📧 lavan.bairi@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/lawangoud)
- 💻 [GitHub](https://github.com/LawanGoud)
