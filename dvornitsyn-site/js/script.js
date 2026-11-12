const page = document.querySelector(".page");
const chapters = document.querySelectorAll(".chapter");
const bar = document.querySelector("[data-progress]");
const dock = document.querySelector(".dock");
const formBlock = document.querySelector("#podbor");

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce) {
  page.classList.add("page--motion");
}

chapters.forEach((chapter) => {
  if (reduce || chapter.getBoundingClientRect().top < window.innerHeight * 0.92) {
    chapter.classList.add("chapter--in");
  }
});

if (!reduce && "IntersectionObserver" in window) {
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("chapter--in");
      seen.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });

  chapters.forEach((chapter) => {
    if (!chapter.classList.contains("chapter--in")) seen.observe(chapter);
  });
}

function updateProgress() {
  const scroller = document.scrollingElement || document.documentElement;
  const max = scroller.scrollHeight - scroller.clientHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / max)) : 0;
  bar.style.transform = "scaleX(" + progress + ")";
}

updateProgress();
document.addEventListener("scroll", updateProgress, { passive: true });

if ("IntersectionObserver" in window) {
  const watchForm = new IntersectionObserver(([entry]) => {
    dock.classList.toggle("dock--hide", entry.isIntersecting);
  }, { threshold: 0.2 });
  watchForm.observe(formBlock);
}

const labels = ["Задача", "Формат", "Бюджет", "Район", "Срок", "Связь"];
const form = document.querySelector("#quiz");
const steps = [...form.querySelectorAll(".quiz__step")];
const bars = [...form.querySelectorAll(".quiz__bar")];
const error = form.querySelector(".quiz__error");
const back = form.querySelector("[data-quiz-back]");
const next = form.querySelector("[data-quiz-next]");
const current = form.querySelector("[data-quiz-current]");
const label = form.querySelector("[data-quiz-label]");
const editor = form.querySelector("[data-quiz-form]");
const done = form.querySelector(".quiz__done");
const doneText = form.querySelector("[data-quiz-done-text]");

const draft = {
  goal: "",
  format: "",
  budget: "",
  area: "",
  when: "",
  name: "",
  phone: "",
  channel: "Звонок",
};

let step = 0;

form.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const field = chip.dataset.field;
    draft[field] = chip.dataset.value;
    chip.parentElement.querySelectorAll(".chip").forEach((item) => {
      item.classList.toggle("chip--on", item === chip);
    });
    error.hidden = true;
  });
});

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

function phoneOk(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"));
}

function renderStep() {
  steps.forEach((panel, index) => {
    panel.hidden = index !== step;
  });
  bars.forEach((item, index) => {
    item.classList.toggle("quiz__bar--on", index <= step);
  });
  current.textContent = String(step + 1);
  label.textContent = labels[step];
  back.hidden = step === 0;
  next.textContent = step === 5 ? "Сохранить заявку" : "Дальше";
  error.hidden = true;
}

function leadText() {
  return [
    "Здравствуйте, Евгений. Заявка с сайта.",
    "Задача: " + draft.goal,
    "Формат: " + draft.format,
    "Бюджет: " + draft.budget,
    "Район: " + draft.area,
    "Срок: " + draft.when,
    "Имя: " + draft.name,
    "Телефон: " + draft.phone,
    "Удобно: " + draft.channel,
  ].join("\n");
}

next.addEventListener("click", () => {
  draft.area = form.elements.area.value.trim();
  draft.name = form.elements.name.value.trim();
  draft.phone = form.elements.phone.value.trim();

  const checks = [
    [Boolean(draft.goal), "Выберите задачу"],
    [Boolean(draft.format), "Выберите формат"],
    [Boolean(draft.budget), "Выберите бюджет"],
    [draft.area.length > 1, "Напишите район или «не знаю»"],
    [Boolean(draft.when), "Выберите срок"],
  ];

  if (step < 5) {
    const [ok, message] = checks[step];
    if (!ok) {
      showError(message);
      return;
    }
    step += 1;
    renderStep();
    return;
  }

  if (draft.name.length < 2) {
    showError("Как к вам обращаться?");
    return;
  }
  if (!phoneOk(draft.phone)) {
    showError("Телефон в формате +7 и 10 цифр");
    return;
  }
  if (!form.elements.consent.checked) {
    showError("Нужно согласие на обработку номера");
    return;
  }

  const lead = {
    ...draft,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  };

  try {
    const prev = JSON.parse(localStorage.getItem("dvornitsyn-leads-v1") || "[]");
    localStorage.setItem("dvornitsyn-leads-v1", JSON.stringify([lead, ...prev].slice(0, 50)));
  } catch {
    /* приватный режим */
  }

  doneText.textContent = "Номер " + draft.phone + " сохранён в этом браузере. Телефона на сайте пока нет, поэтому скопируйте текст и передайте его Евгению.";
  editor.hidden = true;
  done.hidden = false;
});

back.addEventListener("click", () => {
  if (step === 0) return;
  step -= 1;
  renderStep();
});

form.querySelector("[data-quiz-copy]").addEventListener("click", async () => {
  const button = form.querySelector("[data-quiz-copy]");
  try {
    await navigator.clipboard.writeText(leadText());
    button.textContent = "Скопировано";
  } catch {
    button.textContent = "Не удалось скопировать";
  }
});

form.querySelector("[data-quiz-reset]").addEventListener("click", () => {
  step = 0;
  draft.goal = "";
  draft.format = "";
  draft.budget = "";
  draft.area = "";
  draft.when = "";
  draft.name = "";
  draft.phone = "";
  draft.channel = "Звонок";
  form.reset();
  form.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("chip--on", chip.dataset.value === "Звонок");
  });
  editor.hidden = false;
  done.hidden = true;
  form.querySelector("[data-quiz-copy]").textContent = "Скопировать заявку";
  renderStep();
});
