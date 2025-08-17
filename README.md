# Sogni Comic

A comprehensive web application that allows users to create characters, generate storylines, and download their complete story package with both character and storyline images.

## Features

- **Character Description Input**: Users can write detailed descriptions of their desired character
- **Character Image Generation**: Generates 5 character variations based on descriptions
- **Character Image Selection**: Users can click on any of the 5 generated images to make their selection
- **Character Image Saving**: Selected character image is temporarily saved for the storyline process
- **Storyline Generation**: Users can write detailed storylines that their character experiences
- **Storyline Image Generation**: Generates 5 storyline images based on the story description
- **Storyline Image Selection**: Users select their preferred storyline image
- **Final Review**: Complete story package showing both character and storyline images
- **Image Download**: Download both images as separate files
- **Sample Prompts**: Convenient sample character descriptions for quick testing
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations and hover effects

## Complete User Workflow

1. **Character Creation Phase**

   - Enter character description in the text area
   - Click "Generate Images" to see 5 character variations
   - Select your preferred character image
   - Click "Continue to Storyline" to proceed

2. **Storyline Generation Phase**

   - View your selected character in the preview
   - Write a detailed storyline description
   - Click "Generate Storyline Image" to create 5 story scenes
   - Select your preferred storyline image
   - Click "Done" to complete the process

3. **Final Review & Download**
   - Review both your character and storyline images together
   - Click "Download Images" to save both images to your device

## Demo Images

The website currently uses 5 sample images located in the `Sample Images/` folder:

- Sample1.png
- Sample2.png
- Sample3.png
- Sample4.png
- Sample5.png

These images are used for both character generation and storyline generation (with different titles and descriptions).

## How to Use

1. **Open the Website**: Open `index.html` in your web browser
2. **Create Character**: Write a detailed character description and generate images
3. **Select Character**: Click on your preferred character image and continue
4. **Write Storyline**: Describe the story your character experiences
5. **Generate Storyline**: Create storyline images based on your description
6. **Select Storyline**: Choose your preferred storyline image
7. **Download Package**: Download both images to complete your story

## Quick Start with Sample Prompts

Use the provided sample prompt buttons for quick testing:

- **Warrior**: A young female warrior with silver hair, blue eyes, wearing leather armor
- **Wizard**: A wise old wizard with a long white beard, wearing blue robes
- **Dragon**: A fierce dragon with red scales, golden eyes, and wings spread wide
- **Archer**: A mysterious elf archer with green eyes, wearing forest camouflage
- **Knight**: A brave knight in shining armor with a red cape

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks required)
- **Responsive**: CSS Grid and Flexbox for responsive layouts
- **Animations**: CSS transitions and transforms for smooth interactions
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Image Handling**: Automatic image selection, preview, and download functionality
- **State Management**: Temporary storage of selected images throughout the process

## File Structure

```
sogni_comic/
├── index.html          # Main HTML file with complete workflow
├── styles.css          # CSS styling for all sections
├── script.js           # JavaScript functionality for the complete process
├── Sample Images/      # Sample character and storyline images
│   ├── Sample1.png
│   ├── Sample2.png
│   ├── Sample3.png
│   ├── Sample4.png
│   └── Sample5.png
└── README.md           # This file
```

## New Sections Added

- **Character Selection Section**: Shows selected character with continue button
- **Storyline Section**: Character preview and storyline input
- **Storyline Images Section**: 5 storyline image variations
- **Final Section**: Complete story package display
- **Download Functionality**: Save both images to device

## Future Enhancements

- Integration with AI image generation APIs (e.g., DALL-E, Midjourney)
- User account system to save favorite characters and stories
- Character customization options and variations
- Multiple storyline generation options
- Export functionality for different image formats
- Social sharing features for completed stories
- Story templates and genre-specific prompts
- Character and story library management

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Getting Started

1. Clone or download this repository
2. Ensure all files are in the same directory
3. Open `index.html` in your web browser
4. Start creating your character and storyline!

## License

This project is open source and available under the MIT License.
