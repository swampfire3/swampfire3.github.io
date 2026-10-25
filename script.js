const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const year = document.getElementById("year");
const typingText = document.getElementById("typingText");

year.textContent = new Date().getFullYear();

// Restore the selected theme on this device.
const savedTheme = localStorage.getItem("swampfir3-theme");
if (savedTheme === "light") root.classList.add("light");

themeToggle.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("swampfir3-theme", root.classList.contains("light") ? "light" : "dark");
});

// Small, reduced-motion-aware terminal text effect.
const commands = ["whoami", "cat interests.txt", "git status"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && typingText) {
  let commandIndex = 0;
  let charIndex = commands[0].length;
  let deleting = false;

  function typeCommand() {
    const current = commands[commandIndex];
    if (!deleting) {
      charIndex++;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        window.setTimeout(typeCommand, 1400);
        return;
      }
    } else {
      charIndex--;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        commandIndex = (commandIndex + 1) % commands.length;
      }
    }
    window.setTimeout(typeCommand, deleting ? 45 : 90);
  }
  window.setTimeout(typeCommand, 1200);
}

// Reveal sections gently as they enter view; content stays visible without IntersectionObserver.
const sections = document.querySelectorAll(".section");
if ("IntersectionObserver" in window && !reduceMotion) {
  sections.forEach(section => section.classList.add("reveal"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  sections.forEach(section => observer.observe(section));
}
