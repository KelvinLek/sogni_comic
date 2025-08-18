// script.js (Character page)
// Responsibilities:
// - Generate 5 sample character images from a text prompt
// - Allow image selection and preview
// - Auto-scroll to generated images and selection
// - Persist selected character + prompt to localStorage and navigate to storyline page

// Function definitions
function displayImages(prompt, imagesGrid, imagesSection, selectionSection, selectedImageData, sampleImages) {
    imagesGrid.innerHTML = '';
    
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
    
    // Navigate to storyline page
    window.location.href = '../storyline/storyline.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const characterPrompt = document.getElementById('characterPrompt');
    const generateBtn = document.getElementById('generateBtn');
    const imagesGrid = document.getElementById('imagesGrid');
    const imagesSection = document.getElementById('imagesSection');
    const selectionSection = document.getElementById('selectionSection');

    // Sample images data (for demo purposes)
    const sampleImages = [
        { src: '../assets/images/Sample1.png', title: 'Character Variation 1', description: 'A unique interpretation of your character' },
        { src: '../assets/images/Sample2.png', title: 'Character Variation 2', description: 'Another creative take on your vision' },
        { src: '../assets/images/Sample3.png', title: 'Character Variation 3', description: 'A different artistic style' },
        { src: '../assets/images/Sample4.png', title: 'Character Variation 4', description: 'An alternative character design' },
        { src: '../assets/images/Sample5.png', title: 'Character Variation 5', description: 'The final character option' }
    ];

    let selectedImageData = { value: null };

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        const prompt = characterPrompt.value.trim();
        
        if (!prompt) {
            alert('Please enter a character description first!');
            return;
        }

        // Show loading state
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;

        // Simulate generation time (in real app, this would be an API call)
        setTimeout(() => {
            displayImages(prompt, imagesGrid, imagesSection, selectionSection, selectedImageData, sampleImages);
            generateBtn.textContent = 'Generate Images';
            generateBtn.disabled = false;
        }, 1500);
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
    const samplePrompts = [
        "A young female warrior with silver hair, blue eyes, wearing leather armor, holding a glowing sword",
        "A wise old wizard with a long white beard, wearing blue robes, holding a magical staff",
        "A fierce dragon with red scales, golden eyes, and wings spread wide",
        "A mysterious elf archer with green eyes, wearing forest camouflage, carrying a bow",
        "A brave knight in shining armor with a red cape, holding a shield and sword"
    ];

    // Add sample prompt buttons (optional enhancement)
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
