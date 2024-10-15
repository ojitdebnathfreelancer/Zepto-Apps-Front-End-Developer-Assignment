const bookDetailsContainer = document.getElementById("book-details");
const loaderContainer = document.getElementById("loader-container");
const loader = document.getElementById("loader");

const apiUrl = "https://gutendex.com/books";
let book = {};

// Get Book ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");

// Fetch and Display Book Details
async function fetchBookDetails() {
  showLoader();
  try {
    const response = await fetch(`${apiUrl}/${bookId}`);
    book = await response.json();
    renderBookDetails(book);
  } catch (error) {
    bookDetailsContainer.innerHTML = "<p>Failed to load book details.</p>";
  } finally {
    hideLoader();
  }
}

// Render Book Details
function renderBookDetails(book) {
  if (book?.id) {
    const author = book.authors[0]?.name || "Unknown Author";
    const subjects = book.subjects.length ? book.subjects.join(", ") : "N/A";

    bookDetailsContainer.innerHTML = `
      <div class="book-card">
        <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
        <h1>${book.title}</h1>
        <p><strong>Author:</strong> ${author}</p>
        <p><strong>Genres:</strong> ${subjects}</p>
        <p><strong>Language:-</strong> ${book.languages.join(", ")}</p>
        <p style="margin:5px 0px;"><strong>Download Links:-</strong></p>
        <ul style="padding:0px 15px;">
          ${Object.entries(book.formats)
            .filter(([format, _]) => !format.includes("image"))
            .map(
              ([format, url]) =>
                `<li><a href="${url}" target="_blank">${format}</a></li>`
            )
            .join("")}
        </ul>
       <div style="display:flex; flex-direction: row; justify-content: center;">
       <button class="wishlist-btn" data-id="${book.id}">
            <i class="fa-heart ${
              isInWishlist(book.id) ? "fa-solid" : "fa-regular"
            }"></i>
          </button>
       </div>
      </div>
    `;
    attachWishlistListener();
  } else {
    bookDetailsContainer.innerHTML = "No Data Available";
  }
}

// Attach Listener to Wishlist Button
function attachWishlistListener() {
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
  renderBookDetails(book);
}

// Show Loader
function showLoader() {
  loaderContainer.style.display = "flex";
  loader.style.display = "block";
  bookDetailsContainer.style.display = "none";
}

// Hide Loader
function hideLoader() {
  loaderContainer.style.display = "none";
  loader.style.display = "none";
  bookDetailsContainer.style.display = "block";
}

// Get Wishlist from Local Storage
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Check if Book is in Wishlist
function isInWishlist(bookId) {
  return getWishlist().includes(`${bookId}`);
}

// Initial Fetch
fetchBookDetails();
