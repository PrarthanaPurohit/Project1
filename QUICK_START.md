# Quick Start Guide

Get the MERN Showcase Platform up and running in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd mern-showcase-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend (.env):**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/showcase
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Frontend (.env):**

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

### 3. Seed Database

```bash
cd backend
npm run seed:samples
```

This creates:
- Admin user (username: `admin`, password: `admin123`)
- 3 sample projects
- 3 sample clients

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access Application

- **Landing Page:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Login:** Use `admin` / `admin123`

## What's Next?

### Explore the Landing Page
- View sample projects
- Check out client testimonials
- Try the contact form
- Subscribe to newsletter

### Try the Admin Panel
1. Login at http://localhost:5173/login
2. Add a new project with an image
3. Add a new client testimonial
4. View contact submissions
5. View newsletter subscriptions

### Run Tests

```bash
cd backend
npm test
```

## Common Issues

**MongoDB not running?**
```bash
# Start MongoDB
mongod
```

**Port already in use?**
- Change `PORT` in `backend/.env`
- Or kill the process using port 5000

**Can't login?**
- Ensure you ran `npm run seed` or `npm run seed:samples`
- Use username: `admin`, password: `admin123`

## Project Structure

```
├── backend/              # Express API
│   ├── controllers/     # Route handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
└── frontend/            # React app
    ├── app/
    │   ├── components/  # React components
    │   ├── routes/      # Page routes
    │   └── services/    # API calls
    └── vite.config.ts
```

## Key Features to Test

✅ View projects on landing page  
✅ View client testimonials  
✅ Submit contact form  
✅ Subscribe to newsletter  
✅ Admin login  
✅ Create/edit/delete projects  
✅ Create/edit/delete clients  
✅ View contact submissions  
✅ View newsletter subscriptions  
✅ Image upload and auto-cropping  

## Documentation

- **Full README:** [README.md](./README.md)
- **API Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Deployment:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Requirements:** [.kiro/specs/mern-showcase-platform/requirements.md](.kiro/specs/mern-showcase-platform/requirements.md)
- **Design:** [.kiro/specs/mern-showcase-platform/design.md](.kiro/specs/mern-showcase-platform/design.md)

## Need Help?

- Check the [README](./README.md) for detailed information
- Review [API Documentation](./API_DOCUMENTATION.md) for endpoint details
- See [Troubleshooting](./README.md#troubleshooting) section
- Open an issue on the repository

---

**Happy coding! 🚀**
