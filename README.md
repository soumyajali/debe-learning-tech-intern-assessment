This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Feature: Parent Tutoring Session Rescheduling

**Architecture:**
Next.js frontend
↓
Typed reschedule request
↓
Mock Firebase Cloud Function
↓
Typed validation response

### Timezone Architecture
The parent selects a date/time in their browser's local timezone.
The frontend converts that value to UTC before sending the request.
The mocked backend validates the UTC value.
The UI displays local time for the parent.

### Two-Hour Policy
Tutoring requests require at least two hours of lead time. This allows teachers to adequately prepare for new slots and prevents last-minute schedule scrambling. The UI disables these slots for better UX, and the mocked backend enforces the same rule.

### Run locally

```bash
npm run dev
```

Then open the application at `http://localhost:3000` when the server is available. If the port is blocked in the current environment, run the command with a different port such as `3001`.

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
