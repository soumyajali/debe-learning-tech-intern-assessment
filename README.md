This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Session Reschedule Widget

This workspace includes a small parent-facing tutoring portal widget that lists the student's next three sessions and lets the parent request a reschedule for any of them.

The UI reads a mock session list and renders subject, teacher, date/time, status, and a reschedule action. The selection opens a focused form with separate local date and time fields. The values represent the parent’s local browser time. The form converts the local selection through the browser's `Date` APIs to an ISO UTC value before sending the payload to the local Firebase-style function stub.

The Cloud Function-style implementation is a local mock at [src/functions/requestReschedule.ts](src/functions/requestReschedule.ts). It accepts a typed `RescheduleRequest` and returns a typed `RescheduleResponse` with a `success` flag and optional `error` message. The validation is enforced inside the function as well as at the client boundary.

### Implementation Decisions

- Local time → UTC handling: The parent sees a local date and time, the UI combines them, and `toISOString()` normalizes that selection to a UTC ISO string.
- UTC → display handling: The workflow keeps session datetimes as UTC strings and uses `new Date(utcIso).toLocaleString()`/`Intl.DateTimeFormat` for parent-local rendering.
- Two-hour lead time: The UI and backend validate that a reschedule should be at least two hours ahead of the current moment. That business rule is documented directly in the code.
- Validation: The function checks for invalid date, past times, identical slot attempts, session existence, invalid reason, and the two-hour policy guard. The client also catches invalid values before submitting.

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
