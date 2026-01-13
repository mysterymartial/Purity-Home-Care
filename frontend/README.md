# Purity Home Care - Frontend

Next.js frontend application for the Purity Home Care service booking platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm package manager

### Installation

```bash
pnpm install
```

### Environment Variables

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEcnXpBSA4MVlOnwsQroky64lgeU7ewxU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=purity-home-care.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=purity-home-care
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=purity-home-care.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=333284266562
NEXT_PUBLIC_FIREBASE_APP_ID=1:333284266562:web:5807e520cb406d4fdb13db
NEXT_PUBLIC_WHATSAPP_NUMBER=+1 (215) 617-8614
```

### Development

```bash
pnpm dev
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Build

```bash
pnpm build
```

Creates an optimized production build.

### Start Production Server

```bash
pnpm start
```

Starts the production server (requires `pnpm build` first).

### Testing

```bash
pnpm test
```

Runs Jest tests.

```bash
pnpm test:watch
```

Runs tests in watch mode.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── booking/           # Booking page
│   ├── chat/              # Chat page
│   ├── review/            # Review submission page
│   └── admin/             # Admin pages (login, dashboard)
├── components/            # Reusable React components
│   ├── Navbar.tsx        # Navigation bar
│   └── Footer.tsx        # Footer component
├── lib/                   # Utilities and API clients
│   ├── firebase.ts       # Firebase configuration
│   ├── api.ts            # API client functions
│   └── whatsapp.ts       # WhatsApp utility
├── __tests__/            # Test files
├── public/               # Static assets
│   └── logo.jpeg         # Logo image
└── package.json          # Dependencies
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication
- **Socket.IO Client** - Real-time messaging
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **Jest** - Testing framework

## 📄 Pages

### Landing Page (`/`)
- Hero section with CTA
- Services overview
- Our Process section
- Why Choose Us section
- Patient testimonials/reviews
- Final CTA section

### Booking Page (`/booking`)
- Two booking options:
  - Book on App (in-app chat)
  - Book on WhatsApp (WhatsApp deep link)

### Chat Page (`/chat`)
- Real-time chat interface
- Socket.IO integration
- Message history
- WhatsApp continuation option

### Review Page (`/review`)
- Star rating (1-5)
- Service selection
- Date picker
- Text review

### Admin Login (`/admin/login`)
- Firebase authentication
- Email/password login

### Admin Dashboard (`/admin/dashboard`)
- Chat inbox
- Chat conversation view
- Booking status management
- Reviews moderation
- Google Meet integration

## 🔧 Configuration

### Next.js Config
- Environment variables exposed via `next.config.js`
- API URL configuration
- Firebase configuration

### Tailwind Config
- Custom color palette (teal, blue)
- Responsive breakpoints
- Custom utilities

## 🧪 Testing

Tests are located in `__tests__/` directory:
- `lib/whatsapp.test.ts` - WhatsApp utility tests

Run tests:
```bash
pnpm test
```

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces

## 🎨 Styling

- Professional, modern UI matching v0 design standard
- Consistent color scheme (teal/blue primary, red accents)
- Smooth transitions and hover effects
- Professional shadows and borders
- Enhanced typography

## 📝 Notes

- Logo should be placed at `public/logo.jpeg`
- All environment variables must start with `NEXT_PUBLIC_` for client-side access
- Firebase configuration is required for admin authentication
- API URL should point to backend server

## 🐛 Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check that logo.jpeg exists in public folder
- Verify Node.js version (18+)

### Runtime Errors
- Check browser console for errors
- Verify backend server is running
- Check Firebase configuration

## 📚 Related Documentation

- [Main README](../README.md) - Project overview
- [Setup Guide](../docs/SETUP_GUIDE.md) - Detailed setup instructions
- [Architecture Documentation](../docs/ARCHITECTURE.md) - System architecture

