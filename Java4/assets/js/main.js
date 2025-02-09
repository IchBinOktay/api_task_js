import { API_BASE_URL, endpoints } from "./constants.js";
import { deleteDataById, getAllData, addSong, updateSong } from "./helpers.js";

const musicRow = document.querySelector(".music-row");
const loader = document.querySelector(".music-loader");
const searchInp = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const addSongForm = document.getElementById('add-song-form');
const editSongForm = document.getElementById('edit-song-form');

let music = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.addEventListener("DOMContentLoaded", async () => {
    loader.classList.replace("d-none", "d-flex");
    music = await getAllData(API_BASE_URL, endpoints.music);
    loader.classList.replace("d-flex", "d-none");
    renderMusicHTML(music);

    searchInp.addEventListener("keyup", (e) => {
        const searchedMusic = music.filter((x) => {
            return x.title.toLowerCase().includes(e.target.value.toLowerCase().trim());
        });
        renderMusicHTML(searchedMusic);
    });

    sortSelect.addEventListener("change", (e) => {
        const sortOrder = e.target.value;
        let sortedMusic;

        if (sortOrder === "asc") {
            sortedMusic = [...music].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === "desc") {
            sortedMusic = [...music].sort((a, b) => b.title.localeCompare(a.title));
        } else {
            sortedMusic = music;
        }

        renderMusicHTML(sortedMusic);
    });
});

async function fetchSongDetails(id) {
    try {
        const song = await getDataById(API_BASE_URL, endpoints.music, id);
        document.getElementById('title').value = song.title;
        document.getElementById('year').value = song.year;
        document.getElementById('artist').value = song.artist;
        document.getElementById('album').value = song.album;
        document.getElementById('image').value = song.image;
        document.getElementById('description').value = song.description;
    } catch (error) {
        console.error('Error fetching song details:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('id');
    if (songId) {
        fetchSongDetails(songId);
    }

    editSongForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const year = document.getElementById('year').value;
        const artist = document.getElementById('artist').value;
        const album = document.getElementById('album').value;
        const description = document.getElementById('description').value;
        const image = document.getElementById('image').value;

        const updatedSong = {
            title,
            year,
            artist,
            album,
            description,
            image
        };

        const songId = new URLSearchParams(window.location.search).get('id');
        updateSong(API_BASE_URL, endpoints.music, songId, updatedSong).then(() => {
            alert('Song updated successfully!');
            window.location.href = "index.html";
        }).catch(error => {
            console.error('Error updating song:', error);
        });
    });
});

addSongForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const artist = document.getElementById('artist').value;
    const album = document.getElementById('album').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;

    const newSong = {
        title,
        year,
        artist,
        album,
        description,
        image
    };

    try {
        await addSong(API_BASE_URL, endpoints.music, newSong);
        showSuccessAlert(`Song successfully added: ${title}`);
        addSongForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    } catch (error) {
        console.error('Failed to add song:', error);
    }
});

function renderMusicHTML(arr) {
    musicRow.innerHTML = "";
    arr.forEach((song) => {
        const isInWishlist = wishlist.some(m => m.id === song.id);
        musicRow.innerHTML += `
            <div class="col-3">
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
                        <button data-id="${song.id}" class="btn btn-danger delete">Delete</button>
                        <a href="detail.html?id=${song.id}" class="btn btn-primary">Details</a>
                        <a href="edit.html?id=${song.id}" class="btn btn-warning">Edit</a>
                        <i data-id="${song.id}" class="${isInWishlist ? 'fas' : 'far'} fa-heart add-to-wishlist" style="cursor:pointer; font-size: 24px;"></i>
                    </div>
                </div>
            </div>`;
    });

    const deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    e.target.closest(".col-3").remove();
                    const id = e.target.getAttribute("data-id");
                    deleteDataById(API_BASE_URL, endpoints.music, id).then((res) => {
                        console.log("response: ", res);
                    });
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            });
        });
    });

    const heartIcons = document.querySelectorAll(".add-to-wishlist");
    heartIcons.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            const songId = e.target.getAttribute("data-id");
            const song = music.find(m => m.id === songId);
            if (wishlist.some(m => m.id === songId)) {
                wishlist = wishlist.filter(m => m.id !== songId);
                e.target.classList.remove("fas");
                e.target.classList.add("far");
            } else {
                wishlist.push(song);
                e.target.classList.add("fas");
                e.target.classList.remove("far");
            }
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        });
    });
}
