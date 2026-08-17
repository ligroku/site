const CONFIG = {
  // Website / documentation repository
  site: {
    owner: "ligroku",
    repo: "site",
    branch: "master",
    docsRoot: "docs",
    github: "https://github.com/ligroku/site"
  },

  // Actual Mihous source repository
  source: {
    owner: "ligroku",
    repo: "mihous",
    branch: "main",
    github: "https://github.com/ligroku/mihous"
  }
};

const apiBase = `https://api.github.com/repos/${CONFIG.site.owner}/${CONFIG.site.repo}`;
const sourceApiBase = `https://api.github.com/repos/${CONFIG.source.owner}/${CONFIG.source.repo}`;
const cache = new Map();

const app = document.querySelector("#app");

const sourceApiBase = `https://api.github.com/repos/${CONFIG.source.owner}/${CONFIG.source.repo}`;
const cache = new Map();

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function slugify(value = "") {
  return value.toLowerCase()
    .replace(/\.mdx?$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fileTitle(file) {
  return file.path
    .split("/")
    .pop()
    .replace(/\.mdx?$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function categoryFromPath(path) {
  const relative = path.replace(`${CONFIG.site.docsRoot}/`, "");
  const parts = relative.split("/");
  if (parts.length <= 1) return "General";
  return parts[0].replace(/[-_]/g, " ");
}

async function github(path, options = {}) {
  const key = `${path}|${options.raw ? "raw" : "json"}`;
  if (cache.has(key)) return cache.get(key);

  const url = options.raw
    ? `https://raw.githubusercontent.com/${CONFIG.site.owner}/${CONFIG.site.repo}/${CONFIG.site.branch}/${path}`
    : `${apiBase}/contents/${path}?ref=${CONFIG.site.branch}`;

  const response = await fetch(url, {
    headers: { "Accept": "application/vnd.github+json" }
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${response.statusText}`);
  }

  const data = options.raw ? await response.text() : await response.json();
  cache.set(key, data);
  return data;
}

async function githubSource(path) {
  const key = `source:${path}`;
  if (cache.has(key)) return cache.get(key);

  const url = `https://raw.githubusercontent.com/${CONFIG.source.owner}/${CONFIG.source.repo}/${CONFIG.source.branch}/${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GitHub source ${response.status}: ${response.statusText}`);
  }

  const data = await response.text();
  cache.set(key, data);
  return data;
}

async function githubSourceApi(path = "") {
  const key = `source-api:${path}`;
  if (cache.has(key)) return cache.get(key);

  const url = `${sourceApiBase}/contents/${path}?ref=${CONFIG.source.branch}`;
  const response = await fetch(url, {
    headers: { "Accept": "application/vnd.github+json" }
  });

  if (!response.ok) {
    throw new Error(`GitHub source API ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(key, data);
  return data;
}

async function getDocsFiles(path = CONFIG.site.docsRoot) {
  const data = await github(path);
  if (!Array.isArray(data)) return [];

  const result = [];

  for (const item of data) {
    if (item.type === "dir") {
      result.push(...await getDocsFiles(item.path));
    } else if (item.name.match(/\.(md|mdx)$/i)) {
      result.push(item);
    }
  }

  return result;
}

async function getMeta(path) {
  const metaPath = path.split("/").slice(0, -1).concat("_meta.md").join("/");
  try {
    const text = await github(metaPath, { raw: true });
    return parseFrontMatter(text).data;
  } catch {
    return {};
  }
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { data: {}, body: markdown };

  const data = {};
  match[1].split("\n").forEach(line => {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (m) {
      let value = m[2].trim();
      value = value.replace(/^["']|["']$/g, "");
      data[m[1].trim()] = value;
    }
  });

  return {
    data,
    body: markdown.slice(match[0].length)
  };
}

function docSidebar(files, active) {
  const groups = {};

  files.forEach(file => {
    const category = categoryFromPath(file.path);
    if (!groups[category]) groups[category] = [];
    groups[category].push(file);
  });

  const categories = Object.keys(groups).sort((a,b) => {
    if (a === "General") return -1;
    if (b === "General") return 1;
    return a.localeCompare(b);
  });

  return `
    <aside class="sidebar">
      <div class="sidebar-title">Documentation</div>
      <div class="tree">
        ${categories.map(category => `
          <div class="tree-section">${escapeHtml(category)}</div>
          ${groups[category]
            .sort((a,b) => {
              const ai = a.path.endsWith("/index.md") ? -1 : 0;
              const bi = b.path.endsWith("/index.md") ? -1 : 0;
              return ai - bi || a.path.localeCompare(b.path);
            })
            .map(file => `
              <button
                class="${file.path === active ? "active" : ""}"
                data-doc="${escapeHtml(file.path)}"
              >
                <span class="material-symbols-rounded">description</span>
                ${escapeHtml(fileTitle(file))}
              </button>
            `).join("")}
        `).join("")}
      </div>

      <div class="notice" style="margin-top:18px">
        <strong>Add documentation.</strong><br>
        Create a <code>.md</code> file anywhere inside
        <code>docs/</code>. It will automatically appear here.
      </div>
    </aside>
  `;
}

function home() {
  app.innerHTML = `
    <div class="container">

      <section class="hero">
        <div>
          <div class="eyebrow">Creative infrastructure / open source</div>

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
            <a class="btn primary" href="#/docs">
              <span class="material-symbols-rounded">menu_book</span>
              Read documentation
            </a>

            <a class="btn secondary" href="#/code">
              <span class="material-symbols-rounded">code</span>
              Explore source
            </a>
          </div>

          <div class="stat-row">
            <div class="stat"><strong>Open</strong><span>source-first</span></div>
            <div class="stat"><strong>Native</strong><span>artist workflows</span></div>
            <div class="stat"><strong>Fast</strong><span>less setup</span></div>
            <div class="stat"><strong>mroky</strong><span>network control</span></div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="signal">
            <div class="signal-grid"></div>
            <div class="visual-label">MROKY / SIGNAL GRAPH</div>

            <div class="wave">
              <svg viewBox="0 0 600 110" preserveAspectRatio="none">
                <path d="M0 55 C25 55 25 18 50 18 S75 92 100 92 S125 42 150 42 S175 65 200 65 S225 12 250 12 S275 84 300 84 S325 45 350 45 S375 70 400 70 S425 20 450 20 S475 91 500 91 S525 45 550 45 S575 55 600 55"/>
              </svg>
            </div>

            <div class="visual-status">● LIVE / READY</div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Why mihous</div>
            <h2>Built around the artist.</h2>
          </div>
          <p>
            Tools should remove friction, not become another
            production department. Mihous focuses on predictable
            primitives that can sit underneath creative software.
          </p>
        </div>

        <div class="grid-3">
          <article class="card">
            <div class="number">01 / CONTROL</div>
            <h3>One mental model</h3>
            <p>
              Give light, audio and video systems a consistent
              way to communicate, automate and react.
            </p>
          </article>

          <article class="card">
            <div class="number">02 / NETWORK</div>
            <h3>Made for real shows</h3>
            <p>
              Low-friction network control for installations,
              performances and the messy environments they actually run in.
            </p>
          </article>

          <article class="card">
            <div class="number">03 / OPEN</div>
            <h3>Readable by default</h3>
            <p>
              Documentation, examples and source live close together
              so artists and developers can understand the stack.
            </p>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Documentation</div>
            <h2>One place for the whole stack.</h2>
          </div>
          <p>
            Protocols, effects, libraries and guides can all live
            under the same documentation system.
          </p>
        </div>

        <div class="grid-3">
          <a class="card" href="#/docs/mroky/index.md">
            <div class="number">PROTOCOL</div>
            <h3>mroky</h3>
            <p>Networking, discovery, messages, timing and transport.</p>
          </a>

          <a class="card" href="#/docs/effects/index.md">
            <div class="number">GRAPHICS</div>
            <h3>Effects</h3>
            <p>Visual effects, parameters, examples and performance notes.</p>
          </a>

          <a class="card" href="#/docs/guides/getting-started.md">
            <div class="number">GUIDES</div>
            <h3>Guides</h3>
            <p>Practical documentation for using Mihous in real projects.</p>
          </a>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Featured project</div>
            <h2>mroky</h2>
          </div>
          <p>
            A network/control protocol and library being developed
            as a modern foundation for show-control workflows.
          </p>
        </div>

        <div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap">
          <div>
            <div class="number">CURRENT PROJECT</div>
            <h3 style="margin-top:12px">Small protocol. Large ambitions.</h3>
            <p>Explore the protocol documentation as it evolves.</p>
          </div>

          <a class="btn primary" href="#/docs/mroky/index.md">
            Open mroky docs
            <span class="material-symbols-rounded">arrow_forward</span>
          </a>
        </div>
      </section>

    </div>
  `;
}

function setActiveNav() {
  const route = location.hash || "#/";

  document.querySelectorAll("[data-nav]").forEach(link => {
    const key = link.dataset.nav;

    const active =
      (key === "home" && route === "#/") ||
      (key === "docs" && route.startsWith("#/docs")) ||
      (key === "code" && route.startsWith("#/code"));

    link.classList.toggle("active", active);
  });
}

async function docs(activePath) {
  app.innerHTML = `
    <div class="container">
      <div class="loading">Loading documentation…</div>
    </div>
  `;

  try {
    const files = await getDocsFiles();

    const active =
      activePath ||
      files.find(f => f.path.endsWith("/index.md"))?.path ||
      files[0]?.path;

    if (!active) {
      app.innerHTML = `
        <div class="container">
          <div class="empty">No Markdown documentation found.</div>
        </div>
      `;
      return;
    }

    const raw = await github(active, { raw: true });
    const parsed = parseFrontMatter(raw);

    const html = marked.parse(parsed.body, {
      mangle: false,
      headerIds: false
    });

    app.innerHTML = `
      <div class="container">
        <div class="docs-layout">

          ${docSidebar(files, active)}

          <article class="doc-main">

            <div class="doc-toolbar">

              <label class="search">
                <span class="material-symbols-rounded">search</span>
                <input id="docSearch" placeholder="Search documentation…" />
              </label>

              <a
                class="btn secondary"
                href="${CONFIG.site.github}/blob/${CONFIG.site.branch}/${active}"
                target="_blank"
                rel="noreferrer"
              >
                <span class="material-symbols-rounded">edit</span>
                Edit
              </a>

            </div>

            <div class="doc-content" id="docContent">
              ${html}
            </div>

          </article>
        </div>
      </div>
    `;

    document.querySelectorAll("[data-doc]").forEach(button => {
      button.addEventListener("click", () => {
        location.hash =
          `#/docs/${encodeURIComponent(button.dataset.doc)}`;
      });
    });

    document.querySelector("#docSearch").addEventListener("input", event => {
      const query = event.target.value.toLowerCase().trim();

      document
        .querySelectorAll(
          "#docContent h1,#docContent h2,#docContent h3,#docContent p,#docContent li,#docContent td"
        )
        .forEach(element => {
          element.style.display =
            query &&
            !element.textContent.toLowerCase().includes(query)
              ? "none"
              : "";
        });
    });

  } catch (error) {
    app.innerHTML = `
      <div class="container">
        <div class="error">
          Could not load documentation.
          ${escapeHtml(error.message)}
        </div>
      </div>
    `;
  }
}

async function flattenCode(path = "") {
  const data = await githubSourceApi(path);
  const items = Array.isArray(data) ? data : [data];
  const output = [];

  for (const item of items) {
    if (item.type === "dir" && !item.path.startsWith(".git")) {
      output.push(...await flattenCode(item.path));
    } else if (
      item.type === "file" &&
      !item.path.startsWith(".github/")
    ) {
      output.push(item);
    }
  }

  return output;
}

async function getSourceFile(path) {
  return githubSource(path);
}

async function codeBrowser(activePath) {
  app.innerHTML = `
    <div class="container">
      <div class="loading">Loading source tree…</div>
    </div>
  `;

  try {
    const files = await flattenCode();

    const active =
      activePath ||
      files.find(f => f.path.endsWith(".cppm"))?.path ||
      files[0]?.path;

    const selected = files.find(f => f.path === active);

    const code = selected
      ? await getSourceFile(selected.path)
      : "";

    app.innerHTML = `
      <div class="container">

        <div class="section-head" style="padding-top:55px">
          <div>
            <div class="eyebrow">mihous / source</div>
            <h2>Code explorer</h2>
          </div>

          <p>
            Browse the public repository directly from Mihous.
            The tree is fetched live from GitHub.
          </p>
        </div>

        <div class="code-layout">

          <aside class="file-panel">

            <div class="file-panel-head">
              <span>repository</span>
              <span class="pill">${files.length} files</span>
            </div>

            <div class="file-list">
              ${files.map(file => `
                <div
                  class="file-item ${file.path === active ? "active" : ""}"
                  data-code="${escapeHtml(file.path)}"
                >
                  <span class="material-symbols-rounded">description</span>
                  ${escapeHtml(file.path)}
                </div>
              `).join("")}
            </div>

          </aside>

          <section class="code-panel">

            <div class="code-panel-head">
              <span>${escapeHtml(selected?.path || "No file selected")}</span>

              <a
                href="${selected?.html_url || CONFIG.source.github}"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>

            <pre><code>${escapeHtml(code)}</code></pre>

          </section>

        </div>
      </div>
    `;

    document.querySelectorAll("[data-code]").forEach(element => {
      element.addEventListener("click", () => {
        location.hash =
          `#/code/${encodeURIComponent(element.dataset.code)}`;
      });
    });

  } catch (error) {
    app.innerHTML = `
      <div class="container">
        <div class="error">
          Could not load source.
          ${escapeHtml(error.message)}
        </div>
      </div>
    `;
  }
}

async function router() {
  setActiveNav();

  const hash =
    decodeURIComponent(location.hash || "#/");

  if (hash === "#/" || hash === "#") {
    return home();
  }

  if (hash.startsWith("#/docs/")) {
    return docs(hash.slice("#/docs/".length));
  }

  if (hash === "#/docs") {
    return docs();
  }

  if (hash.startsWith("#/code/")) {
    return codeBrowser(hash.slice("#/code/".length));
  }

  if (hash === "#/code") {
    return codeBrowser();
  }

  home();
}

document.querySelector("#themeBtn").addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "light"
      ? "dark"
      : "light";

  document.documentElement.dataset.theme = next;
  localStorage.setItem("mihous-theme", next);
});

document.documentElement.dataset.theme =
  localStorage.getItem("mihous-theme") || "dark";

window.addEventListener("hashchange", router);
router();
