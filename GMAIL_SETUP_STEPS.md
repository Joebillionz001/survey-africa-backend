# 🔧 Gmail App Password Setup for Survey Africa

## ⚠️ **Current Issue**
Your `.env` file has a regular password, but Gmail requires an **App Password** for security.

## 📋 **Step-by-Step Setup**

### 1. **Enable 2-Factor Authentication**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** (left sidebar)
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup if not already enabled

### 2. **Generate App Password**
1. Still in **Security** section
2. Click **App passwords** (appears after 2FA is enabled)
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Type: **Survey Africa**
6. Click **Generate**
7. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### 3. **Update .env File**
Replace this line in `/backend/.env`:
```env
EMAIL_PASS=abcdefghijklmnop
```

With your actual app password:
```env
EMAIL_PASS=abcdefghijklmnop
```
(Remove spaces: `abcdefghijklmnop`)

### 4. **Test Configuration**
Run this command in the backend folder:
```bash
node test-email.js
```

## ✅ **Expected Result**
You should see:
- ✅ SMTP connection verified successfully!
- ✅ Test email sent successfully!
- 📧 Check your inbox at: lawijustice@gmail.com

## 🚨 **Security Note**
- Never share your App Password
- App Passwords bypass 2FA for specific apps
- You can revoke them anytime in Google Account settings

---

**Once setup is complete, your contact form will send messages to lawijustice@gmail.com!**