let quotes = [];
let categories = new Set(['All Categories']);
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Load quotes and categories from local storage on initialization
function loadQuotesAndCategories() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        updateCategories();
    } else {
        // Default quotes if storage is empty
        quotes = [
            { id: 1, text: "Be the change you wish to see in the world.", category: "Inspiration" },
            { id: 2, text: "The only way to do great work is to love what you do.", category: "Work" },
            { id: 3, text: "Life is what happens when you're busy making other plans.", category: "Life" }
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
    categories = new Set(['All Categories', ...quotes.map(quote => quote.category)]);
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter and display quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    const filteredQuotes = selectedCategory === 'All Categories' 
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
        const newQuote = { 
            id: Date.now(), // Use timestamp as a simple unique id
            text: newQuoteText, 
            category: newQuoteCategory 
        };
        quotes.push(newQuote);
        saveQuotes();
        syncWithServer(newQuote);
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        filterQuotes(); // Refresh displayed quotes
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Simulate syncing with server
async function syncWithServer(newQuote = null) {
    try {
        if (newQuote) {
            // Simulate posting new quote to server
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(newQuote),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            console.log('Quote synced with server:', data);
        }

        // Simulate fetching updates from server
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        
        // Simple conflict resolution: server data takes precedence
        serverQuotes.forEach(serverQuote => {
            const localQuote = quotes.find(q => q.id === serverQuote.id);
            if (!localQuote) {
                quotes.push({
                    id: serverQuote.id,
                    text: serverQuote.title, // JSONPlaceholder uses 'title' instead of 'text'
                    category: 'Uncategorized' // Assign a default category
                });
            } else if (localQuote.text !== serverQuote.title) {
                localQuote.text = serverQuote.title;
                notifyUser(`Quote updated: "${serverQuote.title}"`);
            }
        });

        saveQuotes();
        filterQuotes(); // Refresh displayed quotes
    } catch (error) {
        console.error('Error syncing with server:', error);
        notifyUser('Failed to sync with server. Please try again later.');
    }
}

// Notify user of updates or conflicts
function notifyUser(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Initialize the application
function init() {
    loadQuotesAndCategories();
    
    // Restore last selected category
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory && categories.has(lastSelectedCategory)) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
    } else {
        document.getElementById('categoryFilter').value = 'All Categories';
    }
    
    filterQuotes(); // Initial display of quotes
    
    // Set up periodic sync
    setInterval(syncWithServer, 60000); // Sync every minute
}

// Event listeners
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Initialize the application
init();
