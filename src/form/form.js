import "../assets/styles/styles.scss";
import "./form.scss";

// Récupération de l'articleId dans le paramURL
let articleId = null;

// Récupérer Les erreurs du formulaire et les mettre dans un array
let errors = [];

// Cibler la div error
const errorElement = document.querySelector("#errors");

// Cibler le bouton d'annulation dans le formulaire
const btnCancel = document.querySelector(".btn-secondary");

// Cibler le formulaire
const form = document.querySelector("form");

/*  */
const fillForm = (article) => {
  // Récupération une référence de nos input
  const author = document.querySelector("input[name='author']");
  const category = document.querySelector("input[name='category']");
  const title = document.querySelector("input[name='title']");
  const content = document.querySelector("textarea");

  author.value = article.author || "";
  category.value = article.category || "";
  title.value = article.title || "";
  content.value = article.content || "";
};

/* Vérifier si on récupére un articleId dans le param */
const initForm = async () => {
  // Récupération du param dans l'url
  const params = new URL(location.href);
  articleId = params.searchParams.get("articleId");

  // Vérifier qu'on a l'id dans le param
  if (articleId) {
    // Récupérer l'article
    const response = await fetch(
      `https://restapi.fr/api/articles/${articleId}`
    );
    // Si le fetch foncitonne bien, on récupere les data en JSON
    if (response.status < 300) {
      // Récupérer le contenu de la réponse
      const article = await response.json();

      // Remplir les champs avec les data
      fillForm(article);
    }
  }

  //
};

// Invocation de la méthode
initForm();

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

      // SI articleID est définit on envoi la requete en PATCH
      // SINON en POST
      let response = null;
      console.log(articleId);
      if (articleId) {
        // Modifier les données grâce à l'API "fetch"
        response = await fetch(`https://restapi.fr/api/articles/${articleId}`, {
          method: "PATCH",
          body: json,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // Envoyer les données grâce à l'API "fetch"
        response = await fetch("https://restapi.fr/api/articles", {
          method: "POST",
          body: json,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status < 300) {
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
