import axios from 'axios';
import {backendIP} from 'configs.js';

// Reset progress when index.html is loaded
localStorage.removeItem('sogniCharacterData');
localStorage.removeItem('sogniStorylineImages');

// Get style from dropdown or localStorage
function getSelectedStyle() {
    // Try to get from dropdown if it exists
    const styleSelect = document.getElementById('styleSelect');
    if (styleSelect) {
        return styleSelect.value;
    }
    // Fallback to localStorage or default
    return localStorage.getItem('sogniStyle') || 'comic';
}


async function generateCharacter(prompt) {
    console.log('[generateCharacter] Called with prompt:', prompt);
    const style = getSelectedStyle();
    try {
        const response = await axios.post('http://'+backendIP+':5000/api/generate', { prompt, style });
        console.log('[generateCharacter] API response:', response.data);
        // Expecting response.data.images to be an array of image URLs (strings)
        if (Array.isArray(response.data.images)) {
            // Map URLs to objects for UI rendering
            return response.data.images.map((url, idx) => ({
                src: url,
                title: `Character Variation ${idx + 1}`,
                description: 'A unique interpretation of your character'
            }));
        }
        return [];
    } catch (error) {
        console.error('Error generating character images:', error);
        alert('Failed to generate character images. Please try again.');
        return [];
    }
}

function displayImages(prompt, imagesGrid, imagesSection, selectionSection, selectedImageData) {
    console.log('[displayImages] Called with prompt:', prompt);
    imagesGrid.innerHTML = '';

    generateCharacter(prompt).then((sampleImages) => {
        console.log('[displayImages] Images received:', sampleImages);
        if (!sampleImages.length) {
            imagesGrid.innerHTML = '<p class="error-text">No images generated. Please try again.</p>';
            return;
        }
        sampleImages.forEach((image, index) => {
            const imageCard = createImageCard(image, index, selectedImageData, selectionSection);
            imagesGrid.appendChild(imageCard);
        });

        imagesSection.style.display = 'block';
        selectionSection.style.display = 'none';
        selectedImageData.value = null;

        // Smooth scroll to generated images
        if (imagesSection && typeof imagesSection.scrollIntoView === 'function') {
            imagesSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function createImageCard(imageData, index, selectedImageData, selectionSection) {
    const card = document.createElement('div');
    card.className = 'image-card';
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
        console.log('[createImageCard] Image card clicked:', imageData);
        selectImage(imageData, card, selectedImageData, selectionSection);
    });

    return card;
}

function selectImage(imageData, cardElement, selectedImageData, selectionSection) {
    // Remove previous selection
    const allCards = document.querySelectorAll('.image-card');
    allCards.forEach(card => card.classList.remove('selected'));

    // Highlight selected card
    cardElement.classList.add('selected');

    // Update selected image display
    const selectedImage = document.getElementById('selectedImage');
    if (selectedImage) {
        selectedImage.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.title}">
        `;
    }

    selectedImageData.value = imageData;
    selectionSection.style.display = 'block';

    // Smooth scroll to selection
    selectionSection.scrollIntoView({ behavior: 'smooth' });
}

function navigateToStoryline(selectedImageData, characterPrompt) {
    // Store character data in localStorage
    const characterData = {
        image: selectedImageData.value,
        prompt: characterPrompt
    };
    localStorage.setItem('sogniCharacterData', JSON.stringify(characterData));

    // Save style to localStorage for future use
    const style = getSelectedStyle();
    localStorage.setItem('sogniStyle', style);

    // Navigate to storyline page
    window.location.href = 'src/storyline/storyline.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const characterPrompt = document.getElementById('characterPrompt');
    const generateBtn = document.getElementById('generateBtn');
    const imagesGrid = document.getElementById('imagesGrid');
    const imagesSection = document.getElementById('imagesSection');
    const selectionSection = document.getElementById('selectionSection');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let selectedImageData = { value: null };

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        console.log('[generateBtn] Clicked');
        const prompt = characterPrompt.value.trim();
        
        if (!prompt) {
            alert('Please enter a character description first!');
            return;
        }

        // Show loading state
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.classList.add('active');
        }

        displayImages(prompt, imagesGrid, imagesSection, selectionSection, selectedImageData);

        // Reset button state after images are loaded (handled in displayImages)
        // We'll use a MutationObserver to re-enable the button when images are loaded
        const observer = new MutationObserver(() => {
            generateBtn.textContent = 'Generate Images';
            generateBtn.disabled = false;
            observer.disconnect();
            if (loadingOverlay) {
                loadingOverlay.classList.remove('active');
                loadingOverlay.style.display = 'none';
            }
        });
        observer.observe(imagesGrid, { childList: true });
    });

    // Continue to storyline button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (selectedImageData.value) {
                navigateToStoryline(selectedImageData, characterPrompt.value.trim());
            }
        });
    }

    // Enter key handler for textarea
    characterPrompt.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });

    // Add some sample prompts for user convenience
    addSamplePromptButtons();
});

// Add sample prompt buttons for user convenience
function addSamplePromptButtons() {
    const inputSection = document.querySelector('.input-section');
    const samplePromptsDiv = document.createElement('div');
    samplePromptsDiv.className = 'sample-prompts';
    samplePromptsDiv.innerHTML = `
        <h3>Sample Prompts</h3>
        <div class="prompt-buttons">
            <button class="prompt-btn" data-prompt="A young female warrior with silver hair, blue eyes, wearing leather armor, holding a glowing sword">Warrior</button>
            <button class="prompt-btn" data-prompt="A wise old wizard with a long white beard, wearing blue robes, holding a magical staff">Wizard</button>
            <button class="prompt-btn" data-prompt="A fierce dragon with red scales, golden eyes, and wings spread wide">Dragon</button>
            <button class="prompt-btn" data-prompt="A mysterious elf archer with green eyes, wearing forest camouflage, carrying a bow">Archer</button>
            <button class="prompt-btn" data-prompt="A brave knight in shining armor with a red cape, holding a shield and sword">Knight</button>
        </div>
    `;

    inputSection.appendChild(samplePromptsDiv);

    // Add event listeners for sample prompt buttons
    const promptButtons = document.querySelectorAll('.prompt-btn');
    promptButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prompt = this.dataset.prompt;
            document.getElementById('characterPrompt').value = prompt;
        });
    });
}