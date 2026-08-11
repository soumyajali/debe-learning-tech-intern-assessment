# Debe Learning Tech Intern Assessment Submission

## Part 1 — GitHub Portfolio Walkthrough

### 1. GitHub Profile

**Link:** https://github.com/soumyajali

---

### 2 & 3. Repository Walkthroughs

#### Repository 1 — Digital Outpass Generator

**Link:** https://github.com/soumyajali/digital_outpass_generator

**Live Demo:** https://digital-outpass-generator.vercel.app

**What problem does it solve?**

The Digital Outpass Generator is designed to digitize the process of requesting and managing student outpasses. In a traditional hostel environment, students may need to fill out physical forms and go through manual approval processes. This can make it difficult to track requests, maintain records, and manage approvals efficiently.

The application provides a digital workflow where students can submit their outpass details and generate an outpass without depending entirely on paper-based processes. It helps organize the information and makes the overall outpass process faster and easier to manage.

**What did you specifically build?**

I worked on developing the Digital Outpass Generator and its core user workflow. I designed and implemented the user interface for entering student and outpass details and structured the application so that the required information could be captured in a clear and organized way.

I implemented the functionality required to generate a digital outpass from the submitted information. I also worked on the form handling and validation so that important details are properly captured before generating the outpass.

A major focus of the project was making the workflow simple for students. Instead of manually preparing an outpass, the user can enter the required details through the application and generate a digital version that can be used for the required approval or verification process.

I also worked on the overall layout, user interactions, and presentation of the generated outpass so that the final result is clear and usable.

**One design decision you'd make differently today and why:**

One design decision I would make differently is how I initially structured the form and application logic. Keeping the form handling and some of the business logic closely connected made the first version faster to develop, but it can become difficult to maintain when more fields, validation rules, or approval workflows are added.

If I were rebuilding the project today, I would separate the form components, validation logic, outpass-generation logic, and data-handling layer more clearly. I would also design the application around reusable components and stronger validation from the beginning.

This would make it easier to extend the system later with features such as digital approval workflows, QR-code-based verification, outpass history, notifications, role-based access for students and administrators, and centralized record management.

---

#### Repository 2 — Digital Manuscript Organizer

**Link:** https://github.com/soumyajali/digital_manuscript_organizer

**Live Demo:** https://digital-manuscript-organizer.vercel.app

**What problem does it solve?**

Digital Manuscript Organizer is a web-based application designed to make historical and regional manuscripts easier to digitize, understand, and translate. Manuscripts may contain handwritten or difficult-to-read text, making manual transcription and translation time-consuming. The application provides a digital workflow for uploading manuscript content, extracting the text, and translating the extracted content into a more accessible form.

The project aims to reduce the manual effort involved in converting manuscript images into usable digital text while making the resulting content easier for users to understand and explore.

**What did you specifically build?**

I built the web application and the manuscript processing and translation workflow. The frontend was developed using React and Vite, with the interface structured into reusable components for the different stages of the workflow.

A key part of the project is the use of **Google Gemini for OCR and text extraction**. I integrated Gemini to analyze manuscript images and extract the text from them. The extracted text can then be processed through the application's translation workflow.

I worked on the interface for uploading and working with manuscript content, displaying the extracted text, and presenting the translated output. I also handled the interaction between the frontend and the AI-powered processing functionality so that the user can move through the workflow without manually transcribing the manuscript first.

I focused on making the experience straightforward: the user provides manuscript content, Gemini processes the image and extracts the relevant text, and the application uses that extracted content as the input for translation. This creates a complete workflow from manuscript image to digitally accessible translated content.

**One design decision you'd make differently today and why:**

One design decision I would make differently is how the AI processing layer is separated from the frontend. During development, keeping the workflow closely connected made it faster to build and test the OCR and translation features. However, this can make the application harder to maintain as more AI capabilities are added.

If I were rebuilding the project today, I would create a dedicated service layer for Gemini interactions and keep OCR, translation, API communication, application state, and UI components separated. I would also add stronger validation and structured error handling around AI responses because AI-generated output cannot always be assumed to follow the expected format.

This architecture would make it easier to add features such as translation history, multiple language support, improved manuscript processing, confidence or verification steps for extracted text, and additional AI-powered document analysis in the future.
