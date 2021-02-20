import "./assets/styles/styles.scss";
import "./index.scss";

// Cibler la div où insérer l'article
const articleContainerElement = document.querySelector(".articles-container");

const makeArticleInDOM = (articles) => {
  articleContainerElement.innerHTML = "";
  const articlesDOM = articles.map((article) => {
    // je cible mon template
    const template = document.querySelector("#article-template");
    // je clone son contenu
    // const clone = document.importNode(template.content, true);
    const clone = template.content.cloneNode(true);

    // je configure le clone
    // const img = clone.querySelector(".article-img");
    // img.setAttribute("src", article.img);

    //  Récupération de la date de création et mise en format
    const articleCreatedAt = new Date(article.createdAt).toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

    const h2 = clone.querySelector(".article-title");

    h2.textContent = article.title;

    const paragraphAuthor = clone.querySelector(".article-author");
    paragraphAuthor.textContent = `${article.author} - ${articleCreatedAt}`;

    const p = clone.querySelector(".article-content");
    p.textContent = article.content;

    // Ajout d'un boutton supp avec l'id de l'article en attribut
    const btnDelete = clone.querySelector(".article-actions .btn-danger");
    btnDelete.setAttribute("data-id", article._id);

    // AJout d'un btn modif avec l'id de l'article en attribut
    const btnEdit = clone.querySelector(".article-actions .btn-primary");
    btnEdit.setAttribute("data-id", article._id);

    // injecter avant le clone, on connait appendChild qui insère un enfant à la fin d'un parent. .before insère notre enfant à coté et juste avant un élement cible
    articleContainerElement.append(clone);
  });

  // Cibler TOUT les btn de modification
  const editButtons = articleContainerElement.querySelectorAll(".btn-primary");

  // Parcourir tout les btn de modifications
  editButtons.forEach((btn) => {
    // Ajout d'event listener sur les btn de modifications
    btn.addEventListener("click", (event) => {
      // Récupération de la target de l'envent
      const target = event.target;
      // Récupérerl'id de larticle via target.dataset
      const articleId = target.dataset.id;

      // Rediriger vers la page de modif d'article en récupérant l'id en parametre
      location.assign(`/form.html?articleId=${articleId}`);
    });
  });

  /* Parcourir tout les boutons dans la div article-containe */
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");

  // Ajout d'eventListener au btn delete
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      try {
        const target = event.target;
        const articleId = target.dataset.id;

        // Suppresion de l'article en fonction de l'id dans la DB
        const response = await fetch(
          `https://restapi.fr/api/articles/${articleId}`,
          {
            method: "DELETE",
          }
        );
        const body = await response.json();
        console.log(body);
        // Recharger la page article
        fetchArticles();
      } catch (error) {
        console.error(error);
      }
    });
  });
};

// Récupération de la liste des articles
const fetchArticles = async () => {
  try {
    // Envoi de la requete
    const response = await fetch("https://restapi.fr/api/articles");

    // Récupération du body de la réponse
    const articles = await response.json();

    // Creation d'un article dans le DOM
    makeArticleInDOM(articles);
  } catch (error) {
    console.error("error : ", error);
  }
};

// Invocation de la fonction
fetchArticles();
