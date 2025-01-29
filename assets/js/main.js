// Get DOM elements
const customizeModal = document.getElementById('customizeModal');
const customizeForm = document.getElementById('customizeForm');
const cancelCustomizeBtn = document.getElementById('cancelCustomize');

// Get the base URL for GitHub Pages
const getBaseUrl = () => {
    const pathSegments = window.location.pathname.split('/');
    // Check if we're on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        // Return the repository name for GitHub Pages
        return '/' + pathSegments[1];
    }
    // For local development
    return '';
};

const baseUrl = getBaseUrl();

// Add event listeners for dashboard selection
document.querySelectorAll('.btn-select').forEach(button => {
    button.addEventListener('click', () => {
        const dashboardType = button.dataset.dashboard;
        openCustomizeModal(dashboardType);
    });
});

// Handle form submission
customizeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const dashboardType = customizeModal.dataset.dashboardType;
    
    // Save username to localStorage
    localStorage.setItem('username', username);
    
    // Redirect to appropriate dashboard
    if (dashboardType === 'individual') {
        window.location.href = `${baseUrl}/pages/individual-dashboard.html?name=${encodeURIComponent(username)}`;
    } else if (dashboardType === 'family') {
        window.location.href = `${baseUrl}/pages/family-dashboard.html?name=${encodeURIComponent(username)}`;
    }
});

// Cancel button handler
cancelCustomizeBtn.addEventListener('click', () => {
    closeCustomizeModal();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === customizeModal) {
        closeCustomizeModal();
    }
});

/**
 * Opens the customize modal and stores the dashboard type
 */
function openCustomizeModal(dashboardType) {
    customizeModal.style.display = 'block';
    customizeModal.dataset.dashboardType = dashboardType;
    document.getElementById('username').focus();
}

/**
 * Closes the customize modal and resets the form
 */
function closeCustomizeModal() {
    customizeModal.style.display = 'none';
    customizeForm.reset();
    delete customizeModal.dataset.dashboardType;
} 