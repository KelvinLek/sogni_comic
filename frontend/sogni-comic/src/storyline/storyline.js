// storyline.js (Storyline page)
// Responsibilities:
// - Read selected character data from localStorage
// - Generate storyline images from a text prompt via backend API
// - Allow image selection with preview
// - Auto-scroll to generated images and to selection section
// - Save selection and either navigate to final page or reset for next storyline

import axios from "axios";

let storylineImages = []; // Stored selections across storylines (persisted)
let currentStorylinePrompt = '';
let currentSelectedStorylineImage = null; // Current selection before saving

document.addEventListener('DOMContentLoaded', function() {
    // Load character data from localStorage
    const characterData = JSON.parse(localStorage.getItem('sogniCharacterData') || '{}');
    
    if (!characterData.image) {
        // No character data, redirect back to main page
        window.location.href = '../index/index.html';
        return;
    }

    // Load any existing storyline images (in case of navigation back-and-forth)
    const existingStorylines = JSON.parse(localStorage.getItem('sogniStorylineImages') || '[]');
    storylineImages = Array.isArray(existingStorylines) ? existingStorylines : [];

    // Display character information
    displayCharacterInfo(characterData);

    // Show last selected storyline image if it exists
    showLastStorylineSelection();

    // Render all previous storyline selections
    renderPreviousStorylines();

    // Set up event listeners
    setupEventListeners();
});

function displayCharacterInfo(characterData) {
    const characterImg = document.getElementById('selectedCharacterImg');
    const characterDescription = document.getElementById('characterDescription');
    
    if (characterImg) {
        characterImg.src = characterData.image.src;
        characterImg.alt = characterData.image.title;
    }
    
    if (characterDescription) {
        characterDescription.textContent = characterData.prompt;
    }
}

function setupEventListeners() {
    const generateStorylineBtn = document.getElementById('generateStorylineBtn');
    const storylinePrompt = document.getElementById('storylinePrompt');
    const viewFinalBtn = document.getElementById('viewFinalBtn');
    const nextStorylineBtn = document.getElementById('nextStorylineBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Generate storyline image button
    if (generateStorylineBtn) {
        generateStorylineBtn.addEventListener('click', function() {
            const prompt = storylinePrompt.value.trim();
            
            if (!prompt) {
                alert('Please enter a storyline first!');
                return;
            }

            currentStorylinePrompt = prompt;
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.classList.add('active');
            }
            generateStorylineImage(prompt);
        });
    }

    // View final product button
    if (viewFinalBtn) {
        viewFinalBtn.addEventListener('click', function() {
            if (currentSelectedStorylineImage) {
                saveCurrentSelection();
            }
            navigateToFinalPage();
        });
    }

    // Next storyline button
    if (nextStorylineBtn) {
        nextStorylineBtn.addEventListener('click', function() {
            if (!currentSelectedStorylineImage) {
                alert('Please select a storyline image first!');
                return;
            }
            saveCurrentSelection();
            // After saving, reset for next storyline and keep previous selections visible
            resetForNextStoryline();
        });
    }

    // Enter key handler for storyline textarea
    if (storylinePrompt) {
        storylinePrompt.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateStorylineBtn.click();
            }
        });
    }
}

async function generateStoryline(prompt) {
    // Get all previous storyline images
    const storylineImagesRaw = JSON.parse(localStorage.getItem('sogniStorylineImages') || '[]');
    let imageUrl;

    if (Array.isArray(storylineImagesRaw) && storylineImagesRaw.length > 0) {
        // Use the last selected storyline image as reference
        const last = storylineImagesRaw[storylineImagesRaw.length - 1];
        imageUrl = last && last.image ? last.image.src : undefined;
    } else {
        // Use the character image as reference for the first storyline
        const characterData = JSON.parse(localStorage.getItem('sogniCharacterData') || '{}');
        imageUrl = characterData.image ? characterData.image.src : undefined;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/generate', { prompt, imageUrl });
        if (Array.isArray(response.data.images)) {
            return response.data.images.map((url, idx) => ({
                src: url,
                title: `Storyline Variation ${idx + 1}`,
                description: 'A unique interpretation of your storyline'
            }));
        }
        return [];
    } catch (error) {
        console.error('Error generating storyline images:', error);
        alert('Failed to generate storyline images. Please try again.');
        return [];
    }
}

function generateStorylineImage(storylinePrompt) {
    const generateStorylineBtn = document.getElementById('generateStorylineBtn');
    const storylineImagesSection = document.getElementById('storylineImagesSection');
    const storylineImagesGrid = document.getElementById('storylineImagesGrid');
    const selectionSection = document.getElementById('storylineSelectionSection');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Reset current selection UI for this generation
    currentSelectedStorylineImage = null;
    if (selectionSection) selectionSection.style.display = 'none';

    // Show loading state
    generateStorylineBtn.textContent = 'Generating...';
    generateStorylineBtn.disabled = true;

    // Call the backend API
    generateStoryline(storylinePrompt).then((storylineSampleImages) => {
        // Clear and populate the grid
        if (storylineImagesGrid) {
            storylineImagesGrid.innerHTML = '';
            if (!storylineSampleImages.length) {
                storylineImagesGrid.innerHTML = '<p class="error-text">No images generated. Please try again.</p>';
            } else {
                storylineSampleImages.forEach((image, index) => {
                    const imageCard = createStorylineImageCard(image, index);
                    storylineImagesGrid.appendChild(imageCard);
                });
            }
        }

        // Show the storyline section
        if (storylineImagesSection) storylineImagesSection.style.display = 'block';

        // Smooth scroll to generated images
        if (storylineImagesSection && typeof storylineImagesSection.scrollIntoView === 'function') {
            storylineImagesSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Reset button state
        generateStorylineBtn.textContent = 'Generate Storyline Image';
        generateStorylineBtn.disabled = false;
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
            loadingOverlay.style.display = 'none';
        }
    });
}

function createStorylineImageCard(imageData, index) {
    const card = document.createElement('div');
    card.className = 'image-card storyline-image-card';
    card.dataset.index = index;

    card.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.title}" loading="lazy">
        <div class="image-info">
            <h3>${imageData.title}</h3>
            <p>${imageData.description}</p>
        </div>
    `;

    // Add click handler for selection
    card.addEventListener('click', function() {
        selectStorylineImage(imageData, card);
    });

    return card;
}

function selectStorylineImage(imageData, cardElement) {
    // Remove previous selection in the grid
    const allCards = document.querySelectorAll('.storyline-image-card');
    allCards.forEach(card => card.classList.remove('selected'));

    // Highlight selected card
    cardElement.classList.add('selected');

    // Store current selection
    currentSelectedStorylineImage = imageData;

    // Update selection preview UI
    const selectionSection = document.getElementById('storylineSelectionSection');
    const selectedImage = document.getElementById('selectedStorylineImage');
    if (selectedImage) {
        selectedImage.innerHTML = `<img src="${imageData.src}" alt="${imageData.title}">`;
    }
    if (selectionSection) selectionSection.style.display = 'block';

    // Smooth scroll to the selection section (preview + buttons)
    if (selectionSection && typeof selectionSection.scrollIntoView === 'function') {
        selectionSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function saveCurrentSelection() {
    if (!currentSelectedStorylineImage || !currentStorylinePrompt) return;
    const storylineData = {
        storylineId: String(Date.now()),
        prompt: currentStorylinePrompt,
        image: currentSelectedStorylineImage
    };
    storylineImages.push(storylineData);
    localStorage.setItem('sogniStorylineImages', JSON.stringify(storylineImages));
    renderPreviousStorylines();
}

function resetForNextStoryline() {
    // Clear prompt and focus for next entry
    const promptEl = document.getElementById('storylinePrompt');
    if (promptEl) {
        promptEl.value = '';
        promptEl.focus();
    }
    // Hide images grid, but keep previous selections visible
    const imagesSection = document.getElementById('storylineImagesSection');
    const imagesGrid = document.getElementById('storylineImagesGrid');
    if (imagesSection) imagesSection.style.display = 'none';
    if (imagesGrid) imagesGrid.innerHTML = '';

    // Reset current selection and prompt state for new generation
    currentSelectedStorylineImage = null;
    currentStorylinePrompt = '';

    // Show last selection if it exists (optional, but not needed since previous selections are always shown)
    // showLastStorylineSelection();
}

function navigateToFinalPage() {
    // Ensure we have at least one saved storyline
    const saved = JSON.parse(localStorage.getItem('sogniStorylineImages') || '[]');
    if ((!saved || saved.length === 0) && !currentSelectedStorylineImage) {
        alert('Please generate and select at least one storyline image first!');
        return;
    }
    window.location.href = '../final/final.html';
}

function showLastStorylineSelection() {
    const storylineImagesRaw = JSON.parse(localStorage.getItem('sogniStorylineImages') || '[]');
    const selectionSection = document.getElementById('storylineSelectionSection');
    const selectedImage = document.getElementById('selectedStorylineImage');
    if (Array.isArray(storylineImagesRaw) && storylineImagesRaw.length > 0) {
        const last = storylineImagesRaw[storylineImagesRaw.length - 1];
        if (last && last.image) {
            currentSelectedStorylineImage = last.image;
            currentStorylinePrompt = last.prompt || '';
            if (selectedImage) {
                selectedImage.innerHTML = `<img src="${last.image.src}" alt="${last.image.title}">`;
            }
            if (selectionSection) selectionSection.style.display = 'block';
            return;
        }
    }
    // Hide if no previous selection
    if (selectionSection) selectionSection.style.display = 'none';
    if (selectedImage) selectedImage.innerHTML = '';
}

function renderPreviousStorylines() {
    const previousStorylinesGrid = document.getElementById('previousStorylinesGrid');
    if (!previousStorylinesGrid) return;
    previousStorylinesGrid.innerHTML = '';
    const storylineImagesRaw = JSON.parse(localStorage.getItem('sogniStorylineImages') || '[]');
    if (Array.isArray(storylineImagesRaw) && storylineImagesRaw.length > 0) {
        storylineImagesRaw.forEach((item, idx) => {
            if (item.image && item.image.src) {
                const card = document.createElement('div');
                card.className = 'image-card previous-storyline-card';
                card.innerHTML = `
                    <img src="${item.image.src}" alt="Storyline ${idx + 1}" loading="lazy">
                    <div class="image-info">
                        <h3>Storyline ${idx + 1}</h3>
                        <p>${item.prompt || ''}</p>
                    </div>
                `;
                previousStorylinesGrid.appendChild(card);
            }
        });
    } else {
        previousStorylinesGrid.innerHTML = '<p>No storyline images selected yet.</p>';
    }
}