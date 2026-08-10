(function () {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function savedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (_error) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    themeColor.setAttribute("content", theme === "dark" ? "#171714" : "#f6f2ea");
  }

  applyTheme(savedTheme() || (systemTheme.matches ? "dark" : "light"));

  themeButton.addEventListener("click", function () {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (_error) {
      // The selected theme still applies for this page view when storage is unavailable.
    }
  });

  systemTheme.addEventListener("change", function (event) {
    if (!savedTheme()) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  document.getElementById("current-year").textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
})();
