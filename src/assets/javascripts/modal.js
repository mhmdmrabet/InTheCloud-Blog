const body = document.querySelector("body");
let calc;
let modal;

// Creer un calc
const createCalc = () => {
  calc = document.createElement("div");
  calc.classList.add("calc");

  // Ajout d'un listener pour enlever la modal
  calc.addEventListener("click", () => {
    calc.remove();
  });
};

// Creer un modal
const createModal = (question) => {
  modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `<p>${question}</p>`;

  // Ajout de boutton cancel et valider
  const cancel = document.createElement("button");
  cancel.innerText = "Annuler";
  cancel.classList.add("btn", "btn-secondary");
  const confirm = document.createElement("button");
  confirm.innerText = "Confirmer";
  confirm.classList.add("btn", "btn-primary");

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
}
