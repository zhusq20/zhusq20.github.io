# Siqi Zhu — Personal Website

Source for [zhusq20.github.io](https://zhusq20.github.io/), a responsive academic homepage for Siqi Zhu.

## What is here

- SI research across technophilosophy, applications, scaling, and infrastructure
- Papers and open-source projects in one year-by-year index
- Short bio, education, and contact links
- Light and dark color themes

The site is intentionally built with plain HTML, CSS, and JavaScript, so GitHub Pages can serve it without a build step.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Edit

- Education, research areas, papers, and projects: `content.json`
- Other page content: `index.html`
- Visual design and responsive layout: `stylesheet.css`
- Content rendering, theme, and reveal interactions: `script.js`
- Profile image and favicon: `assets/`

## Update the configurable sections

Edit the three arrays in `content.json`:

- `education`: each item needs `program` and `period`.
- `research`: each item needs `title` and `description`. `tags` is optional. `color` can be `lime`, `blue`, `coral`, or `lavender`; `icon` can be `philosophy`, `application`, `scaling`, or `infrastructure`. Unknown or omitted colors and icons receive safe defaults.
- `papersProjects`: each item needs `year` and `title`. Optional `authors` and `venue` strings appear below the title; Siqi Zhu is highlighted in the author list. Add any number of `{ "label", "url" }` objects to `links`, or use an empty array when a paper is not yet public.

The page numbers research cards automatically. It also groups papers and projects by year and displays the newest year first, while preserving the configured order within each year. To add or remove an entry, change only `content.json`; no HTML edits are needed.
