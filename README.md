# Survey Africa 🌍

A comprehensive survey platform designed to help users earn daily income through surveys, CPA offers, and YouTube tasks.

## 🚀 Live Demo

- **Frontend:** https://surveyafrica.netlify.app
- **Backend API:** https://surveyafrica-backend.up.railway.app

## ✨ Features

- **User Authentication** - Secure login/register system
- **Survey Creation** - Build custom surveys with multiple question types
- **Earning System** - Multiple ways to earn money
- **CPA Offers** - Complete offers for rewards
- **YouTube Tasks** - Watch videos and earn
- **Real-time Analytics** - Track earnings and performance
- **Mobile Responsive** - Works on all devices
- **Multi-language Support** - Built for African markets

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive design
- Local storage for offline capability

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Email integration (Nodemailer)
- Security middleware (Helmet, CORS, Rate limiting)

## 💰 Earning Methods

1. **Survey Completion** - $0.50 per survey
2. **CPA Offers** - $0.50 - $3.00 per offer
3. **YouTube Tasks** - $0.50 - $1.25 per video
4. **Referrals** - $5.00 per friend invited
5. **Daily Tasks** - Various micro-tasks

## 🔧 Local Development

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

### Frontend Setup
```bash
# Serve with any static server
python -m http.server 8000
# or
npx serve .
```

## 🌐 Deployment

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set environment variables from `.env.example`
3. Deploy automatically

### Frontend (Netlify)
1. Connect GitHub repo to Netlify
2. Build settings: Publish directory = `.`
3. Deploy automatically

## 📊 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/surveys` - Get surveys
- `POST /api/responses` - Submit survey response
- `GET /api/earnings` - Get user earnings
- `GET /api/cpagrip/offers` - Get CPA offers

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Input validation
- CORS protection
- Rate limiting
- XSS protection
- CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🌟 Support

For support, email lawijustice@gmail.com or create an issue on GitHub.

---

Made with ❤️ for Africa 🌍