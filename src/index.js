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

    const h2 = clone.querySelector(".article-title");
    h2.textContent = `${article.title} - ${article.category}`;

    const paragraphAuthor = clone.querySelector(".article-author");
    paragraphAuthor.textContent = article.author;

    const p = clone.querySelector(".article-content");
    p.textContent = article.content;

    const btn = clone.querySelector(".article-actions .btn-danger");
    btn.setAttribute("data-id", article._id);

    // injecter avant le clone, on connait appendChild qui insère un enfant à la fin d'un parent. .before insère notre enfant à coté et juste avant un élement cible
    articleContainerElement.append(clone);
  });

  /* Parcourir tout les boutons dans la div article-containe */
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");

  // Ajout d'eventListener
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
