const apiUrl = "https://gutendex.com/books";
let books = [];
let currentPage = 1;
const booksPerPage = 10;

// DOM Elements
const booksList = document.getElementById("books-list");
const searchBar = document.getElementById("search-bar");
const genreFilter = document.getElementById("genre-filter");
const pagination = document.getElementById("pagination");
const loaderContainer = document.getElementById("loader-container");
const loader = document.getElementById("loader");

// Fetch Books from API
async function fetchBooks(page = 1) {
  showLoader();
  try {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const data = await response.json();
    books = data.results;
    renderBooks(books);
    renderPagination(data);
  } catch (error) {
    console.error("Failed to fetch books", error);
  } finally {
    hideLoader();
  }
}

// Render Books
function renderBooks(books) {
  if (books?.length > 0) {
    booksList.innerHTML = books
      .map((book) => {
        const author = book.authors[0]?.name || "Unknown Author";
        const subjects = book.subjects.length
          ? book.subjects.join(", ")
          : "N/A";
        return `
          <div class="book-card" data-aos="zoom-in">
        <a href="book.html?id=${book.id}">
          <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
          <h3 style="margin:5px 0px;">${book.title}</h3>
        </a>
         <p><strong>Author:</strong> ${author}</p>
        <p><strong>Genres:</strong> ${subjects}</p>
        <div style="display:flex; flex-direction: row; justify-content:center; margin-top: 10px">
        <button class="wishlist-btn" data-id="${book.id}">
          <i class="fa-heart ${
            isInWishlist(book.id) ? "fa-solid" : "fa-regular"
          }"></i>
        </button>
        </div>
      </div>
        `;
      })
      .join("");
    attachWishlistListeners();
  } else {
    booksList.innerHTML = "No Data Available";
  }
}

// Attach Wishlist Button Listeners
function attachWishlistListeners() {
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", () => toggleWishlist(button.dataset.id));
  });
}

// Handle Wishlist Toggle
function toggleWishlist(bookId) {
  let wishlist = getWishlist();
  if (wishlist.includes(bookId)) {
    wishlist = wishlist.filter((id) => id !== bookId);
  } else {
    wishlist.push(bookId);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderBooks(books);
}

// Get Wishlist from Local Storage
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Check if Book is in Wishlist
function isInWishlist(bookId) {
  return getWishlist().includes(`${bookId}`);
}

// Search Functionality
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );
  renderBooks(filteredBooks);
});

// Filter by Genre
genreFilter.addEventListener("change", (e) => {
  const genre = e.target.value;
  const filteredBooks = genre
    ? books.filter((book) => book.subjects.includes(genre))
    : books;
  renderBooks(filteredBooks);
});

// Show Loader
function showLoader() {
  loaderContainer.style.display = "flex";
  loader.style.display = "block";
  booksList.style.display = "none";
  pagination.style.display = "none";
}

// Hide Loader
function hideLoader() {
  loaderContainer.style.display = "none";
  loader.style.display = "none";
  booksList.style.display = "grid";
  pagination.style.display = "block";
}

// Render Pagination
function renderPagination(data) {
  pagination.innerHTML = `
    <button ${
      data.previous ? `style="cursor: pointer;"` : "disabled"
    } onclick="changePage('prev')">Previous</button>
    <span style="margin-left: 5px; margin-right: 5px">Page ${currentPage}</span>
    <button ${
      data.next ? `style="cursor: pointer;"` : "disabled"
    } onclick="changePage('next')">Next</button>
  `;
}

// Change Page
function changePage(direction) {
  currentPage += direction === "next" ? 1 : -1;
  fetchBooks(currentPage);
}

// Initial Fetch
fetchBooks();
