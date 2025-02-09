import { getDataById } from "./helpers.js";
import { API_BASE_URL, endpoints } from "./constants.js";

const detailRow = document.querySelector(".music-row");

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  const music = await getDataById(API_BASE_URL, endpoints.music, id);
  const song = music[0];
  detailRow.innerHTML = `
    <div class="col-9">
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
          <a href="index.html" class="btn btn-primary">Go Back</a>
        </div>
      </div>
    </div>`;
});
