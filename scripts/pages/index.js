// Get the photographers data from the JSON file
async function getPhotographers() {
  let data = await fetch("data/photographers.json");
  let photographers = await data.json().then((data) => data.photographers);

  return photographers;
}

// Display the photographers data
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const photographers = await getPhotographers();
  displayData(photographers);
}

init();
