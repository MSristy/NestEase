# NestEase - Unified Home Solutions Platform

NestEase is an all-in-one web platform that provides verified property rentals, instant home service booking, and a digital barter system. The platform aims to solve common urban living challenges in Dhaka by connecting users with verified properties, trusted service professionals, and enabling eco-friendly item swapping.

![NestEase Screenshot](./public/images/readme-screenshot.jpg)

## 🔥 Key Features

### 🏠 Property Rental & Real Estate
- **Verified Property Listings:** All landlords must verify their identity and property documents
- **Smart Filters:** Search by price, location, amenities, and property type
- **Review System:** Tenants and landlords can rate each other to prevent fraud
- **Rental Agreement Generator:** Create legally valid, downloadable rental contracts
- **Secure In-App Communication:** Chat and call features for secure communication

### 🛠️ Home Service Booking
- **Category-Based Service Listings:** Find cleaners, electricians, plumbers, and more
- **Live Tracking:** Monitor the real-time location of service professionals
- **Instant Price Estimation:** Get cost estimates before booking
- **Review & Rating System:** Ensure only top-rated professionals remain on the platform
- **Wallet & Referral System:** Earn discounts by referring friends or rebooking services

### 🔄 Swap & Save (Digital Barter System)
- **Tinder-Style Swipe Interface:** Quickly accept or reject swap offers with intuitive swipes
- **Condition Ratings:** Items are listed with condition grades (New, Good, Fair, Used)
- **Swap Tokens:** A point-based system instead of cash transactions
- **Direct Chat & Scheduling:** Arrange item exchanges via the built-in scheduler
- **Eco-Friendly Initiative:** Promotes reuse and reduces waste

## 🚀 Tech Stack

- **Frontend:** Next.js (React) with TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Context API
- **Authentication:** NextAuth.js with JWT
- **Database:** (Placeholder for backend integration)
- **Real-Time Features:** (Placeholder for backend integration)
- **Geolocation:** Leaflet Maps
- **Animation:** Framer Motion
- **Form Handling:** React Hook Form

## 📥 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/nest-ease.git
cd nest-ease
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
nest-ease/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   │   ├── ui/        # UI components
│   │   ├── layout/    # Layout components
│   │   ├── property/  # Property module components
│   │   ├── services/  # Services module components
│   │   └── barter/    # Barter module components
│   ├── context/       # React Context for state management
│   └── lib/           # Utility functions and hooks
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## 🧩 Main Modules

### Property Module
- Property listings with filters
- Property details page
- Booking/inquiry system
- Landlord verification

### Services Module
- Service category selection
- Service professional listings
- Booking workflow
- Rating and review system

### Barter Module
- Item listings
- Swipe interface for item discovery
- Chat system for negotiation
- Swap token management

## 🌟 Future Enhancements

- **Mobile App:** Flutter-based mobile applications for Android and iOS
- **AI Recommendations:** Smart property and service recommendations
- **Voice Search:** Voice-enabled search functionality
- **Payment Integration:** Online payment processing
- **Virtual Tours:** 360° property tours
- **Document Verification API:** Automated ID and document verification

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any queries or support, please contact us at info@nestease.com

---

Built with ❤️ for easier urban living in Dhaka.
