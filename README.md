# Sogni Comic

**Sogni Comic** is an interactive web app that lets you describe a character, choose a comic-inspired art style, and generate unique AI images for your character and their storylines. Select your favorite images, build a visual story, and download your complete comic adventure—all powered by [Sogni AI](https://sogni.ai).

---

## Features

- Describe your own comic character and select from multiple art styles
- Generate AI-powered images for your character and story scenes
- Build a visual storyline by selecting your favorite images
- Download your complete comic adventure
- Mobile-friendly and easy to use

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- npm (comes with Node.js)

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/KelvinLek/sogni_comic.git
cd sogni_comic
```

### 2. Install Backend Dependencies

```sh
cd backend
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `backend` folder with your Sogni credentials:

```
SOGNI_USERNAME="your_username"
SOGNI_PASSWORD="your_password"
SOGNI_APP_ID="your_app_id"
```

> **Note:** Never share your `.env` file or credentials publicly.

### 4. Start the Backend Server

```sh
npm start
```
The backend will run on [http://localhost:5000](http://localhost:5000).

### 5. Install Frontend Dependencies

Open a new terminal, then:

```sh
cd frontend/sogni-comic
npm install
```

### 6. Start the Frontend Development Server

```sh
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

---

## Usage

1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Enter a character description and select a style.
3. Generate and select your favorite character image.
4. Continue to the storyline page, write scene prompts, and generate storyline images.
5. Select images for each scene and view/download your final comic story.

---

## Troubleshooting

- Make sure both backend and frontend servers are running.
- Ensure your `.env` file is correctly set up in the backend folder.
- If you encounter CORS or network errors, check that the backend is running on port 5000 and the frontend is using the correct proxy settings.

---

## Credits

- Powered by [Sogni AI](https://sogni.ai)
