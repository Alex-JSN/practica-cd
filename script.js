const stages = [
  {
    key: "build",
    label: "Artefacto creado",
    detail: "Se generó la versión v1.0.0. El mismo artefacto continuará por el flujo."
  },
  {
    key: "test",
    label: "Pruebas aprobadas",
    detail: "Las comprobaciones terminaron correctamente. La versión puede avanzar."
  },
  {
    key: "staging",
    label: "Preproducción lista",
    detail: "La versión está disponible en un ambiente de validación antes de producción."
  },
  {
    key: "deploy",
    label: "Despliegue completado",
    detail: "La versión v1.0.0 ya está publicada en producción. ¡Misión cumplida!"
  }
];

const cards = Array.from(document.querySelectorAll(".stage-card"));
const buttons = Array.from(document.querySelectorAll("[data-action]"));
const message = document.getElementById("mission-message");
const log = document.getElementById("activity-log");
const scoreOutput = document.getElementById("score");
const statusOutput = document.getElementById("overall-status");
const runner = document.getElementById("artifact-runner");
const railFill = document.getElementById("rail-fill");
const resetButton = document.getElementById("reset-button");

let completed = 0;
let score = 0;

function render() {
  cards.forEach((card, index) => {
    const state = index < completed ? "complete" : index === completed ? "active" : "locked";
    card.dataset.state = state;
    const stateLabel = card.querySelector(".stage-state");
    const action = card.querySelector(".action-button");

    stateLabel.textContent = state === "complete" ? "COMPLETADO" : state === "active" ? "LISTO" : "BLOQUEADO";
    action.disabled = state !== "active";
  });

  const progress = completed / stages.length;
  const tokenPosition = 1 + progress * 92;
  runner.style.left = `${tokenPosition}%`;
  railFill.style.width = `${progress * 100}%`;
  scoreOutput.textContent = String(score).padStart(3, "0");

  if (completed === 0) {
    message.textContent = "Tu cambio está listo. Construye el artefacto para comenzar.";
    statusOutput.textContent = "EN ESPERA";
    statusOutput.classList.remove("is-done");
  } else if (completed === stages.length) {
    message.textContent = "¡Liberación exitosa! El artefacto recorrió todas las etapas.";
    statusOutput.textContent = "MISIÓN CUMPLIDA";
    statusOutput.classList.add("is-done");
  } else {
    message.textContent = `Siguiente etapa: ${stages[completed].label.toLowerCase()}.`;
    statusOutput.textContent = "EN PROGRESO";
    statusOutput.classList.remove("is-done");
  }
}

function completeStage() {
  if (completed >= stages.length) return;

  const currentStage = stages[completed];
  const currentCard = cards[completed];
  const actionButton = currentCard.querySelector(".action-button");
  actionButton.textContent = "✓ " + currentStage.label;
  currentCard.classList.add("stage-complete-pop");

  completed += 1;
  score += 100;
  log.textContent = `${currentStage.detail} +100 puntos.`;
  runner.classList.add("is-moving");
  window.setTimeout(() => runner.classList.remove("is-moving"), 500);
  render();
}

buttons.forEach((button) => button.addEventListener("click", completeStage));

resetButton.addEventListener("click", () => {
  completed = 0;
  score = 0;
  buttons.forEach((button, index) => {
    button.textContent = ["Crear artefacto", "Ejecutar pruebas", "Enviar a preproducción", "Desplegar versión"][index];
  });
  cards.forEach((card) => card.classList.remove("stage-complete-pop"));
  log.textContent = "Misión reiniciada. Crea el artefacto para comenzar otra vez.";
  render();
});

render();
