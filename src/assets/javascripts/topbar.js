// Récupération de l'icone
const iconMobile = document.querySelector(".header-menu-icon");

// Récupération du header-menu
const headerMenu = document.querySelector(".header-menu");

// Le menu est ouvert ou fermer, par défaut il est fermer
let isMenuOpen = false;

// Représentation du menu dans le DOM
let mobileMenuDOM = null;

// Fonction qui permet de créer un menu mobile
const createMobileMenu = () => {
  mobileMenuDOM = document.createElement("div");
  mobileMenuDOM.classList.add("mobile-menu");
  // Stopper la propagation de l'event pour ne pas que ça atteinge la window car on a mis en place un ecouteur d'événement
  mobileMenuDOM.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  // Copier notre nav non mobile à l'intérieur de ce menu version mobile
  // Récupération de la copie d'un élément avec la méthode "cloneNode" et insertion dans le nouveau menu
  mobileMenuDOM.append(headerMenu.querySelector("ul").cloneNode(true));
  // Ajout de l'élement dans la div "headerMenu"
  headerMenu.append(mobileMenuDOM);
};

const closeMenu = () => {
  // Retirer la classe "open" pour display le menu
  mobileMenuDOM.classList.remove("open");
};

// OUverture du menu
const openMenu = () => {
  // Vérification si le menu a été créer ou pas
  if (mobileMenuDOM) {
    // S'il a été créé
  } else {
    // S'il n'a pas été créer, on le créer
    createMobileMenu();
  }
  // Ajout de la class "open"
  mobileMenuDOM.classList.add("open");
};

const toggleMobileMenu = (event) => {
  //   Vérifier si le menu est ouvert ou fermer
  if (isMenuOpen) {
    //   S'il est est ouver on le ferme
    closeMenu();
  } else {
    //   S'il est fermer on l'ouvre
    openMenu();
  }

  //   L'inverse de valeur actuel de isMenuOpen
  isMenuOpen = !isMenuOpen;
};

iconMobile.addEventListener("click", (event) => {
  // Stopper la propagation de l'event pour ne pas que ça atteinge la window car on a mis en place un ecouteur d'événement
  event.stopPropagation();
  toggleMobileMenu();
});

// Au click de la page, fermer le menu mobile
window.addEventListener("click", () => {
  if (isMenuOpen) {
    toggleMobileMenu();
  }
});

// Quand on change la largeur du menu, on veut enlever le menu mobile
window.addEventListener("resize", (event) => {
  //   Récupérer la largeur de la window
  //   Si la largeur de window est supérieur à 480px
  // && Le menu est ouvert
  if (window.innerWidth > 480 && isMenuOpen) {
    // On invoque la fonction de toggle
    toggleMobileMenu();
  }
});
