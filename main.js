const blockChars = [
  "■", "▇", "▆", "▅", "▄", "▃", "▂", "▁",
  "▉", "▊", "▋", "▌", "▍", "▎", "▏"
];

const target = document.querySelector(".dchover__btn span");

if (target) {
  const originalText = target.textContent;
  let rafId = null;
  let isAnimating = false;

  function randomBlockChar() {
    return blockChars[Math.floor(Math.random() * blockChars.length)];
  }

  function isSkippableChar(char) {
    return char === " " || /[.,!?;:'"()[\]{}\-_/]/.test(char);
  }

  function buildGlitchText(text, revealCount) {
    return text
      .split("")
      .map((char, index) => {
        if (isSkippableChar(char)) return char;
        if (index < revealCount) return char;
        return randomBlockChar();
      })
      .join("");
  }

  function lockSize() {
    const rect = target.getBoundingClientRect();
    target.style.width = `${Math.ceil(rect.width)}px`;
    target.style.height = `${Math.ceil(rect.height)}px`;
  }

  function unlockSize() {
    target.style.width = "";
    target.style.height = "";
  }

  function startDigitalHover() {
    if (isAnimating) return;

    isAnimating = true;
    lockSize(); 

    const textChars = originalText.split("");
    const revealableCharsCount = textChars.filter(char => !isSkippableChar(char)).length;

    const holdSteps = 2; 
    const endHoldSteps = 1; 
    const totalSteps = holdSteps + revealableCharsCount + endHoldSteps;

    const fps = 4;
    const frameDuration = 200 / fps;

    let step = 0;
    let lastTime = 0;

    function tick(now) {
      if (!isAnimating) return;

      if (!lastTime) lastTime = now;
      const elapsed = now - lastTime;

      if (elapsed >= frameDuration) {
        lastTime = now;
        const revealCount = Math.max(0, step - holdSteps);
        target.textContent = buildGlitchText(originalText, revealCount);
        step++;

        if (step > totalSteps) {
          target.textContent = originalText;
          isAnimating = false;
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function resetDigitalHover() {
    cancelAnimationFrame(rafId);
    rafId = null;
    target.textContent = originalText;
    isAnimating = false;
    unlockSize();
  }

  target.addEventListener("mouseenter", startDigitalHover);
  target.addEventListener("mouseleave", resetDigitalHover);
}