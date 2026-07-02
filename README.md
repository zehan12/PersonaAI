# Persona AI Chat

Persona AI Chat is a modern, highly interactive web application built with Next.js and the Gemini AI API. It allows you to chat with accurately simulated AI personas of famous founders, entrepreneurs, and thinkers. Each persona is engineered with a unique personality, tone of voice, knowledge base, and conversational style.

## 🚀 Features

- **Unique Personas**: Have deep, meaningful, or entertaining conversations with figures like **Elon Musk**, **Kunal Shah**, **Naval Ravikant**, and **Nikhil Viswanathan**.
- **Adjustable Tone**: Modify the tone of the AI responses dynamically (e.g., philosophical, blunt, visionary).
- **Gemini AI Integration**: Uses the powerful Gemini API to generate accurate, context-aware responses based on the individual's real-world data and views.
- **Beautiful UI**: Built with Tailwind CSS and Shadcn UI components for a modern, responsive, and sleek dark-mode-ready interface.
- **Robust State Management**: Powered by Redux Toolkit to seamlessly handle the chat history, persona settings, and API configurations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) & [React 19](https://react.dev/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **AI Integration**: Google Gemini API

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (Recommended package manager)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:zehan12/PersonaAI.git
   cd PersonaAI
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of the project and add your Gemini API Key. You can also configure the API key directly within the app's UI.
   ```bash
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   bun run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Project Structure

- `src/app`: Next.js App Router layout and pages.
- `src/components`: Reusable UI components (including Shadcn UI in `src/components/ui`).
- `src/hooks`: Custom React and Redux hooks.
- `src/lib/data`: Static data for AI personas (`personas.ts`).
- `src/lib/services`: External services, primarily the Gemini API integration.
- `src/lib/store`: Redux Toolkit setup and slices.
- `src/types`: TypeScript interfaces and definitions.

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
