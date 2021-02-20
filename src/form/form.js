import "../assets/styles/styles.scss";
import "./form.scss";

// Récupérer Les erreurs du formulaire et les mettre dans un array
let errors = [];

// Cibler la div error
const errorElement = document.querySelector("#errors");

// Cibler le bouton d'annulation dans le formulaire
const btnCancel = document.querySelector(".btn-secondary");

// Cibler le formulaire
const form = document.querySelector("form");

// Ajout d'écouteur d'evt sur le bouton annulation
btnCancel.addEventListener("click", () => {
  /* Rediriger vers la HomePage */
  location.assign("/index.html");
});

// Ajouter un écouteur au submit du form
form.addEventListener("submit", async (event) => {
  // Bloquer la soumission du form par défaut
  event.preventDefault();

  // Récupérer les données du formulaire
  const formData = new FormData(form);
  //  Transformer l'objet en format Json
  const article = Object.fromEntries(formData.entries());

  // Gérer les erreurs
  if (formIsValid(article)) {
    try {
      const json = JSON.stringify(article);

      // Récupérer les données grâce à l'API "fetch"
      const response = await fetch("https://restapi.fr/api/articles", {
        method: "POST",
        body: json,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status < 299) {
        /* Rediriger vers la HomePage */
        location.assign("/index.html");
      }
    } catch (error) {
      console.error(error);
    }
  }
});

const formIsValid = (article) => {
  // Ré iniatiliser le tableau d'erreur pour partir d'un array vide
  errors = [];
  if (
    !article.author ||
    !article.category ||
    !article.content ||
    !article.title
  ) {
    errors.push("Vous devez renseigner tous les champs");
  } else {
    errors = [];
  }

  if (errors.length) {
    let errorHTML = "";
    errors.forEach((error) => {
      errorHTML += `<li>${error}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};
