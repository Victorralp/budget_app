// ====== DOM ELEMENTS ======
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const balanceEl = document.getElementById('balance');
const transactionsList = document.getElementById('recentTransactions');
const addIncomeBtn = document.getElementById('addIncome');
const addExpenseBtn = document.getElementById('addExpense');
const transactionModal = document.getElementById('transactionModal');
const transactionForm = document.getElementById('transactionForm');
const cancelTransactionBtn = document.getElementById('cancelTransaction');

// This is where we store all our data
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// This keeps track of whether the user is adding income or an expense
let currentTransactionType = '';

// Chart instance variable
let expenseChart = null;

/**
 * This function starts everything up when the page loads
 */
function init() {
    updateSummary();      // Calculate and show all the totals
    renderTransactions(); // Show the list of recent transactions
    initializeChart();    // Create the colorful pie chart
}

// Here we tell the buttons what to do when clicked
addIncomeBtn.addEventListener('click', () => {
    currentTransactionType = 'income';  // Set the switch to 'income'
    openTransactionModal();            // Open the popup form
});

addExpenseBtn.addEventListener('click', () => {
    currentTransactionType = 'expense'; // Set the switch to 'expense'
    openTransactionModal();            // Open the popup form
});

cancelTransactionBtn.addEventListener('click', closeTransactionModal);

transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Stop the form from refreshing the page
    addTransaction();    // Add the new transaction to our system
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === transactionModal) {
        closeTransactionModal();
    }
});

/**
 * This function opens the popup form for adding transactions
 */
function openTransactionModal() {
    transactionModal.style.display = 'block';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    
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
    
    document.getElementById('description').focus();
}

/**
 * This function closes the popup form
 */
function closeTransactionModal() {
    transactionModal.style.display = 'none';  // Hide the popup
    currentTransactionType = '';
}

/**
 * This function adds a new transaction to our system
 */
function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (!description || !amount || !category) {
        alert('Please fill in all fields');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        category,
        type: currentTransactionType,
        date: new Date().toISOString()
    };

    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateSummary();
    renderTransactions();
    updateChart();
    closeTransactionModal();
}

/**
 * This function shows the list of recent transactions
 */
function renderTransactions() {
    const recentFive = transactions.slice(0, 5);
    
    // Clear existing content
    transactionsList.innerHTML = '';
    
    recentFive.forEach(transaction => {
        // Create transaction item container
        const transactionItem = document.createElement('div');
        transactionItem.className = `transaction-item ${transaction.type}`;
        
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
        
        // Create transaction details section
        const transactionDetails = document.createElement('div');
        transactionDetails.className = 'transaction-details';
        
        const amount = document.createElement('div');
        amount.className = `transaction-amount ${transaction.type}`;
        amount.textContent = `${transaction.type === 'expense' ? '-' : '+'} ${formatCurrency(transaction.amount)}`;
        
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
        
        transactionsList.appendChild(transactionItem);
    });
}

/**
 * This function updates all the totals at the top of the page
 */
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
    
    const balance = income - expenses;

    totalIncomeEl.textContent = formatCurrency(income);
    totalExpensesEl.textContent = formatCurrency(expenses);
    balanceEl.textContent = formatCurrency(balance);
}

/**
 * Deletes a transaction and updates the UI
 */
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateSummary();
        renderTransactions();
        updateChart();
    }
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
 * This function makes numbers look like Nigerian currency
 */
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

/**
 * This function makes dates look nice and readable
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-NG', options);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', init); 