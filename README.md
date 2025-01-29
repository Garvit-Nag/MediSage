# MediSage - AI-Powered Medical Symptom Analysis Platform

## Overview

MediSage is a sophisticated medical symptom analysis platform that leverages artificial intelligence to provide comprehensive health insights. The platform offers two distinct analysis methods:

- **Holistic Health Assessment**: Traditional multi-symptom analysis
- **Anatomical Precision Analysis**: Detailed body-based assessment

## Features

- 🤖 **AI-powered analysis using Gemini 1.5**
- 🔒 **Secure authentication with Clerk**
- 💳 **Flexible subscription plans with Stripe integration**
- 📊 **Interactive body mapping for symptom localization**
- ⚡ **Rate limiting for free tier users**
- 📱 **Responsive design for all devices**
- 🌙 **Dark/Light mode support**

## Tech Stack

### Frontend
- Next.js 15.1.4
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion

### Backend
- FastAPI
- Python 3.10
- Google Generative AI (Gemini 1.5)
- MongoDB
- Redis (Upstash)

### Authentication & Payments
- Clerk Authentication
- Stripe Payment Processing


## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB
- Redis
- Stripe Account
- Clerk Account
- Google AI API Key

### Environment Variables

- NEXT_PUBLIC_APP_URL

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

- NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID
- NEXT_PUBLIC_STRIPE_CLINICAL_PRICE_ID

- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET

- MONGODB_URI

- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

- GEMINI_API_KEY


### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/medisage.git
    cd medisage
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Install backend dependencies:

    ```bash
    cd server
    pip install -r requirements.txt
    ```

4. Run development servers:

    **Frontend:**

    ```bash
    npm run dev
    ```

    **Backend:**

    ```bash
    cd server
    uvicorn main:app --reload
    ```

## API Routes

### Analysis Endpoints
- **POST /analyze/traditional** - Holistic health assessment
- **POST /analyze/body-based** - Anatomical precision analysis

### Subscription Endpoints
- **POST /api/create-checkout-session** - Create Stripe checkout session
- **POST /api/verify-subscription** - Verify user subscription status
- **GET /api/check-analysis-limit** - Check user's daily analysis limit

## Subscription Plans

### Free Tier
- Access to Holistic Health Assessment
- 5 analyses per day
- Basic health insights

### Premium Plan
- Unlimited Holistic Health Assessments
- Priority processing
- Detailed health recommendations

### Clinical Plan
- All Premium features
- Access to Anatomical Precision Analysis
- Comprehensive health insights
- Professional-grade analysis reports

## Acknowledgments

- Clerk for authentication
- Stripe for payment processing
- Google AI for Gemini 1.5 model
- shadcn/ui for UI components

## Contact

Garvit Nag - garvitcpp@gmail.com



