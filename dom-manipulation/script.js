let quotes = [];
let categories = new Set();

// Load quotes from local storage on initialization
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        updateCategories();
    } else {
        // Default quotes if storage is empty
        quotes = [
            { text: "Be the change you wish to see in the world.", category: "Inspiration" },
            { text: "The only way to do great work is to love what you do.", category: "Work" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" }
        ];
        saveQuotes();
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    updateCategories();
}

// Update categories set and dropdown
function updateCategories() {
    categories = new Set(quotes.map(quote => quote.category));
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to display quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        filteredQuotes.forEach(quote => {
            quoteDisplay.innerHTML += `<p>"${quote.text}" - Category: ${quote.category}</p>`;
        });
    } else {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    }
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        filterQuotes(); // Refresh displayed quotes
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to export quotes to JSON file
function exportQuotes() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes = quotes.concat(importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            filterQuotes(); // Refresh displayed quotes
        } catch (error) {
            alert('Error importing quotes. Please check the file format.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize the application
function init() {
    loadQuotes();
    updateCategories();
    
    // Restore last selected category
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
    }
    
    filterQuotes(); // Initial display of quotes
}

// Event listeners
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize the application
init();
