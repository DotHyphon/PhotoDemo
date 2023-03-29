//event listeners
document.querySelector('#searchForm').addEventListener('submit', searchImages);

const pexelsApiKey = 'HfZ4lA84j3fjeO4UUc4EIArKcrofmOhiaQUudScGZfk32D3cHl5ymP5i';

const slideShow = document.querySelector(".slideShow");
const slideImages = slideShow.children;
let currentSlide = 0;

let tryCount = 0;
let apiUrl = `https://api.pexels.com/v1/search?`;

const rand = Math.round(Math.random()*100);

//fetch images and add to image carousel
fetchPexels('background', 'landscape', slideImages.length, rand)
.then((data) => {
    for (i = 0; i < slideImages.length; i++) {
        //asign images to DOM
        slideImages[i].style.backgroundImage = `url(${data.photos[i].src.large})`;
        slideImages[i].href = data.photos[i].url;
        //asign photographer to DOM
        slideImages[i].children[0].innerHTML = data.photos[i].photographer;
      }
      console.log('got images successfully');
})
.catch((error) => {
});



//rotate slides
NextSlide();

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
        return await fetchPexels('background', orientation, perPage, 1);
        } else {
            console.error('failed to get images');
        }
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error fetching Pexels data:', error);
    }
  }

  function searchImages(e) { 
    e.preventDefault();
    if (e.target[0].value !== '') {
        fetchPexels(e.target[0].value, 'landscape', slideImages.length, 1)
        .then((data) => {
            for (i = 0; i < slideImages.length; i++) {
                //asign images to DOM
                slideImages[i].style.backgroundImage = `url(${data.photos[i].src.large})`;
                slideImages[i].href = data.photos[i].url;
                //asign photographer to DOM
                slideImages[i].children[0].innerHTML = data.photos[i].photographer;
            }
            console.log('got images successfully');
        })
        e.target[0].value = '';
    }
}