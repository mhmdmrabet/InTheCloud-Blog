import "./assets/styles/styles.scss";
import "./index.scss";

// Cibler la div où insérer l'article
const articleContainerElement = document.querySelector(".articles-container");

//  Récupérer la référence du menu categories
const categoriesContainerElement = document.querySelector(".categories");

// Cibler le select pour le tri par date
const selectELement = document.querySelector("select");

// Filtre par catégory
let filter;

// Initialisation de la variables articles
let articles;

// Par défaut pour le tri par date
let sortBy = "desc";

// Ecouter le changement de valeur du selectElement
selectELement.addEventListener("change", () => {
  // changer la valeur du sortBy par rapport à la value récupérer dans le select
  sortBy = selectELement.value;
  // Invocation de la méthode pour effectuer le tri par rapport à ce que l'on récupére dans le select
  fetchArticles();
});

const makeArticleInDOM = () => {
  articleContainerElement.innerHTML = "";
  // Filtrer les articles par rapport à notre filtre
  const articlesDOM = articles
    .filter((article) => {
      // Vérifier s'il la varible filtre est initialiser
      if (filter) {
        // Retourner l'article filtrer
        return article.category === filter;
      } else {
        return true;
      }
    })
    .map((article) => {
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

// Affiche le menu avec les catégories
const displayMenuCategories = (categoriesArray) => {
  //
  const liElements = categoriesArray.map((categoryElement) => {
    // Création d'un contenu HTML
    const li = document.createElement("li");
    li.innerHTML = `${categoryElement[0]} (<strong>${categoryElement[1]}</strong>)`;

    console.log(categoryElement[0]);
    // Vérifie si la catégorie selectionné est le filtre qu'on lui a appliquer
    // On lui rajoute une classe active
    if (categoryElement[0] === filter) {
      li.classList.add("active");
    }

    // Ajout d'un evt listener
    // Au click on va modifier la valeur de filter avec la valeur de la catégorie cliquer
    li.addEventListener("click", () => {
      // Donner la possibilité de retirer le filtre
      // si le filtre a déjà été sélectionner
      // SINON on filtre avec notre filtre de catégorie
      if (filter === categoryElement[0]) {
        // On réassigne le filtre à une valeur null
        filter = null;
        // Retire les class active
        li.classList.remove("active");
        // On rappel la fonction pour créer la liste d'articles
        makeArticleInDOM();
      } else {
        filter = categoryElement[0];
        // Vider toutes les classe "actives" de tout les li présent dans liElements
        liElements.forEach((element) => {
          element.classList.remove("active");
        });
        // Ajouter une classe active lorsqu'on clique sur la catégorie
        li.classList.add("active");
        // On re créer la liste des articles filtrer
        makeArticleInDOM();
      }
    });

    // Retourne un nouvel elmt HTML
    return li;
  });
  categoriesContainerElement.innerHTML = "";
  categoriesContainerElement.append(...liElements);
};

// Transformer la liste d'articles pour créer le menu catégories
const createMenuCategories = () => {
  // Regrouper par catégories
  // Pour chaque nouvelle catégories on va créer l'insérer dans le menu
  // Si la catégorie est déjà présente , on va incrémenter le nombre
  //  Itérer Sur le tableau

  // Creation d'un objet avec la méthode "réduce"
  // L'accumulateur c'est un objet vide
  // A chaque itération on récupère 1 article de notres liste d'articles
  const categories = articles.reduce((accumulateur, article) => {
    // Dans l'objet accumulateur on va définir une clé
    // On va lui attribuer une valeur
    // Soit la valeur est déjà présente dans liste catégorie de notre menu et dans ce cas là on va incrémenter la valeur dans notre objet
    // Soit la valeur n'est pas présente et dans cas là on va assigner la valeur de 1
    if (accumulateur[article.category]) {
      accumulateur[article.category]++;
    } else {
      accumulateur[article.category] = 1;
    }
    // Dans un reduce il faut TOUJOURS retourne l'accumulateur
    return accumulateur;
  }, {});

  // A partir de cet objet, on va créer un tableau
  // On Map sur ce tableau pour que chaque valeur soit un tableau (nomDeLaCategorie, nombre)
  const categoriesArray = Object.keys(categories)
    .map((category) => {
      // Récupére le nom de chaque catégorie avec la valeur de CETTE categorie contenu dans l'objet accumulateur
      return [category, categories[category]];
    })
    // Création du tri par ordre alphabétique
    .sort((c1, c2) => c1[0].localeCompare(c2[0]));

  // Invocation de la fonction pour afficher la liste des catégories
  displayMenuCategories(categoriesArray);
};

// Récupération de la liste des articles
const fetchArticles = async () => {
  try {
    // Envoi de la requete
    const response = await fetch(
      // Récupération du filtre par date que je passe dans le param de la requete
      `https://restapi.fr/api/articles?sort=createdAt:${sortBy}`
    );

    // Récupération du body de la réponse
    articles = await response.json();

    // Création du menu de catégories
    createMenuCategories();

    // Creation d'un article dans le DOM
    makeArticleInDOM();
  } catch (error) {
    console.error("error : ", error);
  }
};

// Invocation de la fonction
fetchArticles();
