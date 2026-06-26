# GEONEXUS — GEO · AEO · AIO Agency & Education Platform

A next-generation Jekyll site built for the age of AI-driven discovery. GEONEXUS is a comprehensive platform covering Generative Engine Optimization (GEO), AI Engine Optimization (AEO), and AI Optimization (AIO).

## Features

- **Agency Services** — GEO, AEO, and AIO consulting services for enterprises
- **Educational Content** — In-depth learning resources on AI optimization disciplines
- **Blog** — Thought leadership articles on martech, AI, and knowledge graphs
- **Case Studies** — Real enterprise transformations (DBS, Ascott, Frasers)
- **Tools Directory** — Curated tools for GEO/AEO/AIO implementation
- **GEO-Optimized** — JSON-LD structured data, Schema.org markup, topic clusters
- **Responsive Design** — Clean professional theme optimized for all devices

## Local Development

### Prerequisites
- Ruby 3.0+
- Bundler

### Setup
```bash
bundle install
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000/GEO/`

### Build
```bash
bundle exec jekyll build
```

Output will be in the `_site/` directory.

## Deployment

This site is configured for GitHub Pages deployment at `https://mengliang10.github.io/GEO/`.

### Deploy
```bash
# Build the site
bundle exec jekyll build

# Commit and push to GitHub
git add .
git commit -m "Update site"
git push origin main
```

GitHub Actions will automatically build and deploy the site to GitHub Pages.

## Structure

```
├── _config.yml          # Site configuration
├── _data/               # Navigation and data files
├── _includes/           # Reusable templates
├── _layouts/            # Page layout templates
├── _posts/              # Blog posts
├── assets/              # CSS, JS, images
├── services/            # Services pages
├── education/           # Educational content
├── case-studies/        # Case studies
├── tools/               # Tools directory
├── blog/                # Blog index with pagination
├── about.md             # About page
├── contact.md           # Contact page
├── privacy.md           # Privacy policy
└── terms.md             # Terms of service
```

## License

© 2026 GEONEXUS. All rights reserved.
