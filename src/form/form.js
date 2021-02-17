import "../assets/styles/styles.scss";
import "./form.scss";

// Récupérer Les erreurs du formulaire et les mettre dans un array
let errors = [];

const errorElement = document.querySelector("#errors");

// Cibler le formulaire
const form = document.querySelector("form");
// Ajouter un écouteur au submit du form
form.addEventListener("submit", (event) => {
  // Bloquer la soumission du form par défaut
  event.preventDefault();

  // Récupérer les données du formulaire
  const formData = new FormData(form);
  //  Transformer l'objet en format Json
  const article = Object.fromEntries(formData.entries());

  // Gérer les erreurs
  if (formIsValid(article)) {
    const json = JSON.stringify(article);
  }
});

const formIsValid = (article) => {
  if (!article.author || !article.category || !article.content) {
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
  } else {
    errorElement.innerHTML = "";
  }
};
