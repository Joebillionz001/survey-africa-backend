# 📧 Email Setup for Survey Africa Contact Form

## 🔧 **Setup Required**

To receive contact form messages at **lawijustice@gmail.com**, you need to configure Gmail App Password:

### 1. **Enable Gmail App Password**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Click **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Survey Africa" as the name
6. Copy the generated 16-character password

### 2. **Add Environment Variables**
Add these to your `.env` file in the backend folder:

```env
EMAIL_USER=lawijustice@gmail.com
EMAIL_PASS=@6mumuboyclimbtree
```

### 3. **Alternative Email Services**
If you prefer other email services:

**For Outlook/Hotmail:**
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=sitx myvu jcbj bvuo
```

**For Custom SMTP:**
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_password
```

## ✅ **What's Already Configured**

- ✅ Contact form sends emails to **lawijustice@gmail.com**
- ✅ Auto-reply confirmation to sender
- ✅ Input validation and sanitization
- ✅ Rate limiting (5 messages per 15 minutes)
- ✅ Spam protection
- ✅ Mobile-responsive form

## 📨 **Email Features**

### **You'll Receive:**
- Sender's name and email
- Subject line
- Full message content
- Timestamp
- Reply-to address (can reply directly)

### **Sender Gets:**
- Confirmation email
- Copy of their message
- Professional auto-reply

## 🔒 **Security Features**

- Input sanitization (prevents XSS)
- Email validation
- Rate limiting (prevents spam)
- HTML email with proper formatting
- Error handling

## 🚀 **How to Test**

1. Start your backend server: `npm run dev`
2. Visit your contact page
3. Fill out the form
4. Check your **lawijustice@gmail.com** inbox
5. Check sender's email for confirmation

## 📱 **Mobile Ready**

The contact form works perfectly on:
- Desktop browsers
- Mobile phones
- Tablets
- All modern browsers

---

**Note:** Without the Gmail App Password, the form will show an error. Set it up to start receiving contact messages!