

const pexelsApiKey = 'HfZ4lA84j3fjeO4UUc4EIArKcrofmOhiaQUudScGZfk32D3cHl5ymP5i';

const slideShow = document.querySelector(".slideShow");
const slideImages = slideShow.children;
let currentSlide = 0;

let tryCount = 0;
let apiUrl = `https://api.pexels.com/v1/search?`;

let nextPage = '';

//check for search query
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
//let searchQuery = randomWord();
let searchQuery = 'background';
console.log(searchQuery);
if (urlParams.has('search')) {
  searchQuery = urlParams.get('search');
}

//fetch images and add to image carousel
fetchPexels(searchQuery, '', slideImages.length + 12, 0)
.then((data) => {
  console.log('1');
  for (i = 0; i < slideImages.length; i++) {
    console.log('2');
    //asign images to DOM
    slideImages[i].style.backgroundImage = `url(${data.photos[i].src.large2x})`;
    slideImages[i].href = data.photos[i].url;
    //asign photographer to DOM
    slideImages[i].children[0].innerHTML = data.photos[i].photographer;
  }
  console.log('2');
  AddLoadedPhotos(data);
  
    console.log('got images successfully');
    const displaySearch = document.getElementById('displaySearch');
    displaySearch.innerHTML = `Showing results for "${searchQuery}"`;
})
.catch((error) => {
});


document.getElementById('loadMore').addEventListener('click', (e) => {
  e.preventDefault();
  LoadMore()
  .then((data) => {
    AddLoadedPhotos(data);
  });
});

//rotate slides
NextSlide();

function AddLoadedPhotos(data) {
  console.log('adding images to DOM');
  let gridSpan = [2, 1, 1, 2];
  for (i = 0; i < data.photos.length; i++) {
  document.getElementById('linksGrid').innerHTML += `
  <div style="height: 200px; grid-column: span ${gridSpan[i % 4]}; background-size: cover; background-position: center; background-image: url(${data.photos[i].src.large})"> 
  <a style="height: 100%; width: 100%;" href="${data.photos[i].url}" target="_blank"></a>  
  <h1>${data.photos[i].photographer}</h1>
  </div>
  `;
  gridSpan == 4 ? gridSpan = 1 : null;  
}
}

function NextSlide() {
    slideImages[currentSlide].className = "prev";
    slideImages[(currentSlide+1) % slideImages.length].className = "active";
    slideImages[(currentSlide+2) % slideImages.length].className = "inactive";
    slideImages[(currentSlide+3) % slideImages.length].className = "inactive";

    currentSlide++;
    currentSlide >= slideImages.length ? currentSlide = 0 : '';
    setTimeout(NextSlide, 5000);
}

// Function to fetch data from the Pexels API
async function fetchPexels(query, orientation, perPage, page) {
  apiUrl = `https://api.pexels.com/v1/search?query=${query}&orientation=${orientation}&per_page=${perPage}&page=${page}`;

  try {
  const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': pexelsApiKey,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.photos.length < perPage) {
      console.error('failed to get images, trying with default images');
      tryCount++;
      if (tryCount < 2) {
        searchQuery += ' : No Results';
        return await fetchPexels('background', orientation, perPage, 1);
      } else {
          console.error('failed to get images');
      }
    } else {
      nextPage = data.next_page;
      return data;
    }
  } catch (error) {
    if (tryCount < 2) {
      return await fetchPexels('background', orientation, perPage, 1);
      } else {
          console.error('failed to get images');
      }
  }
}

async function LoadMore() {
const loadText = document.getElementById('loadMore');
loadText.innerHTML = 'Loading...';
loadText.disabled = true;
loadText.style.cursor = 'not-allowed';
loadText.style.opacity = '0.5';
loadText.style.pointerEvents = 'none';

if (!nextPage) {
  throw new Error('No more images to load');
}
try {
  const response = await fetch(nextPage, {
      method: 'GET',
      headers: {
        'Authorization': pexelsApiKey,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    loadText.innerHTML = 'Load More';
    loadText.disabled = false;
    loadText.style.cursor = 'pointer';
    loadText.style.opacity = '1';
    loadText.style.pointerEvents = 'auto';
    nextPage = data.next_page;
    return data;
  }
  catch {
    console.error('failed to get images');
  }
}
