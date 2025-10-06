// script.js
const sampleMovies = [
  { id:1, title:"Inception", poster: makeSvgData("Inception","#1f2937","#f97316"), backdrop: makeSvgData("Inception Backdrop","#0f172a","#7c3aed"), vote_average:8.8, overview:"A thief who steals corporate secrets through the use of dream-sharing technology."},
  { id:2, title:"Parasite", poster: makeSvgData("Parasite","#042f2e","#06b6d4"), backdrop: makeSvgData("Parasite Backdrop","#001219","#06b6d4"), vote_average:8.6, overview:"Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."},
  { id:3, title:"Joker", poster: makeSvgData("Joker","#2b1f3b","#ef4444"), backdrop: makeSvgData("Joker Backdrop","#0b1220","#ef4444"), vote_average:8.4, overview:"In Gotham City, a failed stand-up comedian is driven insane and turns to a life of crime."},
  { id:4, title:"The Grand Budapest", poster: makeSvgData("Grand Budapest","#2b3340","#f97316"), backdrop: makeSvgData("Grand Budapest Backdrop","#051225","#f97316"), vote_average:8.1, overview:"A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy."}
];
const main = document.getElementById("main");
const search = document.getElementById("search");
const chips = document.querySelectorAll(".chip");
const heroMedia = document.getElementById("heroMedia");
const heroMovieTitle = document.getElementById("heroMovieTitle");
const watchTrailerBtn = document.getElementById("watchTrailerBtn");
const addWatchlistBtn = document.getElementById("addWatchlistBtn");
const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalOverview = document.getElementById("modalOverview");
const modalRating = document.getElementById("modalRating");
const modalRelease = document.getElementById("modalRelease");
const modalExtra = document.getElementById("modalExtra");
const modalTrailer = document.getElementById("modalTrailer");
const grainCanvas = document.getElementById("filmGrain");
let mode = "popular";
let heroFeaturedMovie = null;
function makeSvgData(t, bg, accent){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' font-family='Inter,Arial' font-size='40' fill='${accent}' dominant-baseline='middle' text-anchor='middle'>${t}</text></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
function getClassByRate(vote){
  if(vote>=7.5) return "green";
  if(vote>=7) return "orange";
  return "red";
}
function posterUrl(p){ return p; }
function renderMovies(movies){
  main.innerHTML="";
  movies.forEach(movie=>{
    const card=document.createElement("div");
    card.className="movie";
    card.innerHTML=`<img loading="lazy" src="${posterUrl(movie.poster)}" alt="${escapeHtml(movie.title)} poster" /><div class="movie-info"><h3 title="${escapeHtml(movie.title)}">${escapeHtml(shorten(movie.title,40))}</h3><span class="rating ${getClassByRate(movie.vote_average)}">${movie.vote_average?movie.vote_average.toFixed(1):"—"}</span></div><div class="overview">${escapeHtml(shorten(movie.overview,200))}</div>`;
    card.addEventListener("click",()=>openModal(movie));
    main.appendChild(card);
  });
}
function openModal(movie){
  modal.setAttribute("aria-hidden","false");
  modalPoster.src = posterUrl(movie.backdrop||movie.poster);
  modalTitle.textContent = movie.title||"Unknown";
  modalOverview.textContent = movie.overview||"No overview";
  modalRating.textContent = movie.vote_average?movie.vote_average.toFixed(1):"—";
  modalRating.className = "rating "+getClassByRate(movie.vote_average);
  modalRelease.textContent = "Demo";
  modalExtra.textContent = `ID: ${movie.id}`;
  modalTrailer.innerHTML = "";
}
function closeModal(){ modal.setAttribute("aria-hidden","true"); modalPoster.src=""; modalTrailer.innerHTML=""; }
modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeModal(); });
function setHero(movie){
  heroFeaturedMovie = movie;
  heroMovieTitle.textContent = movie.title||"Featured";
  heroMedia.innerHTML = "";
  const img=document.createElement("img");
  img.src = posterUrl(movie.backdrop||movie.poster);
  img.alt = movie.title+" hero";
  img.loading = "lazy";
  heroMedia.appendChild(img);
  watchTrailerBtn.onclick = ()=> openModal(movie);
  addWatchlistBtn.onclick = ()=>{
    const list = JSON.parse(localStorage.getItem("watchlist")||"[]");
    if(list.includes(movie.id)){
      const filtered = list.filter(x=>x!==movie.id);
      localStorage.setItem("watchlist", JSON.stringify(filtered));
      addWatchlistBtn.textContent = "+ Add to Watchlist"; addWatchlistBtn.classList.remove('active');
    } else {
      list.push(movie.id); localStorage.setItem("watchlist", JSON.stringify(list));
      addWatchlistBtn.textContent = "✓ In Watchlist"; addWatchlistBtn.classList.add('active');
    }
  };
  if(JSON.parse(localStorage.getItem("watchlist")||"[]").includes(movie.id)){ addWatchlistBtn.textContent="✓ In Watchlist"; addWatchlistBtn.classList.add('active'); } else { addWatchlistBtn.textContent="+ Add to Watchlist"; addWatchlistBtn.classList.remove('active'); }
}
function escapeHtml(s){ if(!s) return ""; return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function shorten(s,len=120){ if(!s) return ""; return s.length>len?s.slice(0,len).trim()+"…":s; }
function showAll(){ renderMovies(sampleMovies); if(sampleMovies.length>0) setHero(sampleMovies[0]); }
chips.forEach(chip=>{ chip.addEventListener("click", ()=>{ chips.forEach(c=>c.classList.remove("active")); chip.classList.add("active"); mode = chip.dataset.mode; showAll(); }); });
search.addEventListener("input", ()=>{ const q = search.value.trim().toLowerCase(); if(!q) return showAll(); const filtered = sampleMovies.filter(m=>m.title.toLowerCase().includes(q)); renderMovies(filtered); if(filtered.length>0) setHero(filtered[0]); });
showAll();
(function(){
  const hero = document.querySelector('.hero-main');
  const media = document.getElementById('heroMedia');
  if(!hero||!media) return;
  document.addEventListener('mousemove',(e)=>{ const rect = hero.getBoundingClientRect(); const cx = rect.left + rect.width/2; const cy = rect.top + rect.height/2; const dx = (e.clientX - cx)/rect.width; const dy = (e.clientY - cy)/rect.height; media.style.transform = `translate(${dx*6}px, ${dy*6}px) scale(1.01)`; });
})();
(function(){ const grain = grainCanvas; if(!grain||!grain.getContext) return; const ctx = grain.getContext('2d'); function resize(){ grain.width = grain.clientWidth; grain.height = grain.clientHeight; } function drawNoise(){ const w=grain.width,h=grain.height; const imageData = ctx.createImageData(w,h); const buffer = new Uint32Array(imageData.data.buffer); for(let i=0;i<buffer.length;i++){ const val = (Math.random()*255)|0; buffer[i] = (255<<24)|(val<<16)|(val<<8)|val; } ctx.putImageData(imageData,0,0); } function loop(){ drawNoise(); requestAnimationFrame(()=>setTimeout(loop,120)); } resize(); window.addEventListener('resize', resize); loop(); })();
