// Template for photo elements
function photoTemplate(data) {
  const { id, title, image, video, likes } = data;
  const likedPhotos = [];

  // Get the photo DOM element
  function getPhotoDOM() {
    const article = document.createElement("article");
    const button = document.createElement("button");
    const img = document.createElement("img");
    const photoSrc = `assets/photos/${image ?? video}`;

    // If the photo is a video, convert it to an image
    if (video) {
      const videoElement = document.createElement("video");
      videoElement.src = photoSrc;
      videoElement.currentTime = 1;

      videoElement.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        img.src = canvas.toDataURL();
        img.setAttribute("data-url", video);
      });

      videoElement.load();
    } else {
      img.setAttribute("src", photoSrc);
    }
    img.setAttribute("alt", title);

    const photoInfos = document.createElement("div");
    const titleTag = document.createElement("p");
    const likesContainer = document.createElement("button");
    const likesTag = document.createElement("p");
    const heartIcon = document.createElement("img");

    titleTag.textContent = title;
    likesTag.textContent = likes;
    heartIcon.setAttribute("src", "assets/icons/heart.svg");
    heartIcon.setAttribute("alt", "Heart icon");
    button.setAttribute("aria-label", `${title}, close-up view`);
    button.appendChild(img);
    article.appendChild(button);
    article.appendChild(photoInfos);
    photoInfos.appendChild(titleTag);
    photoInfos.appendChild(likesContainer);
    likesContainer.appendChild(likesTag);
    likesContainer.appendChild(heartIcon);

    // Update the total likes and the current photo likes
    let currentLikes = likes;
    likesContainer.addEventListener("click", () => {
      if (likedPhotos.includes(id)) {
        likedPhotos.splice(likedPhotos.indexOf(id), 1);
        currentLikes--;
        updateTotalLikes(-1);
      } else {
        likedPhotos.push(id);
        currentLikes++;
        updateTotalLikes(1);
      }
      likesTag.textContent = currentLikes;
    });

    return article;
  }

  return { getPhotoDOM };
}
