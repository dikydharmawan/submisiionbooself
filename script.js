// Initialize book collection from local storage
let bookCollection = JSON.parse(localStorage.getItem('bookCollection')) || [];

// Save book collection to local storage
function saveBookCollection() {
    localStorage.setItem('bookCollection', JSON.stringify(bookCollection));
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeEnabled = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkModeEnabled', darkModeEnabled);
    updateToggleButton();
}

// Update the toggle button text based on the current theme
function updateToggleButton() {
    const themeButton = document.getElementById('themeToggle');
    themeButton.textContent = document.body.classList.contains('dark-mode') ? 'Mode Terang' : 'Mode Gelap';
}

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkModeEnabled');
if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
}
updateToggleButton();

// Add event listener to toggle button
document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

// Function to add a book to the collection
function addBook(event) {
    event.preventDefault();
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const year = parseInt(document.getElementById('publicationYear').value);
    const hasBeenRead = document.getElementById('hasBeenRead').checked;

    if (!title || !author || isNaN(year)) {
        alert('Mohon isi semua kolom dengan benar.');
        return;
    }

    const newBook = {
        id: Date.now(),
        title,
        author,
        year,
        hasBeenRead
    };

    bookCollection.push(newBook);
    saveBookCollection();
    displayBooks();
    event.target.reset();
}

// Function to display books based on their read status
function displayBooks(filteredBooks = bookCollection) {
    const unfinishedBooks = document.getElementById('Belum Dibaca');
    const finishedBooks = document.getElementById('Sudah Dibaca');

    unfinishedBooks.innerHTML = '<h2>Belum Selesai Dibaca</h2>';
    finishedBooks.innerHTML = '<h2>Sudah Selesai Dibaca</h2>';

    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.hasBeenRead) {
            finishedBooks.appendChild(bookElement);
        } else {
            unfinishedBooks.appendChild(bookElement);
        }
    });
}

// Function to create a book element for display
function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('bookItem');
    bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <button onclick="toggleBookReadStatus(${book.id})">${book.hasBeenRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}</button>
        <button onclick="removeBook(${book.id})">Hapus Buku</button>
    `;
    return bookElement;
}

// Function to toggle the read status of a book
function toggleBookReadStatus(bookId) {
    const book = bookCollection.find(b => b.id === bookId);
    if (book) {
        book.hasBeenRead = !book.hasBeenRead;
        saveBookCollection();
        displayBooks();
    }
}

// Function to remove a book from the collection
function removeBook(bookId) {
    bookCollection = bookCollection.filter(b => b.id !== bookId);
    saveBookCollection();
    displayBooks();
}

// Function to search for books by title
function searchBooks(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('searchQuery').value.trim().toLowerCase();
    const filteredBooks = bookCollection.filter(book =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery)
    );
    displayBooks(filteredBooks);
}

// Add event listeners for form submissions
document.getElementById('bookEntryForm').addEventListener('submit', addBook);
document.getElementById('bookSearchForm').addEventListener('submit', searchBooks);

// Initial rendering of books
displayBooks();