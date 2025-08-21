// final.js (Final page)
// Responsibilities:
// - Read selected character and storyline selections from localStorage
// - Deduplicate storyline selections and render them
// - Provide download for character, each storyline, and all images
// - Provide start-over flow to reset state and return to character page

// Final page functionality
document.addEventListener('DOMContentLoaded', function() {
	// Load character and storyline data from localStorage
	const characterData = JSON.parse(localStorage.getItem('sogniCharacterData') || '{}');
	const storylineImagesRaw = JSON.parse(localStorage.getItem('sogniStorylineImages') || '[]');
	
	if (!characterData.image || storylineImagesRaw.length === 0) {
		// No data, redirect back to main page
		window.location.href = '../index/index.html';
		return;
	}

	// Deduplicate storyline images so only the latest selection per storyline is kept
	const dedupedStorylines = dedupeStorylines(storylineImagesRaw);

	// Display all images
	displayFinalImages(characterData, dedupedStorylines);
	
	// Set up event listeners
	setupEventListeners(characterData, dedupedStorylines);
});

function dedupeStorylines(storylineImagesRaw) {
	// Compute last index per storyline key (prefer storylineId; fallback to prompt)
	const lastIndexByKey = {};
	storylineImagesRaw.forEach((item, index) => {
		const key = item.storylineId || `prompt:${item.prompt || ''}`;
		lastIndexByKey[key] = index; // last occurrence wins
	});
	// Build deduped array in the order of last occurrence
	const deduped = [];
	storylineImagesRaw.forEach((item, index) => {
		const key = item.storylineId || `prompt:${item.prompt || ''}`;
		if (lastIndexByKey[key] === index) {
			deduped.push(item);
		}
	});
	return deduped;
}

function displayFinalImages(characterData, storylineImages) {
	const finalCharacterImg = document.getElementById('finalCharacterImg');
	const storylineImagesList = document.getElementById('storylineImagesList');
	
	// Display character image
	if (finalCharacterImg) {
		finalCharacterImg.src = characterData.image.src;
		finalCharacterImg.alt = characterData.image.title;
	}
	
	// Display storyline images
	if (storylineImagesList) {
		storylineImagesList.innerHTML = '';
		
		storylineImages.forEach((storyline, index) => {
			const storylineItem = document.createElement('div');
			storylineItem.className = 'storyline-item';
			storylineItem.innerHTML = `
				<div class="storyline-content">
					<div class="storyline-prompt">
						<strong>Storyline ${index + 1}:</strong> ${storyline.prompt || ''}
					</div>
					<img src="${storyline.image.src}" alt="${storyline.image.title || ''}" class="storyline-image">
					<button class="download-storyline-btn" data-index="${index}">Download Storyline ${index + 1}</button>
				</div>
			`;
			storylineImagesList.appendChild(storylineItem);
		});
	}
}

function setupEventListeners(characterData, storylineImages) {
	const downloadCharacterBtn = document.getElementById('downloadCharacterBtn');
	const downloadAllBtn = document.getElementById('downloadAllBtn');
	const startOverBtn = document.getElementById('startOverBtn');
	
	// Download character button
	if (downloadCharacterBtn) {
		downloadCharacterBtn.addEventListener('click', function() {
			downloadImage(characterData.image, 'character.png');
		});
	}
	
	// Download all images button
	if (downloadAllBtn) {
		downloadAllBtn.addEventListener('click', function() {
			downloadAllImages(characterData, storylineImages);
		});
	}
	
	// Start over button
	if (startOverBtn) {
		startOverBtn.addEventListener('click', function() {
			startOver();
		});
	}
	
	// Download individual storyline buttons
	const downloadStorylineBtns = document.querySelectorAll('.download-storyline-btn');
	downloadStorylineBtns.forEach(button => {
		button.addEventListener('click', function() {
			const index = parseInt(this.dataset.index);
			const storyline = storylineImages[index];
			downloadImage(storyline.image, `storyline_${index + 1}.png`);
		});
	});
}

function downloadImage(imageData, filename) {
    // Use backend proxy to avoid CORS issues
    fetch(`http://localhost:5000/api/proxy-image?url=${encodeURIComponent(imageData.src)}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(() => {
            // fallback: open in new tab if download fails
            window.open(imageData.src, '_blank');
        });
}

function downloadAllImages(characterData, storylineImages) {
	// Download character image
	downloadImage(characterData.image, 'character.png');
	
	// Download all storyline images
	storylineImages.forEach((storyline, index) => {
		setTimeout(() => {
			downloadImage(storyline.image, `storyline_${index + 1}.png`);
		}, (index + 1) * 500); // Stagger downloads by 500ms
	});
}

function startOver() {
	// Clear localStorage
	localStorage.removeItem('sogniCharacterData');
	localStorage.removeItem('sogniStorylineImages');
	
	// Redirect to main page
	window.location.href = '../../../index.html';
}
