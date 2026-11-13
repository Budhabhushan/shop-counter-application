Shop Counter
A small shop application built using Next.js App Router, React,TypeScript, and Tailwind CSS.

Requirements
. Node.js 22 or compatible supported LTS version
. npm

Installation
git clone (https://github.com/Budhabhushan/shop-counter-application.git)
cd shop-counter
npm install

Development
npm run dev

Open http://localhost:3000.

Production
npm run build
npm run start

Tests
Unit and component tests:
npm run test

End-to-end tests:
npx playwright install
npm run test:e2e

Shared Validation
File: src/lib/validation.ts
Function: validatePayment
Both payment preview and payment recording use this shared validation function.

API Routes
. GET /api/catalog
. GET /api/debug/reads
. GET /api/payments
. POST /api/payments/preview
. POST /api/payments
. POST /api/checkout/begin
. POST /api/checkout/complete

Architecture
See ARCHITECTURE.md.

Time Spent
Actual time spent: I spent approximately 7.5–8 hours completing the application, focusing on implementing the core functionality, maintaining clean and reusable code, and ensuring the application works as expected.

AI Tools
Tools used: ChatGPT and i have used the GitCopilot to fix the CI/CD Git Hub actions related issues.
and use to fix some desing related issue.
One disagreement with AI output: I disagreed with the AI's suggestion to use client-side state for managing the checkout payment snapshot because I felt the payment amount and order details should be controlled by the server to prevent users from manipulating them. I implemented the snapshot logic on the server so that the final order is created using trusted server-side data, even if the cart changes after payment starts.

### GitHub Actions – CI/CD

I implemented a GitHub Actions workflow to automate the application's CI/CD process.
The workflow is configured to run automatically when code is pushed to the configured branch or when a pull request is created.
**Key activities:**

- Automated dependency installation.
- Application build verification.
- Automated checks through the configured workflow.
- Early identification of build errors before deployment.

This helps maintain code quality and reduces manual effort during the development and deployment process.

Limitations
The application uses in-memory server-side storage. Data resets when the server process restarts and is not shared across separate serverless instances.

<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# shop-counter-application -->
