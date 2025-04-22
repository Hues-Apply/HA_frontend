# Hues Apply – Landing Page

This repository contains the frontend code for the **Hues Apply** landing page. The goal is to deliver a clean, responsive, and high-converting landing experience based on the approved designs.

## 🚀 Project Goals

* Pixel-perfect implementation of the provided design
* Fully responsive across all devices
* Clean code structure for collaboration and scalability
* Fast, smooth performance

## 📍 Repo URL

[https://github.com/Hues-Apply/HA_frontend](https://github.com/Hues-Apply/HA_frontend)

## 🧑‍💻 Assigned Sections

| Developer                 | Sections                            |
| ------------------------- | ----------------------------------- |
| **Himanshu Golyan** | Hero section, Navbar, Collaboration |
| **Sanskriti**       | How it works, Testimonials          |
| **Ebenezer**        | Premium services, FAQ               |
| **Sayandeep Dutta** | Your next opportunity, Footer       |

## 🛠️ Tech Stack

* Framework: React (Vite + TypeScript)
* Styling: TailwindCSS
* Version Control: Git + GitHub

## 📁 Folder Structure & Conventions

We are keeping the structure simple and scalable. Here’s the layout:

```bash
src/
├── assets/   
├── components/   
├── sections/    
│   ├── Hero/
│   ├── PremiumServices/
│   └── ...
├── services/       
├── App.tsx
└── main.tsx
```



* Each section of the landing page lives in `sections/`, under its own folder.
* Reusable elements go under `components/`.
* Use TailwindCSS for styling. No external UI libraries unless approved.
* Keep things modular, clean, and avoid nesting things too deep.

## 📦 Setup Instructions

1. Clone the repo

   `git clone https://github.com/Hues-Apply/HA_frontend.git && cd HA_frontend`
2. Install dependencies

   `npm install`
3. Run the development server

   `npm run dev`

## 🔀 Branching & PR Workflow (IMPORTANT)

To avoid conflicts and broken code:

* DO NOT push directly to the `main` branch.
* Create a feature branch for your section:

  `git checkout -b feat/your-section-name`
* Push your branch:

  `git push origin feat/your-section-name`
* Open a Pull Request to `main` and assign **Ebenezer** for review.
* Merge only after approval.

## ✅ Coding Guidelines

* Match the design exactly (spacing, fonts, colors)
* Keep components reusable and clean
* Test responsiveness on mobile and desktop
* Use clear, meaningful commit messages
* Remove unused or commented-out code

## 🤝 Need Help?

Reach out to **Ebenezer** or **@Abena** for questions or blockers.
