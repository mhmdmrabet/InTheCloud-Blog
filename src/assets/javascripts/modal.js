const body = document.querySelector("body");
let calc;
let modal;
let cancel;
let confirm;

// Creer un calc
const createCalc = () => {
  calc = document.createElement("div");
  calc.classList.add("calc");
};

// Creer un modal
const createModal = (question) => {
  modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `<p>${question}</p>`;

  // Ajout de boutton cancel et valider
  cancel = document.createElement("button");
  cancel.innerText = "Annuler";
  cancel.classList.add("btn", "btn-secondary");
  confirm = document.createElement("button");
  confirm.innerText = "Confirmer";
  confirm.classList.add("btn", "btn-primary");

  // Stopper la propagation de l'event
  modal.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  //
  modal.append(cancel, confirm);
};

// Afficher une modal pour confirmer qu'il est sur de supprimer
export function openModal(question) {
  createCalc();
  createModal(question);

  // Ajouter la modal dans le calc
  calc.append(modal);

  // Ajouter le calc dans le body
  body.append(calc);

  //   Création d'un promise
  return new Promise((resolve, reject) => {
    // Ajout d'un listener pour enlever la modal
    // Permet de resolve la promise
    calc.addEventListener("click", () => {
      resolve(false);
      calc.remove();
    });

    // Ajout d'un event listener sur les boutons cancel et confirm
    cancel.addEventListener("click", () => {
      resolve(false);
      calc.remove();
    });
    confirm.addEventListener("click", () => {
      resolve(true);
      calc.remove();
    });
  });
}
