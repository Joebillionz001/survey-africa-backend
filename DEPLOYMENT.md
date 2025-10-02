# Survey Africa Deployment Guide

## 1. Backend Deployment (Railway)

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub repo
4. Select the `backend` folder as root
5. Add environment variables from `.env.example`
6. Deploy automatically

**Environment Variables to Set:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Random secure string (32+ chars)
- `NODE_ENV=production`
- `FRONTEND_URL` - Your Netlify URL
- All API credentials (BitLabs, CPAGrip, CPX, Email)

## 2. Frontend Deployment (Netlify)

1. Go to [Netlify.com](https://netlify.com)
2. Connect GitHub and select repository
3. Build settings: 
   - Build command: `echo "Static site"`
   - Publish directory: `.` (root)
4. Update `js/api.js` baseURL to Railway backend URL
5. Deploy

## 3. Database Setup (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string for `MONGODB_URI`

## 4. Domain Setup (Optional)

1. Purchase domain
2. Point to Netlify in DNS settings
3. Update `FRONTEND_URL` in backend env vars
4. Update CORS settings if needed

## 5. Post-Deployment

1. Test all features
2. Update API URLs in frontend
3. Verify email sending works
4. Test payment integrations
5. Monitor logs for errors