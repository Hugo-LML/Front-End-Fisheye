// Template for photographer elements
function photographerTemplate(data) {
  const { city, country, id, name, price, tagline, portrait } = data;

  const picture = `assets/photographers/${portrait}`;

  // Get the photographer card DOM element
  function getUserCardDOM() {
    const article = document.createElement("article");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const h2 = document.createElement("h2");
    const locationTag = document.createElement("p");
    const cityTag = document.createElement("span");
    const countryTag = document.createElement("span");
    const taglineTag = document.createElement("p");
    const priceTag = document.createElement("p");

    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    h2.textContent = name;
    cityTag.textContent = `${city}, `;
    countryTag.textContent = country;
    taglineTag.textContent = tagline;
    priceTag.textContent = `${price}€/jour`;
    a.setAttribute("href", `photographer.html?id=${id}`);
    a.setAttribute("title", name);
    a.setAttribute("aria-label", name);
    a.appendChild(img);
    a.appendChild(h2);
    article.appendChild(a);
    locationTag.appendChild(cityTag);
    locationTag.appendChild(countryTag);
    article.appendChild(locationTag);
    article.appendChild(taglineTag);
    article.appendChild(priceTag);

    return article;
  }
  return { name, picture, getUserCardDOM };
}
