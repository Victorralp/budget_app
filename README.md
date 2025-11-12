# E-Commerce Store

A modern, full-featured e-commerce application built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Firebase, and Cloudinary.

## Features

- 🛍️ Product catalog with detailed views
- 🛒 Shopping cart functionality
- 💳 Checkout process
- 🔥 Firebase backend integration
- 🖼️ Cloudinary image management
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- ⚡ Optimized performance with Next.js 15

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Image Management:** Cloudinary
- **State Management:** React Hooks

## Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── cart/                # Cart page
│   ├── checkout/            # Checkout page
│   ├── products/            # Products listing page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── layout/             # Layout components (Header, Footer)
│   ├── products/           # Product-related components
│   ├── cart/               # Cart components
│   ├── checkout/           # Checkout components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility libraries
│   ├── firebase/           # Firebase configuration
│   └── cloudinary/         # Cloudinary configuration
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
   - Add your Firebase configuration
   - Add your Cloudinary credentials

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Copy your Firebase configuration to `.env.local`

### Cloudinary Setup

1. Create a Cloudinary account at [Cloudinary](https://cloudinary.com/)
2. Copy your cloud name, API key, and API secret to `.env.local`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Key Features Implementation

### Shopping Cart

The shopping cart is implemented using a custom React hook (`useCart`) with localStorage persistence:
- Add products to cart
- Update quantities
- Remove items
- Calculate totals
- Persist across page reloads

### Firebase Integration

Firebase is configured for:
- **Authentication:** User sign-in and registration
- **Firestore:** Product and order data storage
- **Storage:** Additional file storage if needed

### Cloudinary Integration

Cloudinary is set up for:
- Image optimization
- Responsive image delivery
- Image transformations
- CDN delivery

### Animations

Framer Motion provides:
- Page transitions
- Component animations
- Hover effects
- Scroll-triggered animations

## Development Roadmap

- [ ] Implement user authentication
- [ ] Connect to Firebase Firestore for products
- [ ] Add product search and filtering
- [ ] Implement payment processing
- [ ] Add order history
- [ ] Implement admin dashboard
- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
