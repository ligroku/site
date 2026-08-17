const CONFIG = {
  owner: "ligroku",
  repo: "mihous",
  branch: "main",

  /*
   * All documentation is stored here.
   *
   * Add .md files to this directory and
   * they automatically appear in the docs.
   */
  docsRoot: "docs/",

  /*
   * Empty means repository root.
   */
  codeRoot: "https://github.com/ligroku/mihous",

  github: "https://github.com/ligroku/mihous"
};


const app = document.querySelector("#app");


const apiBase =
  `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}`;


const cache = new Map();


/*
 * HTML escaping
 */

function escapeHtml(value = "") {

  return value.replace(
    /[&<>"']/g,

    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );
}


/*
 * GitHub API
 */

async function github(path, options = {}) {

  const key =
    `${path}|${options.raw ? "raw" : "json"}`;


  if (cache.has(key)) {
    return cache.get(key);
  }


  const url = options.raw

    ? `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${path}`

    : `${apiBase}/contents/${path}?ref=${CONFIG.branch}`;


  const response = await fetch(
    url,
    {
      headers: {
        "Accept":
          "application/vnd.github+json"
      }
    }
  );


  if (!response.ok) {

    throw new Error(
      `GitHub API ${response.status}: ${response.statusText}`
    );
  }


  const data = options.raw
    ? await response.text()
    : await response.json();


  cache.set(key, data);


  return data;
}


/*
 * Generic page layout
 */

function layout(title, body) {

  app.innerHTML = `

    <div class="container">

      <div
        class="section-head"
        style="padding-top:55px"
      >

        <div>

          <div class="eyebrow">
            mihous / ${title}
          </div>

          <h2 style="margin-top:12px">
            ${title}
          </h2>

        </div>

      </div>

      ${body}

    </div>
  `;
}


/*
 * HOME
 */

function home() {

  app.innerHTML = `

    <div class="container">

      <section class="hero">

        <div>

          <div class="eyebrow">
            Creative infrastructure / open source
          </div>


          <h1>
            Make the technical part
            <em>disappear.</em>
          </h1>


          <p>
            Mihous builds practical libraries for artists
            working with light, audio, video and networked
            control — so the show can stay the focus.
          </p>


          <div class="actions">

            <a
              class="btn primary"
              href="#/docs"
            >

              <span class="material-symbols-rounded">
                menu_book
              </span>

              Read documentation

            </a>


            <a
              class="btn secondary"
              href="#/code"
            >

              <span class="material-symbols-rounded">
                code
              </span>

              Explore source

            </a>

          </div>


          <div class="stat-row">

            <div class="stat">
              <strong>Open</strong>
              <span>source-first</span>
            </div>


            <div class="stat">
              <strong>Native</strong>
              <span>artist workflows</span>
            </div>


            <div class="stat">
              <strong>Fast</strong>
              <span>less setup</span>
            </div>


            <div class="stat">
              <strong>mroky</strong>
              <span>network control</span>
            </div>

          </div>

        </div>


        <div class="hero-visual">

          <div class="signal">

            <div class="signal-grid"></div>


            <div class="visual-label">
              MROKY / SIGNAL GRAPH
            </div>


            <div class="wave">

              <svg
                viewBox="0 0 600 110"
                preserveAspectRatio="none"
              >

                <path
                  d="
                    M0 55
                    C25 55 25 18 50 18
                    S75 92 100 92
                    S125 42 150 42
                    S175 65 200 65
                    S225 12 250 12
                    S275 84 300 84
                    S325 45 350 45
                    S375 70 400 70
                    S425 20 450 20
                    S475 91 500 91
                    S525 45 550 45
                    S575 55 600 55
                  "
                />

              </svg>

            </div>


            <div class="visual-status">
              ● LIVE / READY
            </div>

          </div>

        </div>

      </section>


      <section class="section">

        <div class="section-head">

          <div>

            <div class="eyebrow">
              Why mihous
            </div>

            <h2>
              Built around the artist.
            </h2>

          </div>


          <p>
            Tools should remove friction, not become
            another production department. Mihous focuses
            on predictable primitives that can sit
            underneath creative software.
          </p>

        </div>


        <div class="grid-3">

          <article class="card">

            <div class="number">
              01 / CONTROL
            </div>

            <h3>
              One mental model
            </h3>

            <p>
              Give light, audio and video systems a
              consistent way to communicate, automate
              and react.
            </p>

          </article>


          <article class="card">

            <div class="number">
              02 / NETWORK
            </div>

            <h3>
              Made for real shows
            </h3>

            <p>
              Low-friction network control for
              installations, performances and the messy
              environments they actually run in.
            </p>

          </article>


          <article class="card">

            <div class="number">
              03 / OPEN
            </div>

            <h3>
              Readable by default
            </h3>

            <p>
              Documentation, examples and source live
              close together so artists and developers
              can understand the stack.
            </p>

          </article>

        </div>

      </section>


      <section class="section">

        <div class="section-head">

          <div>

            <div class="eyebrow">
              Featured
            </div>

            <h2>
              mroky
            </h2>

          </div>


          <p>
            A network/control protocol and library being
            developed as a modern alternative to legacy
            show-control workflows.
          </p>

        </div>


        <div
          class="card"
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:30px;
            flex-wrap:wrap
          "
        >

          <div>

            <div class="number">
              CURRENT PROJECT
            </div>

            <h3
              style="margin-top:12px"
            >
              Small protocol.
              Large ambitions.
            </h3>

            <p>
              Explore the current module, then follow
              the documentation as the protocol evolves.
            </p>

          </div>


          <a
            class="btn primary"
            href="#/docs"
          >

            Open mroky docs

            <span class="material-symbols-rounded">
              arrow_forward
            </span>

          </a>

        </div>

      </section>

    </div>
  `;
}


/*
 * Active navigation
 */

function setActiveNav() {

  const route =
    location.hash || "#/";


  document
    .querySelectorAll("[data-nav]")
    .forEach(link => {

      const key =
        link.dataset.nav;


      const active =

        (
          key === "home" &&
          route === "#/"
        )

        ||

        (
          key === "docs" &&
          route.startsWith("#/docs")
        )

        ||

        (
          key === "code" &&
          route.startsWith("#/code")
        );


      link.classList.toggle(
        "active",
        active
      );

    });
}


/*
 * Find documentation files recursively.
 */

async function getDocsFiles(
  path = CONFIG.docsRoot
) {

  const data =
    await github(path);


  if (!Array.isArray(data)) {
    return [];
  }


  const result = [];


  for (const item of data) {

    if (item.type === "dir") {

      const nested =
        await getDocsFiles(item.path);

      result.push(...nested);

    }

    else if (
      item.name.match(
        /\.(md|mdx)$/i
      )
    ) {

      result.push(item);

    }

  }


  return result;
}


/*
 * Documentation sidebar
 */

function docSidebar(
  files,
  active
) {

  return `

    <aside class="sidebar">

      <div class="sidebar-title">
        Documentation
      </div>


      <div class="tree">

        ${

          files
            .map(file => `

              <button
                class="${
                  file.path === active
                    ? "active"
                    : ""
                }"
                data-doc="${escapeHtml(file.path)}"
              >

                <span class="material-symbols-rounded">
                  description
                </span>

                ${
                  escapeHtml(
                    file.path.replace(
                      CONFIG.docsRoot + "/",
                      ""
                    )
                  )
                }

              </button>

            `)
            .join("")

        }

      </div>


      <div
        class="notice"
        style="margin-top:18px"
      >

        <strong>
          Add docs fast.
        </strong>

        <br>

        Drop a Markdown file into

        <code>
          ${CONFIG.docsRoot}
        </code>

        and it appears here automatically.

      </div>

    </aside>
  `;
}


/*
 * Documentation page
 */

async function docs(activePath) {

  app.innerHTML = `

    <div class="container">

      <div class="loading">
        Loading documentation…
      </div>

    </div>
  `;


  try {

    const files =
      await getDocsFiles();


    const active =
      activePath ||
      files[0]?.path;


    if (!active) {

      layout(
        "Documentation",
        `
          <div class="empty">
            No Markdown documentation found yet.
          </div>
        `
      );

      return;
    }


    const raw =
      await github(
        active,
        {
          raw: true
        }
      );


    const html =
      marked.parse(
        raw,
        {
          mangle: false,
          headerIds: false
        }
      );


    app.innerHTML = `

      <div class="container">

        <div class="docs-layout">

          ${docSidebar(
            files,
            active
          )}


          <article class="doc-main">

            <div class="doc-toolbar">

              <label class="search">

                <span class="material-symbols-rounded">
                  search
                </span>

                <input
                  id="docSearch"
                  placeholder="Search documentation…"
                />

              </label>


              <a
                class="btn secondary"
                href="${CONFIG.github}/blob/${CONFIG.branch}/${active}"
                target="_blank"
                rel="noreferrer"
              >

                <span class="material-symbols-rounded">
                  edit
                </span>

                Edit

              </a>

            </div>


            <div
              class="doc-content"
              id="docContent"
            >

              ${html}

            </div>

          </article>

        </div>

      </div>
    `;


    document
      .querySelectorAll("[data-doc]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            location.hash =
              `#/docs/${encodeURIComponent(
                button.dataset.doc
              )}`;

          }
        );

      });


    document
      .querySelector("#docSearch")
      .addEventListener(
        "input",
        event => {

          const query =
            event.target.value
              .toLowerCase()
              .trim();


          document
            .querySelectorAll(
              "#docContent h1,#docContent h2,#docContent h3,#docContent p,#docContent li"
            )
            .forEach(element => {

              element.style.display =

                query &&
                !element.textContent
                  .toLowerCase()
                  .includes(query)

                  ? "none"
                  : "";

            });

        }
      );

  }

  catch (error) {

    app.innerHTML = `

      <div class="container">

        <div class="error">

          Could not load documentation.

          ${escapeHtml(
            error.message
          )}

        </div>

      </div>
    `;

  }
}


/*
 * Repository tree
 */

async function getTree(
  path = CONFIG.codeRoot
) {

  const data =
    await github(path);


  return Array.isArray(data)
    ? data
    : [data];
}


/*
 * Recursively flatten repository.
 */

async function flattenCode(
  path = ""
) {

  const items =
    await getTree(path);


  const output = [];


  for (const item of items) {

    if (
      item.type === "dir" &&
      !item.path.startsWith(".git")
    ) {

      output.push(
        ...await flattenCode(
          item.path
        )
      );

    }

    else if (
      item.type === "file" &&
      !item.path.startsWith(".github/")
    ) {

      output.push(item);

    }

  }


  return output;
}


/*
 * Source code browser
 */

async function codeBrowser(
  activePath
) {

  app.innerHTML = `

    <div class="container">

      <div class="loading">
        Loading source tree…
      </div>

    </div>
  `;


  try {

    const files =
      await flattenCode();


    const active =
      activePath ||

      files.find(
        file =>
          file.path.endsWith(".cppm")
      )?.path ||

      files[0]?.path;


    const selected =
      files.find(
        file =>
          file.path === active
      );


    const code =
      selected
        ? await github(
            selected.path,
            {
              raw: true
            }
          )
        : "";


    app.innerHTML = `

      <div class="container">

        <div
          class="section-head"
          style="padding-top:55px"
        >

          <div>

            <div class="eyebrow">
              mihous / source
            </div>

            <h2>
              Code explorer
            </h2>

          </div>


          <p>
            Browse the public repository without
            leaving the site. The tree is fetched
            live from GitHub.
          </p>

        </div>


        <div class="code-layout">


          <aside class="file-panel">

            <div class="file-panel-head">

              <span>
                repository
              </span>

              <span class="pill">
                ${files.length} files
              </span>

            </div>


            <div class="file-list">

              ${

                files
                  .map(file => `

                    <div
                      class="
                        file-item
                        ${
                          file.path === active
                            ? "active"
                            : ""
                        }
                      "
                      data-code="${escapeHtml(file.path)}"
                    >

                      <span class="material-symbols-rounded">
                        description
                      </span>

                      ${escapeHtml(
                        file.path
                      )}

                    </div>

                  `)
                  .join("")

              }

            </div>

          </aside>


          <section class="code-panel">

            <div class="code-panel-head">

              <span>
                ${escapeHtml(
                  selected?.path ||
                  "No file selected"
                )}
              </span>


              <a
                href="${
                  selected?.html_url ||
                  CONFIG.github
                }"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>

            </div>


            <pre><code>${escapeHtml(
              code
            )}</code></pre>

          </section>


        </div>

      </div>
    `;


    document
      .querySelectorAll("[data-code]")
      .forEach(element => {

        element.addEventListener(
          "click",
          () => {

            location.hash =
              `#/code/${encodeURIComponent(
                element.dataset.code
              )}`;

          }
        );

      });

  }

  catch (error) {

    app.innerHTML = `

      <div class="container">

        <div class="error">

          Could not load source.

          ${escapeHtml(
            error.message
          )}

        </div>

      </div>
    `;

  }
}


/*
 * Router
 */

async function router() {

  setActiveNav();


  const hash =
    decodeURIComponent(
      location.hash || "#/"
    );


  if (
    hash === "#/" ||
    hash === "#"
  ) {

    return home();

  }


  if (
    hash.startsWith("#/docs/")
  ) {

    return docs(
      hash.slice("#/docs/".length)
    );

  }


  if (
    hash === "#/docs"
  ) {

    return docs();

  }


  if (
    hash.startsWith("#/code/")
  ) {

    return codeBrowser(
      hash.slice("#/code/".length)
    );

  }


  if (
    hash === "#/code"
  ) {

    return codeBrowser();

  }


  home();
}


/*
 * Theme
 */

document
  .querySelector("#themeBtn")
  .addEventListener(
    "click",
    () => {

      const next =
        document.documentElement
          .dataset.theme === "light"

          ? "dark"

          : "light";


      document.documentElement
        .dataset.theme = next;


      localStorage.setItem(
        "mihous-theme",
        next
      );

    }
  );


document.documentElement.dataset.theme =
  localStorage.getItem(
    "mihous-theme"
  ) || "dark";


/*
 * Start application
 */

window.addEventListener(
  "hashchange",
  router
);


router();
