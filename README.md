# Crypto Market View

A modern cryptocurrency market viewer application built with **React**, **Redux Toolkit (RTK Query)**, and the **CoinGecko API**, leveraging AI-assisted development tools for rapid prototyping and deployment.

---

## 🚀 Project Overview

This project demonstrates how AI-assisted tools can accelerate full-stack development while maintaining production-quality standards. The application provides live cryptocurrency market data, charts, and details fetched from the free [CoinGecko API](https://www.coingecko.com/en/api).

The frontend was generated and refined using multiple AI code-generation platforms, and the final solution was deployed to **AWS S3** for scalability and ease of distribution.

---

## 🛠️ Development Process

### 1. Requirement Gathering & Prompt Engineering

* Converted raw requirements into a structured prompt using **AI Studio (Gemini)**.
* Iteratively refined prompts to achieve high-quality, context-aware outputs.

### 2. AI Tooling for Prototyping

Several AI-assisted platforms were tested to evaluate their capabilities:

* **bolt.new**

  * ✅ Generated a working app using **Next.js** and **Redux Toolkit**.
  * ✅ Successfully integrated the CoinGecko free API.
  * ⚠️ UI/UX design was functional but lacked refinement.

* **lovable.dev**

  * ✅ Delivered the best design aesthetics.
  * ⚠️ Could not generate a **Next.js** project.
  * ⚠️ Relied on mock data instead of a live API.

* **rocket.new** & **v0.app**

  * ✅ Produced functional React apps with decent structure.
  * ⚠️ Design quality was inferior to **lovable.dev**.

### 3. Code Integration & Enhancement

* Took the **UI design from lovable.dev** as the base.
* Replaced mock data with live data from the **CoinGecko API**.
* Implemented **Redux Toolkit with RTK Query** for efficient state management and API interaction.
* Fixed multiple issues related to API integration and data mapping.

### 4. Deployment

* Built and deployed the final React application on **AWS S3**.
* Configured for optimized delivery and scalability.

---

## 📌 Remarks

* My professional preference is to use **Next.js** for production-grade applications due to its superior routing, SSR, and SEO capabilities.
* However, since **lovable.dev** generated an excellent design in **React**, I decided to retain React for this iteration to save conversion time.
* Future iterations may involve migrating this project to **Next.js** while preserving the design language.

---

## ⚡ Tech Stack

* **Frontend:** React, Redux Toolkit (RTK Query), TailwindCSS
* **API:** CoinGecko (free API)
* **AI Tools Used:** Gemini, bolt.new, lovable.dev, rocket.new, v0.app
* **Deployment:** AWS S3

---

## 🔮 Future Improvements

* Migrate to **Next.js** for improved SEO and server-side rendering.
* Enhance charting with additional analytics and historical data.
* Add authentication and user dashboards for personalized tracking.
* Improve CI/CD pipelines for automated deployments.
