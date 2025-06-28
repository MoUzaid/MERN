# 🌟 TrendZilla - Full-Stack E-Commerce Website (MERN)

TrendZilla is a modern, scalable, and responsive **E-Commerce web application** built with the **MERN stack**. It supports **Stripe payments**, **voice-enabled search**, an intuitive **admin dashboard**, and full **CRUD functionality** — all managed using **React Context API** for global state management.

---

## 🚀 Tech Stack

- **Frontend**: React.js, React Router DOM, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **Payments**: Stripe Checkout Integration
- **Voice Search**:  react-speech-recognition
- **Deployment Ready**: Responsive and scalable

---

## ✨ Core Features

| 🔧 Feature                  | 📄 Description                                                                 |
|----------------------------|-------------------------------------------------------------------------------|
| MERN Architecture          | Seamless integration of MongoDB, Express, React, and Node.js                 |
| 🎙 Voice Search            | Product search via microphone using React Web Speech Toolkit                 |
| 💳 Stripe Payments         | Secure online payments through Stripe Checkout                              |
| 🔐 Admin Dashboard         | Role-based admin panel for managing products and users                      |
| 📦 CRUD Operations         | Full create, read, update, and delete support for products                   |
| 🧠 Context API             | Global state management (auth, cart, user, etc.)                             |
| 📱 Responsive Design       | Optimized layout for mobile, tablet, and desktop screens                     |

---

## 📁 Folder Structure
```plaintext
trendzilla/
│
├── client/                  # React Frontend
│   ├── public/              # Static files (index.html, favicon, etc.)
│   ├── src/                 # React source files
│   │   ├── components/pages # Reusable UI components
│   │   ├── context/         # Context API (auth, cart, etc.)
│   │   ├── api/             # Axios API functions
│   │   ├── App.js           # Root React component
│   │   └── index.js         # React DOM entry point
│   ├── .env                 # Frontend environment (REACT_APP_*)
│   ├── package.json         # Frontend dependencies
│   └── README.md (optional)
│
├── server/                 # Express Backend
│   ├── controllers/        # Controller logic (products, users, payments)
│   ├── models/             # Mongoose models (User, Product, Order)
│   ├── routes/             # Express routes
│   ├── middleware/         # Auth, error handling, etc.
│   ├── .env                # Backend environment variables
│   ├── server.js           # Entry point for Express server
│   ├── package.json        # Backend dependencies
│
├── .gitignore              # Ignore node_modules, .env, etc.
└── README.md               # Project documentation
