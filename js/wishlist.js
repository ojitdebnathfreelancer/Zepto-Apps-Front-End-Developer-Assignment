const wishlistContainer = document.getElementById("wishlist");
const loaderContainer = document.getElementById("loader-container");
const loader = document.getElementById("loader");
const apiUrl = "https://gutendex.com/books";

// Fetch Wishlist Books
async function fetchWishlistBooks() {
  showLoader();
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  try {
    const promises = wishlist.map((id) =>
      fetch(`${apiUrl}/${id}`).then((res) => res.json())
    );
    const books = await Promise.all(promises);
    renderWishlist(books);
  } catch (error) {
    console.error("Failed to fetch books", error);
  } finally {
    hideLoader();
  }
}

// Render Wishlist Books
function renderWishlist(books) {
  if (books?.length > 0) {
    wishlistContainer.innerHTML = books
      .map(
        (book) => `
    <div class="book-card" data-aos="zoom-in">
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p style="margin-top: 5px;"><span style="font-weight: 600;">Author:-</span> ${
        book.authors[0]?.name || "Unknown Author"
      }</p>
    </div>
  `
      )
      .join("");
  } else {
    wishlistContainer.innerHTML = "No Data Available";
  }
}

// Show Loader
function showLoader() {
  loaderContainer.style.display = "flex";
  loader.style.display = "block";
  wishlistContainer.style.display = "none";
}

// Hide Loader
function hideLoader() {
  loaderContainer.style.display = "none";
  loader.style.display = "none";
  wishlistContainer.style.display = "block";
}

// Initial Fetch
fetchWishlistBooks();
