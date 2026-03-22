const exercises = ["Benkpress", "Squat", "Markløft", "Pullups m/vekt", "Dips m/vekt"];

function loadExercises() {
  const container = document.getElementById("exercisesContainer");
  container.innerHTML = "";

  exercises.forEach(ex => {
    const pr = parseFloat(localStorage.getItem(`${ex}-pr`)) || 0;
    const goal = parseFloat(localStorage.getItem(`${ex}-goal`)) || 0;
    const progressPercent = calcProgress(pr, goal);

    const card = document.createElement("div");
    card.className = "card";

    // Fargekode: rød <50%, gul 50-79%, grønn 80-100%
    let color = "#dc3545"; // rød
    if (progressPercent >= 80) color = "#28a745"; // grønn
    else if (progressPercent >= 50) color = "#ffc107"; // gul

    card.innerHTML = `
      <h2>${ex}</h2>
      <p>1RM PR: <span class="pr">${pr}</span> kg</p>
      <p class="goal">Mål: <span>${goal}</span> kg</p>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width:0%; background:${color};"></div>
      </div>
      <p class="progress-text">${progressPercent}%</p>

      <input type="number" class="weightInput" placeholder="Vekt (kg)">
      <input type="number" class="repsInput" placeholder="Reps">
      <input type="number" class="goalInput" placeholder="Mål">
      <button class="saveBtn">Lagre</button>
    `;

    container.appendChild(card);

    const saveBtn = card.querySelector(".saveBtn");
    saveBtn.addEventListener("click", () => saveExercise(ex, card));

    // Sett progress bar med animasjon
    const bar = card.querySelector(".progress-bar");
    setTimeout(() => {
      bar.style.width = `${progressPercent}%`;
    }, 50);
  });
}

function calcProgress(pr, goal) {
  if (!goal || goal == 0) return 0;
  return Math.min(100, Math.round((pr / goal) * 100));
}

function saveExercise(exercise, card) {
  const weightInput = card.querySelector(".weightInput").value;
  const repsInput = card.querySelector(".repsInput").value;
  const goalInput = card.querySelector(".goalInput").value;

  // Hent tidligere verdier
  let oldPR = parseFloat(localStorage.getItem(`${exercise}-pr`)) || 0;
  let oldGoal = parseFloat(localStorage.getItem(`${exercise}-goal`)) || 0;

  let newPR = oldPR;
  let newGoal = oldGoal;

  // Oppdater 1RM PR hvis vekt og reps fylt ut
  if (weightInput && repsInput) {
    const weight = parseFloat(weightInput);
    const reps = parseInt(repsInput);
    newPR = Math.round(weight * (1 + reps / 30));
  }

  // Oppdater mål hvis målInput fylt ut
  if (goalInput) {
    newGoal = parseFloat(goalInput);
  }

  // Hvis mål fortsatt tomt (første gang), sett det til PR
  if (!newGoal || newGoal == 0) newGoal = newPR;

  localStorage.setItem(`${exercise}-pr`, newPR);
  localStorage.setItem(`${exercise}-goal`, newGoal);

  loadExercises();
}

// Init
loadExercises();