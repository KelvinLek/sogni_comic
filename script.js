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

function displayStorylineSection(storylineSection, selectedImageData) {
    if (storylineSection) {
        storylineSection.style.display = 'block';
        storylineSection.scrollIntoView({ behavior: 'smooth' });
        
        // Display the selected character image in the storyline section
        const characterPreview = storylineSection.querySelector('.character-preview img');
        if (characterPreview && selectedImageData.value) {
            characterPreview.src = selectedImageData.value.src;
            characterPreview.alt = selectedImageData.value.title;
        }
    }
}

function generateStorylineImage(storylinePrompt, storylineImagesGrid, storylineImagesSection, selectedStorylineImageData, selectedImageData) {
    storylineImagesGrid.innerHTML = '';
    
    // For demo purposes, use the same sample images but with different titles
    const storylineSampleImages = [
        { src: 'Sample Images/Sample1.png', title: 'Story Scene 1', description: 'A dramatic moment from your story' },
        { src: 'Sample Images/Sample2.png', title: 'Story Scene 2', description: 'Another key scene from your narrative' },
        { src: 'Sample Images/Sample3.png', title: 'Story Scene 3', description: 'A pivotal moment in your tale' },
        { src: 'Sample Images/Sample4.png', title: 'Story Scene 4', description: 'An emotional scene from your story' },
        { src: 'Sample Images/Sample5.png', title: 'Story Scene 5', description: 'The climax of your narrative' }
    ];
    
    storylineSampleImages.forEach((image, index) => {
        const imageCard = createStorylineImageCard(image, index, selectedStorylineImageData, selectedImageData);
        storylineImagesGrid.appendChild(imageCard);
    });

    storylineImagesSection.style.display = 'block';
}

function createStorylineImageCard(imageData, index, selectedStorylineImageData, selectedImageData) {
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
        selectStorylineImage(imageData, card, selectedStorylineImageData, selectedImageData);
    });

    return card;
}

function selectStorylineImage(imageData, cardElement, selectedStorylineImageData, selectedImageData) {
    // Remove previous selection
    const allCards = document.querySelectorAll('.storyline-image-card');
    allCards.forEach(card => card.classList.remove('selected'));

    // Highlight selected card
    cardElement.classList.add('selected');

    selectedStorylineImageData.value = imageData;
    
    // Show the final section
    showFinalSection(selectedImageData, selectedStorylineImageData);
}

function showFinalSection(selectedImageData, selectedStorylineImageData) {
    const finalSection = document.getElementById('finalSection');
    if (finalSection) {
        // Update the final images
        const finalCharacterImg = document.getElementById('finalCharacterImg');
        const finalStorylineImg = document.getElementById('finalStorylineImg');
        
        if (finalCharacterImg && selectedImageData && selectedImageData.value) {
            finalCharacterImg.src = selectedImageData.value.src;
            finalCharacterImg.alt = selectedImageData.value.title;
        }
        
        if (finalStorylineImg && selectedStorylineImageData && selectedStorylineImageData.value) {
            finalStorylineImg.src = selectedStorylineImageData.value.src;
            finalStorylineImg.alt = selectedStorylineImageData.value.title;
        }
        
        finalSection.style.display = 'block';
        finalSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadImages(characterImage, storylineImage) {
    // Create a zip file or download both images
    // For now, we'll create a simple download link for each image
    
    if (characterImage && storylineImage) {
        // Download character image
        const characterLink = document.createElement('a');
        characterLink.href = characterImage.src;
        characterLink.download = 'character.png';
        characterLink.click();
        
        // Download storyline image
        const storylineLink = document.createElement('a');
        storylineLink.href = storylineImage.src;
        storylineLink.download = 'storyline.png';
        storylineLink.click();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const characterPrompt = document.getElementById('characterPrompt');
    const generateBtn = document.getElementById('generateBtn');
    const imagesGrid = document.getElementById('imagesGrid');
    const imagesSection = document.getElementById('imagesSection');
    const selectionSection = document.getElementById('selectionSection');
    const storylineSection = document.getElementById('storylineSection');
    const storylineImagesSection = document.getElementById('storylineImagesSection');
    const storylineImagesGrid = document.getElementById('storylineImagesGrid');
    const finalSection = document.getElementById('finalSection');

    // Sample images data (for demo purposes)
    const sampleImages = [
        { src: 'Sample Images/Sample1.png', title: 'Character Variation 1', description: 'A unique interpretation of your character' },
        { src: 'Sample Images/Sample2.png', title: 'Character Variation 2', description: 'Another creative take on your vision' },
        { src: 'Sample Images/Sample3.png', title: 'Character Variation 3', description: 'A different artistic style' },
        { src: 'Sample Images/Sample4.png', title: 'Character Variation 4', description: 'An alternative character design' },
        { src: 'Sample Images/Sample5.png', title: 'Character Variation 5', description: 'The final character option' }
    ];

    let selectedImageData = { value: null };
    let selectedStorylineImageData = { value: null };

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
                displayStorylineSection(storylineSection, selectedImageData);
            }
        });
    }

    // Generate storyline image button
    const generateStorylineBtn = document.getElementById('generateStorylineBtn');
    if (generateStorylineBtn) {
        generateStorylineBtn.addEventListener('click', function() {
            const storylinePrompt = document.getElementById('storylinePrompt').value.trim();
            
            if (!storylinePrompt) {
                alert('Please enter a storyline first!');
                return;
            }

            // Show loading state
            generateStorylineBtn.textContent = 'Generating...';
            generateStorylineBtn.disabled = true;

            // Simulate generation time
            setTimeout(() => {
                generateStorylineImage(storylinePrompt, storylineImagesGrid, storylineImagesSection, selectedStorylineImageData, selectedImageData);
                generateStorylineBtn.textContent = 'Generate Storyline Image';
                generateStorylineBtn.disabled = false;
            }, 1500);
        });
    }

    // Done button
    const doneBtn = document.getElementById('doneBtn');
    if (doneBtn) {
        doneBtn.addEventListener('click', function() {
            if (selectedStorylineImageData.value) {
                showFinalSection(selectedImageData, selectedStorylineImageData);
            } else {
                alert('Please select a storyline image first!');
            }
        });
    }

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            if (selectedImageData.value && selectedStorylineImageData.value) {
                downloadImages(selectedImageData.value, selectedStorylineImageData.value);
            }
        });
    }

    // Enter key handler for textarea
    characterPrompt.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });

    // Enter key handler for storyline textarea
    const storylinePrompt = document.getElementById('storylinePrompt');
    if (storylinePrompt) {
        storylinePrompt.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateStorylineBtn.click();
            }
        });
    }

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
