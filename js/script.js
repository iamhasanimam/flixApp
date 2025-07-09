// 'use strict';

const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 1,
  },

  api: {
    apiKey: '7e1fd3cbb89626def008fba6b73bff08',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

// console.log(global.currentPage);

// diplay 20 most popular movies

async function diplayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  // console.log(results);

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `
            <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
            `
              : `
           <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />
            `
          }
      
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release:${movie.release_date}</small>
            </p>
          </div>
           `;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// diplay 20 most tv shows

async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  // console.log(results);

  results.forEach(show => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
          ${
            show.poster_path
              ? `
            <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />
            `
              : `
           <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />
            `
          }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release:${show.first_air_date}</small>
            </p>
          </div>
           `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

// Fetch data from TMDB API

async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// Make request to search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// Hiighlight ActiveLInk
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Diplay movies details
async function displayMovieDetails() {
  const movieID = window.location.search.split('=')[1];
  console.log(movieID);
  const movie = await fetchAPIData(`movie/${movieID}`);
  console.log(movie);
  const div = document.createElement('div');

  // Overlay for BG image
  displayBackgroundImage('movie', movie.backdrop_path);

  div.innerHTML = `
   <div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `
            <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
            `
              : `
           <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />
            `
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
             ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
          ${movie.genres.map(genre => `<li> ${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> Released</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies
            .map(company => `<span>${company.name} </span>`)
            .join('')}
          </div>
        </div>
      </div>
  `;
  document.querySelector('#movie-details').appendChild(div);
}

// Display show details

async function displayShowDetails() {
  const showID = window.location.search.split('=')[1];
  // console.log(showID);

  const show = await fetchAPIData(`tv/${showID}`);
  // console.log(show);

  const div = document.createElement('div');
  // Overlay for BG image
  displayBackgroundImage('show', show.backdrop_path);

  div.innerHTML = `
   <div class="details-top">
          <div>
          ${
            show.poster_path
              ? `
            <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />
            `
              : `
           <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />
            `
          }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>
             ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
          ${show.genres.map(genre => `<li> ${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>

         <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
            .map(company => `<span> ${company.name}</span>`)
            .join(',   ')}</div>
        </div>
      </div>
  `;
  document.querySelector('#show-details').appendChild(div);
}

// Display backdrop on Details Page

function displayBackgroundImage(type, backgroundPath) {
  const overLayDiv = document.createElement('div');
  overLayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;

  overLayDiv.style.backgroundSize = 'cover';
  overLayDiv.style.backgroundPosition = 'center';
  overLayDiv.style.backgroundRepeat = 'no-repeat';
  overLayDiv.style.height = `100vh`;
  overLayDiv.style.width = `100vw`;
  overLayDiv.style.position = 'absolute';
  overLayDiv.style.top = '0';
  overLayDiv.style.left = '0';
  overLayDiv.style.zIndex = '-1';
  overLayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overLayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overLayDiv);
  }
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// Show Aler

function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

// Search movies/shows
async function search() {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get('type'));
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');
  // console.log(global.search.type);
  // console.log(global.search.term);

  if (global.search.term !== '' && global.search.term !== null) {
    //@todo-make request and display result
    const { results, total_pages, page, total_results } = await searchAPIData();
    console.log(results);

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    // console.log(global.search.totalResults);

    if (results.length === 0) {
      showAlert('No results found');
      return;
    }
    displaySerachResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    showAlert('please enter search term');
  }
}

function displaySerachResults(results) {
  // clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
          ${
            result.poster_path
              ? `
            <img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? result.title : result.name
              }"
            />
            `
              : `
           <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? result.title : result.name
              }"
            />
            `
          }
      
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === 'movie' ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release:${
                global.search.type === 'movie'
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
           `;

    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

// Display pagination for search

function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector('#pagination').appendChild(div);

  //Disable prev button if first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, totalPages } = await searchAPIData();
    displaySerachResults(results);
  });

  // prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, totalPages } = await searchAPIData();
    displaySerachResults(results);
  });
}

// Display Slider movies
let swiper;
function initSwiper() {
  // Check if Swiper is already initialized
  if (!swiper) {
    swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true, // Enables continuous loop mode
      autoplay: {
        delay: 1000 / 2, // Adjust the delay as needed
        disableOnInteraction: true, // Ensures autoplay continues smoothly even after interaction
      },
      breakpoints: {
        500: {
          slidesPerView: 2,
        },
        700: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 7,
        },
      },
    });
    // Optional: pause autoplay on hover and resume on mouseleave
    swiper.el.addEventListener('mouseenter', () => swiper.autoplay.stop());
    swiper.el.addEventListener('mouseover', () => swiper.autoplay.stop());
    swiper.el.addEventListener('mouseleave', () => swiper.autoplay.start());
  }
}

// Display Slider movies only once to avoid reloads
async function displaySlider() {
  // Check if slider is already populated to avoid duplicating slides
  // if (document.querySelectorAll('.swiper-slide').length === 0) {
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>
      `;
    document.querySelector('.swiper-wrapper').appendChild(div);
  });

  // Initialize Swiper after slides have been added
  initSwiper();
}
// }

// Initialize application
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      // console.log('Home');
      displaySlider();
      diplayPopularMovies();
      break;
    case '/shows.html':
      // console.log('Shows');
      displayPopularShows();
      break;

    case '/movie-details.html':
      // console.log('Movie Details');
      displayMovieDetails();
      break;

    case '/tv-details.html':
      // console.log("TV Details");
      displayShowDetails();
      break;

    case '/search.html':
      search();
      // console.log('Search');
      break;
  }

  highlightActiveLink();
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}
document.addEventListener('DOMContentLoaded', init);
