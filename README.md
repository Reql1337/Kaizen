<div align="center">
  <img src="./public/logo.svg" width="210" alt="1% Kaizen Logo"/>
  <h1>Kaizen: 1% Better Every Day</h1>
  <p><strong>A cozy, minimalist self-improvement application focusing on tiny daily progress.</strong></p>
</div>

<br/>

## 🌟 Philosophy

Kaizen (improvement). The philosophy is simple: **1% better every day**. Small, consistent actions compound over time into massive personal growth. This app offers a serene, distraction-free environment to guide your daily self-improvement journey.

## ✨ Features

- **Personalized Journeys:** Choose from various domains (Fitness, Mindfulness, Creativity, etc.) and get tailored daily actions.
- **Energy-Aware:** Daily action suggestions dynamically adjust based on your current physical and mental energy levels.
- **Fluid & Calm UI/UX:** Built with a premium, tranquil design language featuring soothing colors, subtle micro-animations, and glassmorphism elements.
- **PWA Ready:** Install Kaizen directly to your home screen for a seamless, native-like experience.
- **Haptic Feedback:** Provides gentle tactile feedback (on supported devices) upon completing actions.
- **Gamified Progress:** Track your continuous improvement via beautifully crafted progress charts and history lists.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** Local Storage with structured syncing
- **Native Wrappers:** [Capacitor](https://capacitorjs.com/) (for iOS/Android build support and Haptics)
- **Icons & Graphics:** Custom inline SVGs for maximum crispness and zero loading delay.

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Hosting on GitHub Pages

Kaizen is set up to deploy beautifully on GitHub Pages using GitHub Actions.

1. **Create** a new repository on GitHub and push this project.
2. Go to your repository's **Settings > Secrets and variables > Actions**.
3. Create a **New repository secret** named `API_KEY`.
4. Paste your AI/API Service Key (e.g. Google Gemini API Key) into that secret.
5. Push the repository to the `main` branch.
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Deploy Kaizen"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
6. Go to **Settings > Pages** and ensure the Source is set to **GitHub Actions**.
   
Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/` shortly after the Action finishes!

## 📱 Mobile (Capacitor) Setup

If you wish to compile Kaizen into a native iOS or Android app:
```bash
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios    # Opens Xcode
npx cap open android # Opens Android Studio
```

---
<div align="center">
  <p>Built with intention and calm focus.</p>
</div>
