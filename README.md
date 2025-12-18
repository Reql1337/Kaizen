# 🌱 Kaizen: 1% Better Every Day

A cozy, calm self-improvement app focusing on tiny daily progress.

## Hosting on GitHub

1. Create a new repository on GitHub.
2. Go to **Settings > Secrets and variables > Actions**.
3. Create a **New repository secret** named `API_KEY`.
4. Paste your Google Gemini API Key into that secret.
5. Push this folder to your repository:
   ```bash
   git init
   git add .
   git commit -m "Deploy Kaizen"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
6. Go to **Settings > Pages** and ensure the source is set to **GitHub Actions**.

Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/` shortly after the Action finishes!