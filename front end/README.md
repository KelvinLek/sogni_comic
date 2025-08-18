# Sogni Comic

A simple multi-page web app to create a character, generate multiple storyline images, and download the final set.

## Features

- **Character generation**: Enter a description and get 5 character variations
- **Character selection**: Click to select; proceed to the storyline page
- **Storyline generation**: Enter a scene description and get 5 images
- **Storyline selection**: Click to select; then choose:
  - **View final product**: go to the final page to review/download
  - **Next storyline**: save the current selection and generate another storyline
- **Final page**: Shows the selected character image and all saved storyline selections with download options
- **Auto-scrolling**: After each generation and selection, the page scrolls to the relevant section
- **Responsive UI**

## Workflow

1. Open `index.html`
2. Enter a character description → Generate → Select one → Continue to storyline
3. On the storyline page:
   - Enter a storyline → Generate → Select one
   - Click "Next storyline" to save it and generate another, or
   - Click "View final product" to review and download
4. On the final page:
   - Download the character image and each storyline image (or download all)
   - Start over if desired

## Data Handling

- The app uses `localStorage` to pass the selected character and storyline images between pages.
- Clearing browser storage will remove the in-progress selections.

## Sample Images

Demo images are in `Sample Images/` and are reused for both character and storyline generations.

- Sample1.png
- Sample2.png
- Sample3.png
- Sample4.png
- Sample5.png

## File Structure (current)

```
sogni_comic/
└── front end/
    ├── index/
    │   ├── index.html         # Character page
    │   └── script.js          # Character page logic
    ├── storyline/
    │   ├── storyline.html     # Storyline page
    │   └── storyline.js       # Storyline page logic
    ├── final/
    │   ├── final.html         # Final review page
    │   └── final.js           # Final page logic
    └── assets/
        ├── styles/
        │   └── styles.css     # Shared styles
        └── images/
            ├── Sample1.png
            ├── Sample2.png
            ├── Sample3.png
            ├── Sample4.png
            └── Sample5.png
```

## Getting Started

1. Clone or download the repository
2. Open `index.html` in your browser
3. Follow the workflow above

## Notes

- This is a front-end-only demo using placeholder images and simulated generation delays.
- You can replace the sample images and extend the logic to call a real image generation API.

## License

MIT
