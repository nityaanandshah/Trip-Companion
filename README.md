# Trip Companion - Find Your Travel Buddies

A social platform to find and connect with compatible travel companions for your trips.

![Trip Companion](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square)

---

## Documentation

### For Users

📖 **[FEATURES.md](./FEATURES.md)** - Complete guide to all application features  
Perfect for non-technical users to understand what the app does.

### For Developers

🛠️ **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Setup, API docs, and development guide  
Everything you need to set up and develop the application.

### For Deployment

🚀 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment instructions  
Step-by-step guide to deploy the app to production.

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your credentials

# Set up database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Visit: **http://localhost:3000**

---

## What is Trip Companion?

Trip Companion helps travelers find compatible companions for their adventures. Users can:

- ✅ Create and browse trip posts with details, dates, and budgets
- ✅ Discover compatible travel companions through filters
- ✅ Request to join trips and manage attendees
- ✅ Chat in real-time with trip members
- ✅ Bookmark trips and get notifications
- ✅ Manage profiles with avatars and bios

---

## Tech Stack

**Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS  
**Backend**: Next.js API Routes, Prisma, PostgreSQL  
**Real-time**: Socket.io for group chat  
**Auth**: NextAuth.js v5  
**Media**: Cloudinary for images

---

## 📖 Documentation Links

| Document                                   | Purpose                    | Audience                |
| ------------------------------------------ | -------------------------- | ----------------------- |
| [FEATURES.md](./FEATURES.md)               | Complete feature guide     | Users, Product Managers |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Technical setup & API docs | Developers              |
| [DEPLOYMENT.md](./DEPLOYMENT.md)           | Deployment instructions    | DevOps, Developers      |

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is built as a learning project and portfolio piece.

---

## ⭐ Built With

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Prisma](https://www.prisma.io) - Database ORM
- [Socket.io](https://socket.io) - Real-time communication
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [Cloudinary](https://cloudinary.com) - Image management
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

**Happy Traveling! 🌍✈️**
