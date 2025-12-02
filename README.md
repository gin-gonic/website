# Gin website

[![Run Deploy](https://github.com/gin-gonic/website/actions/workflows/node.yml/badge.svg)](https://github.com/gin-gonic/website/actions/workflows/node.yml)
[![Trivy Security Scan](https://github.com/gin-gonic/website/actions/workflows/trivy-scan.yml/badge.svg)](https://github.com/gin-gonic/website/actions/workflows/trivy-scan.yml)

Welcome! This repository houses all the assets required to build the Gin website and documentation. We're pleased that you want to contribute! The website is hosted at [https://gin-gonic.com](https://gin-gonic.com).

We use [Astro](https://astro.build) to format and generate our website, the [Starlight](https://starlight.astro.build) template for styling and site structure. Thanks!.

## Contribution

- Fork the repository

You can click the Fork button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called as fork.

- Create one pull request

Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

- Merge the pull request

Once your pull request is created, a Gin reviewer will take responsibility for providing clear, actionable feedback, re-improve and merge.

## Running

See the [official Astro documentation](https://docs.astro.build/en/getting-started) for Astro installation instructions. and [Starlight documentation](https://starlight.astro.build/getting-started) for Starlight installation instructions.

To run the site locally when you have Hugo installed:

```sh
git clone https://github.com/<your-username>/website.git # your fork url
cd website

# ensure you have node installed
node -v
# else https://nodejs.org/en/download

npm install 
npm run dev
```

This will start the local Astro server on port 4321. Open up your browser to <http://localhost:4321> to view the site. As you make changes to the source files, Astro updates the site and forces a browser refresh.

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```bash
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Thanks

Gin thrives on community participation, and we really appreciate your contributions to our site and our documentation!
