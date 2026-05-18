# Chuk an Chukk

Live Social App for Pi Community

https://chuk-an-chukk-app.vercel.app

---

## 🚀 About Project

Chuk an Chukk adalah aplikasi sosial berbasis Pi Network yang mendukung:
- Login with Pi
- Social feed
- Chat realtime
- Upload gambar
- Followers system
- Notifications
- Pi payment integration (sandbox & mainnet)

---

## ✨ Features

### 🔐 Authentication
- Login menggunakan Pi SDK
- Sandbox & Mainnet support
- Secure user session

### 📰 Social Feed
- Posting teks & gambar
- Like & comment
- Realtime update

### 👤 User System
- Profile user
- Followers & following
- Bio & avatar

### 💬 Chat Realtime
- Private chat
- Online status
- Instant messaging

### 🔔 Notifications
- Like notification
- Follow notification
- Message notification

### 📤 Upload System
- Upload gambar ke Cloudinary
- Optimized CDN storage

---

## 🛠 Tech Stack

- Next.js
- React.js
- Tailwind CSS
- Node.js
- MongoDB Atlas
- Socket.io
- Cloudinary
- Pi SDK
- Vercel Hosting

---

## 📁 Folder Structure

```
public/
  validation-key.txt
  manifest.json
  icons/

src/
  app/
    page.js
    login/
    feed/
    chat/
    profile/
    support/

  components/
  lib/
  models/
  styles/
```

---

## ⚙️ Installation

```bash
git clone https://github.com/username/chuk-an-chukk.git
cd chuk-an-chukk
npm install
npm run dev
```

---

## 🔐 Environment Variables

Buat file `.env.local`:

```env
MONGODB_URI=your_mongodb_url

NEXT_PUBLIC_PI_SANDBOX=true

NEXT_PUBLIC_PI_API_KEY=your_pi_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔑 Pi SDK Setup

### Sandbox Mode
```javascript
Pi.init({
  version: "2.0",
  sandbox: true
});
```

### Mainnet Mode
```javascript
Pi.init({
  version: "2.0",
  sandbox: false
});
```

---

## 🌐 Domain Verification

Buat file:

```
public/validation-key.txt
```

Isi dengan key dari Pi Developer Portal.

Test:
```
https://chuk-an-chukk-app.vercel.app/validation-key.txt
```

---

## 🚀 Deployment

Deploy menggunakan:

- Vercel (recommended)
- Render (backend optional)
- Railway (optional backend)

---

## 📡 API Routes

- /api/auth/login
- /api/posts/create
- /api/posts/list
- /api/users/profile
- /api/chat/send
- /api/upload/image

---

## 📌 Project Status

Beta Version (Development Stage)

---

## 🔮 Roadmap

- Video posting
- Group chat
- Livestream
- NFT support
- Pi marketplace
- Creator monetization
- AI moderation

---

## 👨‍💻 Author

Chuk an Chukk Team

Built for Pi Network Community
