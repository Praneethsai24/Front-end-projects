const image = document.getElementById("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.getElementById("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");

const songs = [
    { name: "la-la-la", displayName: "La La La", artist: "Sam Smith, Naughty Boy" },
    { name: "daises",   displayName: "Daises",   artist: "Justin Bieber" },
  ];
  

let isPlaying = false;
let songIndex = 0;

function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.png`;
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "--:--";
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;
  console.log(`Now index: ${songIndex}`);
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) songIndex = 0;
  console.log(`Now index: ${songIndex}`);
  loadSong(songs[songIndex]);
  playSong();
}

function formatTime(time) {
  if (isNaN(time)) return "--:--";
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  return `${minutes}:${seconds}`;
}

function updateProgressBar(e) {
  const { duration, currentTime } = e.target;
  if (!duration) return;

  const percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function setProgressBar(e) {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  if (!duration) return;
  music.currentTime = (clickX / width) * duration;
}

music.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(music.duration);
});

music.addEventListener("ended", nextSong);

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);

loadSong(songs[songIndex]);
