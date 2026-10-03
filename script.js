(function () {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const cardColors = ["lime", "blue", "coral", "lavender"];
  const iconMarkup = {
    philosophy:
      '<circle cx="24" cy="24" r="15"></circle><path d="M24 9v30M9 24h30M14 14l20 20M34 14 14 34"></path>',
    application:
      '<path d="M12 17h24M12 31h24M17 12v24M31 12v24"></path><circle cx="17" cy="17" r="4"></circle><circle cx="31" cy="31" r="4"></circle>',
    scaling: '<path d="M8 28h8l4-12 7 22 5-15 3 5h5"></path>',
    infrastructure:
      '<rect x="8" y="10" width="13" height="11" rx="2"></rect><rect x="27" y="27" width="13" height="11" rx="2"></rect><path d="M21 15.5h7a5 5 0 0 1 5 5V27M27 32.5h-7a5 5 0 0 1-5-5V21"></path>',
    default:
      '<circle cx="24" cy="24" r="15"></circle><path d="m24 15 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path>'
  };

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

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function renderEducation(items) {
    const list = document.getElementById("education-list");
    const fragment = document.createDocumentFragment();

    items.forEach(function (item) {
      if (!item || typeof item.program !== "string" || typeof item.period !== "string") {
        return;
      }

      const listItem = document.createElement("li");
      listItem.append(
        createElement("strong", "", item.program),
        createElement("span", "", item.period)
      );
      fragment.append(listItem);
    });

    list.replaceChildren(fragment);
  }

  function renderResearch(items) {
    const list = document.getElementById("research-list");
    const fragment = document.createDocumentFragment();

    items.forEach(function (item, index) {
      if (!item || typeof item.title !== "string" || typeof item.description !== "string") {
        return;
      }

      const configuredColor = cardColors.includes(item.color) ? item.color : null;
      const color = configuredColor || cardColors[index % cardColors.length];
      const delayClass = ["", "reveal-delay", "reveal-delay-2"][index % 3];
      const article = createElement(
        "article",
        ["focus-card", "card-" + color, "reveal", delayClass].filter(Boolean).join(" ")
      );
      const number = String(index + 1).padStart(2, "0");
      const icon = createElement("div", "focus-icon");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const tags = createElement("div", "tag-row");

      icon.setAttribute("aria-hidden", "true");
      svg.setAttribute("viewBox", "0 0 48 48");
      svg.innerHTML = iconMarkup[item.icon] || iconMarkup.default;
      icon.append(svg);

      (Array.isArray(item.tags) ? item.tags : []).forEach(function (tag) {
        if (typeof tag === "string") {
          tags.append(createElement("span", "", tag));
        }
      });

      article.append(
        createElement("span", "focus-number", number),
        icon,
        createElement("h3", "", item.title),
        createElement("p", "", item.description),
        tags
      );
      fragment.append(article);
    });

    list.replaceChildren(fragment);
  }

  function safeUrl(value) {
    if (typeof value !== "string") {
      return null;
    }

    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : null;
    } catch (_error) {
      return null;
    }
  }

  function renderWork(items) {
    const list = document.getElementById("work-list");
    const groups = new Map();

    items.forEach(function (item) {
      if (!item || typeof item.title !== "string") {
        return;
      }

      const year = String(item.year || "").trim();
      if (!year) {
        return;
      }

      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year).push(item);
    });

    const years = Array.from(groups.keys()).sort(function (first, second) {
      const numericDifference = Number(second) - Number(first);
      return Number.isNaN(numericDifference)
        ? second.localeCompare(first, undefined, { numeric: true })
        : numericDifference;
    });
    const fragment = document.createDocumentFragment();

    years.forEach(function (year) {
      const yearGroup = createElement("div", "work-year reveal");
      const yearMarker = createElement("div", "year-marker");
      const workList = createElement("div", "work-list");

      yearMarker.append(createElement("span", "", year));

      groups.get(year).forEach(function (item) {
        const article = createElement("article", "work-item");
        const links = createElement("div", "work-item-links");

        (Array.isArray(item.links) ? item.links : []).forEach(function (link) {
          const href = link && safeUrl(link.url);
          if (!href || typeof link.label !== "string") {
            return;
          }

          const anchor = createElement("a", "", link.label + " ↗");
          anchor.href = href;
          anchor.target = "_blank";
          anchor.rel = "noreferrer";
          links.append(anchor);
        });

        const copy = createElement("div", "work-item-copy");
        copy.append(createElement("h3", "", item.title));

        if (typeof item.authors === "string" && item.authors.trim()) {
          const authors = createElement("p", "work-item-authors");
          item.authors.split(/(Siqi Zhu)/).forEach(function (name) {
            authors.append(
              name === "Siqi Zhu"
                ? createElement("strong", "", name)
                : document.createTextNode(name)
            );
          });
          copy.append(authors);
        }

        if (typeof item.venue === "string" && item.venue.trim()) {
          copy.append(createElement("p", "work-item-venue", item.venue));
        }

        article.append(copy);
        if (links.childElementCount) {
          article.append(links);
        }
        workList.append(article);
      });

      yearGroup.append(yearMarker, workList);
      fragment.append(yearGroup);
    });

    list.replaceChildren(fragment);
  }

  function showConfigError() {
    ["research-list", "work-list"].forEach(function (id) {
      const container = document.getElementById(id);
      container.replaceChildren(
        createElement("p", "config-error", "Content is temporarily unavailable.")
      );
    });
    document.getElementById("education-list").replaceChildren(
      createElement("li", "config-error", "Content is temporarily unavailable.")
    );
  }

  async function loadContent() {
    try {
      const contentUrl = new URL("content.json", document.baseURI);
      contentUrl.searchParams.set("v", Date.now().toString());
      const response = await fetch(contentUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load content.json (" + response.status + ")");
      }

      const content = await response.json();
      if (
        !Array.isArray(content.education) ||
        !Array.isArray(content.research) ||
        !Array.isArray(content.papersProjects)
      ) {
        throw new Error("content.json must contain education, research, and papersProjects arrays");
      }

      renderEducation(content.education);
      renderResearch(content.research);
      renderWork(content.papersProjects);
    } catch (error) {
      console.error(error);
      showConfigError();
    }
  }

  function initRevealAnimations() {
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
  loadContent().finally(initRevealAnimations);
})();
