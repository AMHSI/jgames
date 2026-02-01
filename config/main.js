// This changes the title of your site

var sitename = "Jaron's Games"; // Change this to change the name of your website.
var subtext = "Premium Shitty Gaming Experience"; // set the subtext

// more settings in main.css



// END CONFIG
// DO NOT MODIFY IF YOU DO NOT KNOW WHAT YOUR DOING!

import "./custom.js";

var serverUrl1 = "https://gms.parcoil.com";
var currentPageTitle = document.title;
document.title = `${currentPageTitle} | ${sitename}`;
let gamesData = []; 
let currentSlide = 0;
let currentCategory = 'all';

// Slideshow functionality
function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (slides.length === 0) return;
  
  slides.forEach(slide => slide.style.display = 'none');
  dots.forEach(dot => dot.classList.remove('active'));
  
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].style.display = 'block';
  dots[currentSlide].classList.add('active');
}

function changeSlide(direction) {
  showSlide(currentSlide + direction);
}

function initSlideshow() {
  if (gamesData.length === 0) return;
  
  // Get random featured games (up to 5)
  const featuredGames = [...gamesData].sort(() => 0.5 - Math.random()).slice(0, 5);
  const slideshowContainer = document.querySelector('.slideshow-container');
  const dotsContainer = document.querySelector('.slide-dots');
  
  // Clear existing slides and dots
  slideshowContainer.innerHTML = '<button class="slide-prev" onclick="window.changeSlide(-1)">❮</button><button class="slide-next" onclick="window.changeSlide(1)">❯</button><div class="slide-dots"></div>';
  const newDotsContainer = slideshowContainer.querySelector('.slide-dots');
  
  // Create slides with actual games
  featuredGames.forEach((game, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
      <img src="${serverUrl1}/${game.url}/${game.image}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/800x400/1a1a1a/c77dff?text=${encodeURIComponent(game.name)}'">
      <div class="slide-content">
        <h3>${game.name}</h3>
        <p>Click to play this ${getRandomAdjective()} game!</p>
      </div>
    `;
    
    // Make slide clickable
    slide.onclick = () => {
      window.location.href = `play.html?gameurl=${game.url}/`;
    };
    
    // Insert before navigation buttons
    const prevBtn = slideshowContainer.querySelector('.slide-prev');
    slideshowContainer.insertBefore(slide, prevBtn);
    
    // Create dot
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.onclick = () => window.showSlide(index);
    newDotsContainer.appendChild(dot);
  });
  
  // Show first slide
  showSlide(0);
  
  // Auto-advance slideshow
  setInterval(() => changeSlide(1), 5000);
}

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  
  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    themeToggle.textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-theme');
    themeToggle.textContent = '☀️ Light Mode';
    localStorage.setItem('theme', 'light');
  }
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('themeToggle');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️ Light Mode';
  }
}

// Category filter functionality
function filterByCategory(category) {
  currentCategory = category;
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Update active button
  filterButtons.forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Filter games
  let filteredGames = gamesData;
  if (category !== 'all') {
    filteredGames = gamesData.filter(game => 
      game.category && game.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  displayFilteredGames(filteredGames);
}

// Update statistics
function updateStats() {
  document.getElementById('totalGames').textContent = gamesData.length;
  
  // Simulate players online changing with more randomness
  setInterval(() => {
    const players = Math.floor(Math.random() * 200) + 50; // Random between 50-250
    document.getElementById('playersOnline').textContent = players;
  }, 5000); // Update every 5 seconds for more dynamic feel
}

function displayFilteredGames(filteredGames) {
  const gamesContainer = document.getElementById("gamesContainer");
  gamesContainer.innerHTML = ""; 

  filteredGames.forEach((game) => {
    const gameDiv = document.createElement("div");
    gameDiv.classList.add("game");

    const gameImage = document.createElement("img");
    gameImage.src = `${serverUrl1}/${game.url}/${game.image}`;
    gameImage.alt = game.name;
    gameImage.onclick = () => {
      window.location.href = `play.html?gameurl=${game.url}/`;
    };

    const gameName = document.createElement("p");
    gameName.textContent = game.name;

    gameDiv.appendChild(gameImage);
    gameDiv.appendChild(gameName);
    gamesContainer.appendChild(gameDiv);
  });
}

function handleSearchInput() {
  const searchInputValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  
  let filteredGames = gamesData;
  
  // Apply category filter first
  if (currentCategory !== 'all') {
    filteredGames = filteredGames.filter(game => 
      game.category && game.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }
  
  // Then apply search filter
  filteredGames = filteredGames.filter((game) =>
    game.name.toLowerCase().includes(searchInputValue)
  );
  
  displayFilteredGames(filteredGames);
}

// Make functions globally accessible
window.changeSlide = changeSlide;
window.showSlide = showSlide;

// List of positive adjectives to randomize
const positiveAdjectives = [
  "amazing",
  "incredible",
  "fantastic",
  "awesome",
  "spectacular",
  "outstanding",
  "brilliant",
  "extraordinary",
  "magnificent",
  "phenomenal",
  "stunning",
  "remarkable",
  "exceptional",
  "wonderful",
  "terrific"
];

function getRandomAdjective() {
  return positiveAdjectives[Math.floor(Math.random() * positiveAdjectives.length)];
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load games first, then initialize slideshow
  fetch("./config/games.json") 
    .then((response) => response.json())
    .then((data) => {
      gamesData = data;
      
      // Add categories to games if they don't exist
      gamesData.forEach(game => {
        if (!game.category) {
          // Assign categories based on game names
          const name = game.name.toLowerCase();
          if (name.includes('2048') || name.includes('puzzle') || name.includes('sudoku') || name.includes('tetris')) {
            game.category = 'puzzle';
          } else if (name.includes('1v1') || name.includes('shooter') || name.includes('battle') || name.includes('fight')) {
            game.category = 'action';
          } else if (name.includes('adventure') || name.includes('quest') || name.includes('dungeon') || name.includes('rpg')) {
            game.category = 'adventure';
          } else {
            game.category = 'action'; // Default category
          }
        }
      });
      
      // Initialize slideshow with actual games
      initSlideshow();
      displayFilteredGames(data); 
      updateStats();
    })
    .catch((error) => console.error("Error fetching games:", error));
  
  loadTheme();
  
  // Setup event listeners
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
  });
  
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearchInput);
  
  // Set title and subtitle with styling
  const titleElement = document.getElementById("title");
  const subtitleElement = document.getElementById("subtitle");
  
  if (titleElement) {
    titleElement.innerHTML = `${sitename}`;
    titleElement.style.cssText = `
      font-size: 4rem !important;
      font-weight: 900 !important;
      background: linear-gradient(135deg, var(--accent-color), var(--secondary-color), #ff6b6b, var(--accent-color)) !important;
      background-size: 300% 300% !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      margin-bottom: 15px !important;
      text-shadow: 0 0 40px rgba(199, 125, 255, 0.6) !important;
      animation: gradientShift 4s ease-in-out infinite, titleGlow 2s ease-in-out infinite alternate !important;
      letter-spacing: 2px !important;
      position: relative !important;
      text-transform: uppercase !important;
    `;
  }
  
  if (subtitleElement) {
    subtitleElement.innerHTML = `${subtext}`;
    subtitleElement.style.cssText = `
      font-size: 1.3rem !important;
      background: linear-gradient(90deg, var(--secondary-color), var(--accent-color)) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      font-weight: 400 !important;
      margin-top: 20px !important;
      opacity: 0.9 !important;
      letter-spacing: 1px !important;
      animation: subtitlePulse 3s ease-in-out infinite !important;
    `;
  }
});

