// Get the current photographer based on the id parameter
async function getPhotographer(id) {
	let data = await fetch("data/photographers.json");
  let photographers = await data.json().then((data) => data.photographers);
  let photographer = photographers.find((photographer) => photographer.id === Number(id));

  return photographer;
}

// Get the photos of the current photographer based on the id parameter
async function getPhotos(id) {
  let data = await fetch("data/photographers.json");
  let media = await data.json().then((data) => data.media);
  let photos = media.filter((photo) => photo.photographerId === Number(id));

  return photos;
}

// Set the photographer informations in the DOM
function setPhotographerInfos(photographer) {
  const { city, country, name, tagline, portrait } = photographer;

  const picture = `assets/photographers/${portrait}`;
  const photographerName = document.querySelector(".photographer_name");
  const photographerLocation = document.querySelector(".photographer_location");
  const photographerTagline = document.querySelector(".photographer_tagline");
  const photographerPortrait = document.querySelector(".photographer_portrait");

  photographerName.textContent = name;
  photographerLocation.textContent = `${city}, ${country}`;
  photographerTagline.textContent = tagline;
  photographerPortrait.setAttribute("src", picture);
  photographerPortrait.setAttribute("alt", name);
}

// Set the photos in the DOM
let photos = [];
function setPhotos(photos) {
  const photoSection = document.querySelector(".photo_section");
  photoSection.innerHTML = "";

  photos.forEach((photo) => {
    const photoModel = photoTemplate(photo);
    const photoDOM = photoModel.getPhotoDOM();
    photoSection.appendChild(photoDOM);
  });

  // Add event listeners to the photos to open the lightbox modal
	const imageButtons = document.querySelectorAll(".photo_section article > button");
	imageButtons.forEach((imageBtn) => {
    const image = imageBtn.querySelector("img") ?? imageBtn.querySelector("video");
		imageBtn.addEventListener("click", () => openLightboxModal(image));
    imageBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        openLightboxModal(image);
      }
    });
	});
}

// Sort the photos based on the selected option
function sortPhotos(photos, sort) {
  if (sort === "popular") {
    return photos.sort((a, b) => b.likes - a.likes);
  } else if (sort === "date") {
    return photos.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sort === "title") {
    return photos.sort((a, b) => a.title.localeCompare(b.title));
  }
}

// Update the photos order when the select is changed
document.getElementById("sort").addEventListener("change", (event) => {
  const sortedPhotos = sortPhotos(photos, event.target.value);
  setPhotos(sortedPhotos);
});

// Lightbox modal
const lightboxModal = document.getElementById("lightbox_modal");
const wrapper = document.getElementById("photographer_wrapper");
const body = document.querySelector("body");

// Open the lightbox modal with the selected photo
const openLightboxModal = (photo) => {
  lightboxModal.style.display = "block";
  lightboxModal.setAttribute("aria-hidden", "false");
  wrapper.setAttribute("aria-hidden", "true");

  setLightboxImage(photo);
};

// Set the lightbox image and its description
const setLightboxImage = (photo) => {
  const container = document.querySelector(".lightbox_image_container");
  container.innerHTML = '';
  
  const videoUrl = photo.getAttribute("data-url");
  if (videoUrl) {
    const video = document.createElement("video");
    const source = document.createElement("source");
    source.setAttribute("src", `/assets/photos/${videoUrl}`);
    source.setAttribute("type", "video/mp4");
    video.setAttribute("width", 600);
    video.setAttribute("height", 600);
    video.setAttribute("controls", true);
    video.appendChild(source);
    container.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.setAttribute("src", photo.src);
    img.setAttribute("alt", photo.alt);
    container.appendChild(img);
  }
  const p = document.querySelector(".lightbox_image p");

  p.textContent = photo.alt;
};

// Change the lightbox image based on the direction parameter
const changeImage = (direction) => {
  const images = Array.from(document.querySelectorAll(".photo_section article button:first-child img"));
  const currentImg =
    document.querySelector(".lightbox_image_container img") ??
    document.querySelector(".lightbox_image_container video source");
  let newIndex;
  if (currentImg.nodeName === "IMG") {
    const currentIndex = images.findIndex((image) => image.src === currentImg.src);
    newIndex = currentIndex + direction;
  } else {
    const currentIndex = images.findIndex((image) => image.dataset.url === currentImg.src.split('/').pop());
    newIndex = currentIndex + direction;
  }

  if (images[newIndex]) {
    setLightboxImage(images[newIndex]);
  }
};

// Add event listeners to the lightbox navigation buttons
document.querySelector(".lightbox_content .prev").addEventListener("click", () => changeImage(-1));
document.querySelector(".lightbox_content .next").addEventListener("click", () => changeImage(1));

// Handle the key events to navigate through the lightbox images
document.addEventListener("keydown", (e) => {
	if (lightboxModal.getAttribute("aria-hidden") === "false") {
		if (e.key === "Escape") {
			closeLightboxModal();
		} else if (e.key === "ArrowRight") {
			changeImage(1);
		} else if (e.key === "ArrowLeft") {
			changeImage(-1);
		}
	}
});

// Close the lightbox modal
const closeLightboxModal = () => {
  lightboxModal.style.display = "none";
  lightboxModal.setAttribute("aria-hidden", "true");
  wrapper.setAttribute("aria-hidden", "false");
  body.style.overflow = "auto";
};

const lightboxCloseBtn = document.querySelector(".lightbox_content button:first-child");
lightboxCloseBtn.addEventListener("click", closeLightboxModal);

// Update the total likes in the aside section
let totalLikes = 0;
function updateTotalLikes(change) {
  totalLikes += change;
  document.querySelector("aside div p").textContent = totalLikes;
}

// Set the aside section informations
function setAsideInfos(photographer, photos) {
  const { price } = photographer;
  totalLikes = photos.reduce((acc, photo) => acc + photo.likes, 0);

  const likesTag = document.querySelector("aside div p");
  const priceTag = document.querySelector(".daily-price");

  likesTag.textContent = totalLikes;
  priceTag.textContent = `${price}€ / jour`;
}

// Set the contact modal title based on the photographer name
function setModalTitle(name) {
  const title = document.getElementById("modal_title");
  title.textContent = `Contactez-moi ${name}`;
}

async function init() {
	// Get the photographer id from the URL
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  let photographer = await getPhotographer(id);
  photos = await getPhotos(id);

	// Display the photographer and photos data
  setPhotographerInfos(photographer);
  setPhotos(photos);
  setAsideInfos(photographer, photos);
  setModalTitle(photographer.name);
}

init();
