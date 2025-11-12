/**
 * Shows the list of recent transactions
 * Displays the 5 most recent money movements
 */
function renderTransactions() {
    if (!recentTransactions) return;
    
    const recent = transactions.slice(-5).reverse();
    
    // Clear existing content
    recentTransactions.innerHTML = '';
    
    recent.forEach(transaction => {
        const member = transaction.memberId ? 
            familyMembers.find(m => m.id === transaction.memberId)?.name : '';
            
        // Create transaction item container
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        // Create transaction info section
        const transactionInfo = document.createElement('div');
        transactionInfo.className = 'transaction-info';
        
        const description = document.createElement('span');
        description.className = 'transaction-description';
        description.textContent = transaction.description; // Safe text content assignment
        
        const date = document.createElement('span');
        date.className = 'transaction-date';
        date.textContent = formatDate(transaction.date);
        
        transactionInfo.appendChild(description);
        transactionInfo.appendChild(date);
        
        // Add member name if exists
        if (member) {
            const memberSpan = document.createElement('span');
            memberSpan.className = 'transaction-member';
            memberSpan.textContent = member;
            transactionInfo.appendChild(memberSpan);
        }
        
        // Create transaction details section
        const transactionDetails = document.createElement('div');
        transactionDetails.className = 'transaction-details';
        
        const amount = document.createElement('div');
        amount.className = `transaction-amount ${transaction.type}`;
        amount.textContent = `${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}`;
        
        const category = document.createElement('span');
        category.className = 'transaction-category';
        category.textContent = transaction.category;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.onclick = () => deleteTransaction(transaction.id);
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-trash';
        deleteBtn.appendChild(icon);
        
        transactionDetails.appendChild(amount);
        transactionDetails.appendChild(category);
        transactionDetails.appendChild(deleteBtn);
        
        transactionItem.appendChild(transactionInfo);
        transactionItem.appendChild(transactionDetails);
        
        recentTransactions.appendChild(transactionItem);
    });
}

/**
 * Deletes a transaction and updates the UI
 */
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        const transaction = transactions.find(t => t.id === id);
        
        // If it's an expense, update member's spending
        if (transaction && transaction.type === 'expense' && transaction.memberId) {
            const memberIndex = familyMembers.findIndex(m => m.id === transaction.memberId);
            if (memberIndex !== -1) {
                familyMembers[memberIndex].totalSpent -= transaction.amount;
                localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
                renderFamilyMembers();
            }
        }
        
        // Remove the transaction
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('familyTransactions', JSON.stringify(transactions));
        
        // Update UI
        updateSummary();
        renderTransactions();
        updateChart();
    }
}

// ====== DOM ELEMENTS ======
const membersGrid = document.getElementById('familyMembers');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const balanceEl = document.getElementById('balance');
const savingsEl = document.getElementById('savings');
const recentTransactions = document.getElementById('recentTransactions');

// Modal elements
const memberModal = document.getElementById('memberModal');
const memberForm = document.getElementById('memberForm');
const transactionModal = document.getElementById('transactionModal');
const transactionForm = document.getElementById('transactionForm');
const familyMemberSelect = document.getElementById('familyMember');

// Buttons
const addMemberBtn = document.getElementById('addMemberBtn');
const addIncomeBtn = document.getElementById('addIncome');
const addExpenseBtn = document.getElementById('addExpense');
const cancelMemberBtn = document.getElementById('cancelMember');
const cancelTransactionBtn = document.getElementById('cancelTransaction');

// Add to the DOM Elements section
const resetDashboardBtn = document.getElementById('resetDashboard');

// ====== STATE MANAGEMENT ======
// Load saved data from browser storage, or start with empty arrays if none exist
let transactions = JSON.parse(localStorage.getItem('familyTransactions')) || [];
let familyMembers = JSON.parse(localStorage.getItem('familyMembers')) || [];

// Keeps track of whether we're adding income or expense
let currentTransactionType = 'income';

// Chart instance variable
let expenseChart = null;

// Start everything up when the page loads
document.addEventListener('DOMContentLoaded', function() {
    init();
});

/**
 * Initializes the dashboard
 */
function init() {
    initializeEventListeners();
    renderFamilyMembers();
    updateSummary();
    renderTransactions();
    initializeChart();
    updateChart();
    updateFamilyMemberSelect();
}

/**
 * Sets up all event listeners
 */
function initializeEventListeners() {
    // Add Member button
    addMemberBtn.addEventListener('click', () => {
        openMemberModal();
    });

    // Add Income button
    addIncomeBtn.addEventListener('click', () => {
        currentTransactionType = 'income';
        openTransactionModal();
    });

    // Add Expense button
    addExpenseBtn.addEventListener('click', () => {
        currentTransactionType = 'expense';
        openTransactionModal();
    });

    // Cancel member button
    cancelMemberBtn.addEventListener('click', closeMemberModal);

    // Cancel transaction button
    cancelTransactionBtn.addEventListener('click', closeTransactionModal);

    // Member form submission
    memberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addFamilyMember();
    });

    // Transaction form submission
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTransaction();
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === memberModal) {
            closeMemberModal();
        }
        if (e.target === transactionModal) {
            closeTransactionModal();
        }
    });

    // Spending limit preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = btn.dataset.value;
            document.getElementById('spendingLimit').value = value;
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Reset dashboard button
    resetDashboardBtn.addEventListener('click', () => {
        showConfirmDialog(
            'Reset Dashboard',
            'Are you sure you want to reset the dashboard? This will delete all transactions and family members. This action cannot be undone.',
            resetDashboard
        );
    });
}

/**
 * Opens the member modal
 */
function openMemberModal() {
    if (!memberModal || !memberForm) return;
    memberModal.style.display = 'block';
    document.getElementById('memberName').focus();
}

/**
 * Closes the member modal
 */
function closeMemberModal() {
    if (!memberModal || !memberForm) return;
    memberModal.style.display = 'none';
    memberForm.reset();
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => btn.classList.remove('active'));
}

/**
 * Opens the transaction modal
 */
function openTransactionModal() {
    if (!transactionModal || !transactionForm) return;
    transactionModal.style.display = 'block';
    document.getElementById('description').focus();
    
    // Show/hide family member select based on transaction type
    const familyMemberGroup = document.getElementById('familyMember').closest('.form-group');
    if (familyMemberGroup) {
        familyMemberGroup.style.display = currentTransactionType === 'expense' ? 'block' : 'none';
    }

    // Update category options based on transaction type
    const categorySelect = document.getElementById('category');
    if (currentTransactionType === 'income') {
        categorySelect.innerHTML = `
            <option value="">Select Category</option>
            <option value="salary">Salary</option>
            <option value="business">Business Income</option>
            <option value="investment">Investment Returns</option>
            <option value="rental">Rental Income</option>
            <option value="others">Other Income</option>
        `;
    } else {
        categorySelect.innerHTML = `
            <option value="">Select Category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
            <option value="others">Others</option>
        `;
    }
}

/**
 * Closes the transaction modal
 */
function closeTransactionModal() {
    if (!transactionModal || !transactionForm) return;
    transactionModal.style.display = 'none';
    transactionForm.reset();
}

/**
 * Adds a new family member
 */
function addFamilyMember() {
    const name = document.getElementById('memberName').value;
    const role = document.querySelector('input[name="memberRole"]:checked')?.value;
    const spendingLimit = parseFloat(document.getElementById('spendingLimit').value);

    if (!name || !role || !spendingLimit) {
        alert('Please fill in all fields');
        return;
    }

    const member = {
        id: Date.now(),
        name,
        role,
        spendingLimit,
        totalSpent: 0
    };

    familyMembers.push(member);
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    
    renderFamilyMembers();
    updateFamilyMemberSelect();
    closeMemberModal();
}

/**
 * Updates the family member select dropdown in the transaction form
 */
function updateFamilyMemberSelect() {
    if (!familyMemberSelect) return;

    // Clear existing content
    familyMemberSelect.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Family Member';
    familyMemberSelect.appendChild(defaultOption);
    
    // Add family member options safely
    familyMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name; // Safe text content assignment
        familyMemberSelect.appendChild(option);
    });
}

/**
 * Renders the family members grid
 */
function renderFamilyMembers() {
    if (!membersGrid) return;

    membersGrid.innerHTML = familyMembers.map(member => `
        <div class="member-card" data-id="${member.id}">
            <div class="member-info">
                <div class="member-avatar">
                    ${getRoleEmoji(member.role)}
                </div>
                <div class="member-details">
                    <h3>${escapeHtml(member.name)}</h3>
                    <span class="member-role">${capitalizeFirst(member.role)}</span>
                </div>
            </div>
            <div class="member-spending">
                <div class="spending-bar">
                    <div class="spending-progress" style="width: ${calculateSpendingPercentage(member)}%"></div>
                </div>
                <div class="spending-details">
                    <span class="spent-amount">${formatCurrency(member.totalSpent || 0)}</span>
                    <span class="limit-amount">/ ${formatCurrency(member.spendingLimit)}</span>
                </div>
            </div>
            <button class="btn-delete-member" onclick="deleteFamilyMember(${member.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

/**
 * Deletes a family member
 */
function deleteFamilyMember(id) {
    const member = familyMembers.find(m => m.id === id);
    if (!member) return;

    showConfirmDialog(
        'Delete Family Member',
        `Are you sure you want to delete ${member.name}? Their transactions will also be deleted. This action cannot be undone.`,
        () => {
            // Remove member's transactions
            const memberTransactions = transactions.filter(t => t.memberId === id);
            if (memberTransactions.length > 0) {
                transactions = transactions.filter(t => t.memberId !== id);
                localStorage.setItem('familyTransactions', JSON.stringify(transactions));
                
                // Update UI elements that show transactions
                updateSummary();
                renderTransactions();
                updateChart();
            }

            // Remove the member
            familyMembers = familyMembers.filter(m => m.id !== id);
            localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
            
            // Update UI
            renderFamilyMembers();
            updateFamilyMemberSelect();
            
            // Show success message
            showNotification(`${member.name} has been removed from the family`, 'success');
        }
    );
}

/**
 * Gets the emoji for a member's role
 */
function getRoleEmoji(role) {
    const emojis = {
        'child': '👶',
        'teen': '🧑',
        'spouse': '👥'
    };
    return emojis[role] || '👤';
}

/**
 * Calculates the spending percentage for a member
 */
function calculateSpendingPercentage(member) {
    if (!member.totalSpent || !member.spendingLimit) return 0;
    return Math.min((member.totalSpent / member.spendingLimit) * 100, 100);
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Adds a new transaction
 */
function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const memberId = currentTransactionType === 'expense' ? 
        parseInt(document.getElementById('familyMember').value) : null;

    if (!description || !amount || !category || (currentTransactionType === 'expense' && !memberId)) {
        alert('Please fill in all fields');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        category,
        type: currentTransactionType,
        date: new Date().toISOString(),
        memberId
    };

    // Update member spending for expenses
    if (currentTransactionType === 'expense' && memberId) {
        const memberIndex = familyMembers.findIndex(m => m.id === memberId);
        if (memberIndex !== -1) {
            familyMembers[memberIndex].totalSpent += amount;
            localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
            renderFamilyMembers();
        }
    }

    transactions.unshift(transaction);
    localStorage.setItem('familyTransactions', JSON.stringify(transactions));
    
    updateSummary();
    renderTransactions();
    updateChart();
    closeTransactionModal();
}

/**
 * Updates the financial summary
 */
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const balance = income - expenses;
    const savings = balance; // All remaining balance goes to savings
    
    if (totalIncomeEl) totalIncomeEl.textContent = formatCurrency(income);
    if (totalExpensesEl) totalExpensesEl.textContent = formatCurrency(expenses);
    if (balanceEl) balanceEl.textContent = formatCurrency(balance);
    if (savingsEl) savingsEl.textContent = formatCurrency(savings);
}

/**
 * Initializes the expense distribution chart
 */
function initializeChart() {
    const ctx = document.getElementById('expenseChart')?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Others'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total ? Math.round((value / total) * 100) : 0;
                            return `${label}: ₦${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Updates the expense distribution chart
 */
function updateChart() {
    if (!expenseChart) {
        initializeChart();
        return;
    }

    const categories = ['food', 'transport', 'utilities', 'entertainment', 'others'];
    const categoryTotals = categories.map(category => 
        transactions
            .filter(t => t.type === 'expense' && t.category === category)
            .reduce((sum, t) => sum + t.amount, 0)
    );

    expenseChart.data.datasets[0].data = categoryTotals;
    expenseChart.update();
}

/**
 * Formats currency in Nigerian Naira
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Formats date to a readable string
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Shows a confirmation dialog
 */
function showConfirmDialog(title, message, onConfirm) {
    // Create dialog if it doesn't exist
    let dialog = document.querySelector('.confirm-dialog');
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        document.body.appendChild(dialog);
    }

    // Set dialog content
    dialog.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="confirm-actions">
            <button class="cancel">Cancel</button>
            <button class="confirm">Confirm</button>
        </div>
    `;

    // Add event listeners
    const cancelBtn = dialog.querySelector('.cancel');
    const confirmBtn = dialog.querySelector('.confirm');

    cancelBtn.addEventListener('click', () => {
        dialog.classList.remove('active');
    });

    confirmBtn.addEventListener('click', () => {
        onConfirm();
        dialog.classList.remove('active');
    });

    // Show dialog
    dialog.classList.add('active');
}

/**
 * Resets the entire dashboard
 */
function resetDashboard() {
    // Clear all data
    transactions = [];
    familyMembers = [];
    
    // Clear localStorage
    localStorage.removeItem('familyTransactions');
    localStorage.removeItem('familyMembers');
    
    // Update UI
    updateSummary();
    renderFamilyMembers();
    renderTransactions();
    updateChart();
    updateFamilyMemberSelect();
    
    // Show success message
    showNotification('Dashboard has been reset successfully', 'success');
}

/**
 * Shows a notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create notification content safely
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    
    const icon = document.createElement('i');
    icon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message; // Safe text content assignment
    
    notificationContent.appendChild(icon);
    notificationContent.appendChild(messageSpan);
    notification.appendChild(notificationContent);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('active'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
