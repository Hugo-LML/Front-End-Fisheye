const modalBg = document.getElementById("contact_modal");

// Open or close the contact modal depending on the action parameter
function toggleModal(action) {
  const wrapper = document.getElementById("photographer_wrapper");
  const closeBtn = document.getElementById("modal_close_btn");
  const body = document.querySelector("body");

  modalBg.style.display = action === "open" ? "block" : "none";
  modalBg.setAttribute("aria-hidden", action === "open" ? "false" : "true");
  wrapper.setAttribute("aria-hidden", action === "open" ? "true" : "false");
  body.style.overflow = action === "open" ? "hidden" : "auto";

  action === "open" && closeBtn.focus();
}

// Open the contact modal when the contact button is clicked
const contactBtn = document.querySelector(".photographer_header .contact_button");
contactBtn.addEventListener("click", () => toggleModal("open"));

// Console log the form data when the form is submitted
const form = document.forms["contact"];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    console.log(input.name, input.value);
  });
  form.reset();
  toggleModal("close");
});

// Handle the escape key to close the modal
function init() {
  document.addEventListener("keydown", (e) => {
    if (modalBg.getAttribute("aria-hidden") === "false" && e.key === "Escape") {
      toggleModal("close");
    }
  });
}

init();
