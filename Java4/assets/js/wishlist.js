const wishlistRow = document.querySelector(".wishlist-row");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.addEventListener("DOMContentLoaded", () => {
    renderWishlistHTML(wishlist);
});

function renderWishlistHTML(arr) {
    wishlistRow.innerHTML = "";
    if (arr.length === 0) {
        wishlistRow.innerHTML = `<p>Your wishlist is empty!</p>`;
        return;
    }

    arr.forEach((song) => {
        wishlistRow.innerHTML += `
            <div class="col-4">
                <div class="card">
                    <div class="img-wrapper">
                        <img src="${song.image}" class="card-img-top" alt="${song.title}" title="${song.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${song.title}</h5>
                        <p class="m-0">Release Year: ${song.year}</p>
                        <p class="m-0">Artist: ${song.artist}</p>
                        <p class="m-0">Album: ${song.album}</p>
                        <p class="m-0 mb-3">Description: ${song.description}</p>
                        <button data-id="${song.id}" class="btn btn-danger remove">Remove from Wishlist</button>
                    </div>
                </div>
            </div>`;
    });

    const removeBtns = document.querySelectorAll(".remove");
    removeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            wishlist = wishlist.filter((song) => song.id !== id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderWishlistHTML(wishlist);
        });
    });
}

function addToWishlist(song) {
    if (!wishlist.some((m) => m.id === song.id)) {
        wishlist.push(song);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlistHTML(wishlist);
    }
}
