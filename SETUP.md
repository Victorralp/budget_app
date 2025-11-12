# E-Commerce Store Setup Guide

This guide will help you set up and configure the e-commerce store application.

## Prerequisites

Before you begin, make sure you have the following:

- Node.js 18 or later installed
- npm or yarn package manager
- A Firebase account
- A Cloudinary account

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd project

# Install dependencies
npm install
```

### 2. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

#### Enable Firebase Services

**Authentication:**
1. In the Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable Email/Password authentication (or other providers as needed)

**Firestore Database:**
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" for development (update security rules for production)
4. Select a location for your database

**Storage (optional):**
1. Go to Storage
2. Click "Get Started"
3. Follow the setup wizard

#### Get Firebase Configuration

1. In Project Settings (gear icon), scroll to "Your apps"
2. Click the web icon (</>)
3. Register your app
4. Copy the configuration object

### 3. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Firestore Database Structure

Set up the following collections in Firestore:

#### Products Collection

```typescript
products/{productId}
{
  name: string,
  description: string,
  price: number,
  imageUrl: string,
  imagePublicId?: string,
  category: string,
  stock: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Orders Collection

```typescript
orders/{orderId}
{
  userId: string,
  items: array,
  total: number,
  status: string,
  shippingAddress: object,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Users Collection

```typescript
users/{userId}
{
  email: string,
  displayName?: string,
  photoURL?: string,
  createdAt: timestamp
}
```

### 6. Firestore Security Rules

Update your Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read public, write admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders - users can read/write their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Users - users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/                      # Next.js app router pages
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout page
│   ├── products/            # Products listing
│   ├── layout.tsx           # Root layout with Header/Footer
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── layout/             # Header, Footer
│   ├── products/           # ProductCard, etc.
│   ├── cart/               # Cart components
│   ├── checkout/           # Checkout form
│   └── ui/                 # Button, Card, etc.
├── contexts/               # React Context providers
│   ├── AuthContext.tsx     # Authentication context
│   └── CartContext.tsx     # Shopping cart context
├── hooks/                  # Custom React hooks
│   └── useCart.ts          # Cart management hook
├── lib/                    # Utility libraries
│   ├── firebase/           # Firebase config and helpers
│   │   ├── config.ts       # Firebase initialization
│   │   ├── auth.ts         # Auth functions
│   │   └── firestore.ts    # Database operations
│   └── cloudinary/         # Cloudinary config
├── types/                  # TypeScript definitions
│   └── index.ts            # Type definitions
└── public/                 # Static assets
```

## Features Implemented

- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling
- ✅ Framer Motion animations
- ✅ Firebase configuration (Auth, Firestore, Storage)
- ✅ Cloudinary integration
- ✅ Shopping cart with localStorage
- ✅ Responsive design
- ✅ Product listing
- ✅ Checkout flow

## Next Steps

1. **Add Sample Products:** Populate Firestore with product data
2. **Implement Authentication:** Add sign-up/login UI
3. **Connect Cart to Database:** Save cart state to Firestore for logged-in users
4. **Payment Integration:** Add Stripe or another payment provider
5. **Order Management:** Implement order tracking and history
6. **Admin Panel:** Create admin interface for managing products
7. **Search & Filter:** Add product search and filtering
8. **Product Reviews:** Allow users to rate and review products

## Troubleshooting

### Build Errors

If you encounter build errors, try:
```bash
rm -rf .next
npm run build
```

### Firebase Connection Issues

- Verify your environment variables are correct
- Check Firebase Console for any service restrictions
- Ensure Firebase services are enabled

### Image Loading Issues

- Verify Cloudinary credentials
- Check Next.js image configuration in `next.config.ts`
- Ensure external image domains are allowed

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Firebase documentation](https://firebase.google.com/docs)
- Consult [Tailwind CSS docs](https://tailwindcss.com/docs)
- Read [Framer Motion documentation](https://www.framer.com/motion/)

## License

MIT License - See LICENSE file for details
