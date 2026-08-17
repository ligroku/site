# Mihous

Mihous is an open-source collection of tools for artists working with:

- lighting
- audio
- video
- networking
- show control
- creative technology

The goal is simple:

> Make the technical part disappear.

## Website

The website is located directly in the repository root.

```text
index.html
styles.css
app.js
docs/
```

This means GitHub Pages can publish the site directly without a `/website` subdirectory.

## Documentation

Documentation lives in:

```text
docs/
```

The structure is flexible.

Example:

```text
docs/
├── index.md
│
├── mroky/
│   ├── index.md
│   ├── protocol.md
│   ├── discovery.md
│   └── examples.md
│
├── effects/
│   ├── index.md
│   ├── blur.md
│   ├── color.md
│   └── feedback.md
│
├── audio/
│   └── index.md
│
├── video/
│   └── index.md
│
└── guides/
    └── getting-started.md
```

Any `.md` or `.mdx` file inside `docs/` is automatically discovered by the website.

## Adding a new effect

Create:

```text
docs/effects/glow.md
```

Then write:

```markdown
# Glow

Glow creates a bright halo around high-intensity pixels.

## Parameters

| Parameter | Type | Default |
|---|---|---|
| Radius | float | 20 |
| Intensity | float | 1 |
```

Commit and push.

No JavaScript changes are required.

## Adding a new library

Create a directory:

```text
docs/my-library/
├── index.md
├── api.md
└── examples.md
```

The website will automatically create a documentation category for it.

## Local development

Because the website uses `fetch()`, run a local HTTP server.

```bash
python3 -m http.server 8000
```

If running from the repository root, open:

```text
http://localhost:8000
```

## GitHub Pages

The workflow is:

```text
.github/workflows/pages.yml
```

The workflow publishes the repository root as a GitHub Pages artifact.

## Configuration

The website configuration is at the beginning of:

```text
app.js
```

The website repository is `ligroku/site` on the `master` branch. The source browser separately reads source files from `ligroku/mihous` on `main`.

```javascript
const CONFIG = {
  site: {
    owner: "ligroku",
    repo: "site",
    branch: "master",
    docsRoot: "docs",
    github: "https://github.com/ligroku/site"
  },

  source: {
    owner: "ligroku",
    repo: "mihous",
    branch: "main",
    github: "https://github.com/ligroku/mihous"
  }
};
```

If you rename either repository or branch, update this configuration.

## Future editor

A future version can add an authenticated documentation editor.

The intended flow:

```text
Mihous Admin
     |
     v
Markdown editor
     |
     v
GitHub API
     |
     v
Commit
     |
     v
GitHub Pages
```

A GitHub token must never be placed in public frontend JavaScript.
