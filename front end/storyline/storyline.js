// storyline.js (Storyline page)
// Responsibilities:
// - Read selected character data from localStorage
// - Generate 5 sample storyline images from a text prompt
// - Allow image selection with preview
// - Auto-scroll to generated images and to selection section
// - Save selection and either navigate to final page or reset for next storyline

// Storyline page functionality
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

	// Generate storyline image button
	if (generateStorylineBtn) {
		generateStorylineBtn.addEventListener('click', function() {
			const prompt = storylinePrompt.value.trim();
			
			if (!prompt) {
				alert('Please enter a storyline first!');
				return;
			}

			currentStorylinePrompt = prompt;
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

function generateStorylineImage(storylinePrompt) {
	const generateStorylineBtn = document.getElementById('generateStorylineBtn');
	const storylineImagesSection = document.getElementById('storylineImagesSection');
	const storylineImagesGrid = document.getElementById('storylineImagesGrid');
	const selectionSection = document.getElementById('storylineSelectionSection');

	// Reset current selection UI for this generation
	currentSelectedStorylineImage = null;
	if (selectionSection) selectionSection.style.display = 'none';

	// Show loading state
	generateStorylineBtn.textContent = 'Generating...';
	generateStorylineBtn.disabled = true;

	// Simulate generation time (in real app, this would be an API call)
	setTimeout(() => {
		// For demo purposes, use the same sample images but with different titles
		const storylineSampleImages = [
			{ src: '../assets/images/Sample1.png', title: 'Story Scene 1', description: 'A dramatic moment from your story' },
			{ src: '../assets/images/Sample2.png', title: 'Story Scene 2', description: 'Another key scene from your narrative' },
			{ src: '../assets/images/Sample3.png', title: 'Story Scene 3', description: 'A pivotal moment in your tale' },
			{ src: '../assets/images/Sample4.png', title: 'Story Scene 4', description: 'An emotional scene from your story' },
			{ src: '../assets/images/Sample5.png', title: 'Story Scene 5', description: 'The climax of your narrative' }
		];

		// Clear and populate the grid
		if (storylineImagesGrid) {
			storylineImagesGrid.innerHTML = '';
			storylineSampleImages.forEach((image, index) => {
				const imageCard = createStorylineImageCard(image, index);
				storylineImagesGrid.appendChild(imageCard);
			});
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
	}, 1200);
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
}

function resetForNextStoryline() {
	// Clear prompt and focus for next entry
	const promptEl = document.getElementById('storylinePrompt');
	if (promptEl) {
		promptEl.value = '';
		promptEl.focus();
	}
	// Hide sections and clear grid
	const selectionSection = document.getElementById('storylineSelectionSection');
	const imagesSection = document.getElementById('storylineImagesSection');
	const imagesGrid = document.getElementById('storylineImagesGrid');
	if (selectionSection) selectionSection.style.display = 'none';
	if (imagesSection) imagesSection.style.display = 'none';
	if (imagesGrid) imagesGrid.innerHTML = '';
	// Reset current selection and prompt state
	currentSelectedStorylineImage = null;
	currentStorylinePrompt = '';
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
