# 📚 SkillStep - Smart Learning, One Step at a Time 🚀

**SkillStep** is a smart and structured learning platform that enhances students' learning experiences by dynamically releasing course videos instead of overwhelming them with all content at once.

With **SkillStep**, students control the pace of their learning by selecting how many videos they want to watch daily. They receive **automated email reminders**, ensuring consistency in learning. Upon completing the course, students receive a **certificate of completion**.

---

## 🚀 Features & Benefits

✅ **Structured Learning** - No content overload; videos are unlocked gradually.  
✅ **Custom Learning Pace** - Users select how many videos to receive daily.  
✅ **Daily Email Reminders** - Never lose track of learning progress.  
✅ **YouTube API Integration** - Manage and fetch course content dynamically.  
✅ **Certification** - Get a certificate upon completing the course.  
✅ **Secure Authentication** - User authentication with JWT, bcrypt, and cookies for personalized course tracking.  
✅ **OTP-Based Signup & Password Reset** - Users can sign up with an OTP verification and reset passwords securely.  
✅ **Community Learning** - Each course has a dedicated **Discord group** for discussions and peer support.  

---

## 🎯 How It Works

### 1. **User Enrollment**
- Users provide a **YouTube playlist link**.
- They choose how many videos they want per day.

### 2. **Dynamic Video Release**
- Videos unlock **one by one** based on the selected frequency.
- Users receive **daily email notifications** when new videos are available.

### 3. **Course Completion & Certification**
- Upon finishing all videos, users receive a **certificate of completion**.

### 4. **Community Learning with Discord**
- Each course has a **Discord group** where students can help each other.
- Helping others reinforces learning as revisiting concepts acts as revision.

---

## 🛠️ Tech Stack

| Stack              | Technologies Used              |
| ------------------ | ------------------------------ |
| **Frontend**       | React.js, Tailwind CSS, Vercel |
| **Backend**        | Node.js, Express.js, Render    |
| **Database**       | MongoDB Atlas                  |
| **Authentication** | JWT, Bcrypt, Cookies, OTP      |
| **Email Service**  | Nodemailer                     |
| **External API**   | YouTube Playlist API, Discord API |

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Rahilsamani/SkillStep.git
cd SkillStep
```

### 2. Install Dependencies
#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
npm install
```

### 3. Run the Application
#### Start Backend:
```bash
cd server
npm run start
```

#### Start Frontend:
```bash
npm start
```

### 4. Access the Application
Once running, open your browser and visit:
```
http://localhost:3000
```

---

## 📸 Screenshots

### 🔹 Home Page
> _A clean and intuitive interface for users to enroll in courses._  
> ![Homepage](https://github.com/Rahilsamani/SkillStep/blob/main/Project_Demo/home.png?raw=true)

### 🔹 Course Dashboard
> _Users see their progress, available videos, and upcoming lessons._  
> ![Dashboard](https://github.com/Rahilsamani/SkillStep/blob/main/Project_Demo/add%20course.png?raw=true)
> ![Dashboard](https://github.com/Rahilsamani/SkillStep/blob/main/Project_Demo/enrolled%20courses.png?raw=true)
> ![Dashboard](https://github.com/Rahilsamani/SkillStep/blob/main/Project_Demo/view%20course.png?raw=true)

### 🔹 Email Notification
> _A sample email reminder users receive daily._  
> ![Email Notification](https://via.placeholder.com/800x400?text=Email+Notification)

### 🔹 Certificate Email Notification
> _A sample email for certificate_  
> ![Certificate](https://via.placeholder.com/800x400?text=Email+Notification)

---

## 🏆 Certification
SkillStep provides a **certification system** where users receive a digital certificate upon completing their course. The certificates are generated dynamically and emailed automatically.

---

## 📌 Roadmap

- [✅] Implement dynamic YouTube video unlocking  
- [✅] Add email notifications  
- [✅] Deploy frontend on Vercel, backend on Render  
- [✅] Implement OTP-based signup & password reset  
- [✅] Integrate Discord for community-based learning  
- [ ] Implement AI-based progress tracking (🛠️ Coming Soon)  
- [ ] Mobile app version (🛠️ Coming Soon)  

---

## 🤝 Contribution Guidelines

We welcome contributions! Here's how you can help:

1. **Fork** this repository.
2. **Create a new branch** for your feature or bug fix.
3. **Commit** your changes.
4. **Submit a Pull Request (PR).**

---

## 💌 Contact & Support

📧 **Email:** [rahilahmed1720@gmail.com](mailto:rahilahmed1720@gmail.com)  
💼 **LinkedIn:** [rahil-ahmed-samani](https://www.linkedin.com/in/rahil-ahmed-samani/)  
💻 **GitHub:** [Rahilsamani](https://github.com/Rahilsamani)  

📢 **If you like this project, don't forget to ⭐ star the repository!**

---

## 📝 License

This project is licensed under the **MIT License** - feel free to modify and use it for your projects.

