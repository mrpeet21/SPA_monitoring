
const STORAGE_KEY = "mongo-tutorial-progress";

function getProgress(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function setProgress(v){ localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); }
function markDone(id){
  const current = getProgress();
  if(!current.includes(id)){ current.push(id); setProgress(current); }
}
function resetProgress(){
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
function renderProgress(){
  const progress = getProgress();
  document.querySelectorAll("[data-progress-count]").forEach(el => {
    el.textContent = `${progress.length}/5`;
  });
  document.querySelectorAll("[data-progress-fill]").forEach(el => {
    el.style.width = `${Math.round(progress.length/5*100)}%`;
  });
  document.querySelectorAll("[data-level-status]").forEach(el => {
    const id = Number(el.dataset.levelStatus);
    if(progress.includes(id)){
      el.textContent = "Пройдено";
      el.classList.add("done");
    }else{
      el.textContent = "Не пройден";
      el.classList.remove("done");
    }
  });
  document.querySelectorAll("[data-level-complete]").forEach(el => {
    const id = Number(el.dataset.levelComplete);
    if(progress.includes(id)){
      el.textContent = "Уровень пройден";
      el.classList.add("done");
    }else{
      el.textContent = "Уровень не завершён";
      el.classList.remove("done");
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  renderProgress();
  document.querySelectorAll("[data-reset]").forEach(btn => btn.addEventListener("click", resetProgress));
  document.querySelectorAll("[data-quiz]").forEach(block => {
    const answers = JSON.parse(block.dataset.answers);
    const levelId = Number(block.dataset.quiz);
    const btn = block.querySelector("[data-check]");
    const result = block.querySelector("[data-result]");
    btn.addEventListener("click", () => {
      let score = 0;
      answers.forEach((answer, qIndex) => {
        const selected = block.querySelector(`input[name="q${levelId}_${qIndex}"]:checked`);
        block.querySelectorAll(`[data-q="${qIndex}"] .quiz-option`).forEach((opt, optIndex) => {
          opt.classList.remove("correct","wrong");
          if(optIndex === answer) opt.classList.add("correct");
          if(selected && Number(selected.value) === optIndex && optIndex !== answer) opt.classList.add("wrong");
        });
        const expl = block.querySelector(`[data-expl="${qIndex}"]`);
        if(expl) expl.classList.add("show");
        if(selected && Number(selected.value) === answer) score++;
      });
      if(score === answers.length){
        markDone(levelId);
        result.className = "result pass";
        result.textContent = `Результат: ${score}/${answers.length}. Уровень засчитан.`;
      }else{
        result.className = "result fail";
        result.textContent = `Результат: ${score}/${answers.length}. Попробуйте ещё раз — пояснения уже показаны ниже вопросов.`;
      }
      renderProgress();
    });
  });
});
