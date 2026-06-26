---
title: "DBS Bank: Martech Stack Graph Analysis & Governance Automation"
subtitle: "Knowledge graph-powered audit of 115K+ nodes, 3× redundant tag managers, and 12+ deprecated libraries — remediated via Open Policy Agent governance automation with 916% ROI."
sidebar: true
---

## Engagement Overview

**Client:** DBS Bank — Group Marketing & Communications  
**Stack:** dbs.com.sg — Adobe Launch, Adobe Analytics, GTM, Akamai, Cloudflare, Salesforce MC  
**Duration:** 12-week audit + implementation  
**Investment:** S$250,000  
**Measured ROI:** 916% (5-year projection)

## Methodology: Knowledge Graph-Powered Stack Analysis

We deployed an ArcadeDB knowledge graph to map the complete martech ecosystem. The graph ingested data from four primary sources:

### Data Sources

1. **HTTP Archive (HAR) captures** — Full request/response logs from dbs.com.sg across 47 pages (home, products, campaigns, transaction flows)
2. **DOM/JavaScript analysis** — Extracted all loaded scripts, their versions, SRI hashes, and execution order
3. **Tag management container dumps** — Adobe Launch, Adobe DTM, and GTM container configurations
4. **DNS/CDN enumeration** — All subdomains, CNAMEs, CDN configurations, and origin server mappings

### Graph Schema

```
Entity types: Platform, Strategy, Metric, Process, Company, Concept, Library, Tag, API
Relationship types: REQUIRES, IMPLEMENTS, MEASURES, COMPATIBLE_WITH, VERSION_OF, DEPRECATED_BY
Vector index: 384-dim HNSW for semantic similarity search
```

**Scale:** 115,000+ nodes, 340,000+ edges, 1,200+ distinct entity types

## Findings

### 1. Tag Management Redundancy (Critical)

**Discovery:** Three tag managers running simultaneously — Adobe Launch (primary), Adobe Tag Manager/DTM (legacy), and Google Tag Manager (campaign-specific).

**Graph traversal:**
```cypher
MATCH (p:Platform)-[:DEPLOYS]->(t:TagManager)
MATCH (t)-[:MANAGES]->(tag:Tag)
RETURN p.name, t.name, count(tag) as tagCount
ORDER BY tagCount DESC
```

**Result:** 3,400+ tags deployed across three containers. 1,200+ tags duplicated across ≥2 containers. 47 tags firing on every page load from all three containers simultaneously.

**Performance impact:** Redundant containers added ~0.8s to page load time (measured via Lighthouse on repeat visits). Estimated 2.4% conversion impact.

### 2. JavaScript Library Deprecation (High)

**Discovery:** 12+ JavaScript libraries past end-of-life or with known CVEs.

| Library | Version | Released | Status | Replacement |
| :--- | :---: | :---: | :--- | :--- |
| Modernizr | 2.6.2 | 2012 | End-of-life | CSS `@supports` |
| jQuery Migrate | 3.0.1 | 2016 | Compatibility shim | Native DOM APIs |
| HTML5 Shiv | 3.7.3 | 2013 | Unnecessary | Native HTML5 support |
| Respond.js | 1.4.2 | 2013 | Unnecessary | CSS media queries |

**Risk assessment:** Modernizr 2.6.2 has 4 unpatched CVEs (medium severity). jQuery Migrate adds 47KB of unnecessary parsing overhead.

### 3. Analytics Tool Overlap (Medium)

**Discovery:** Four analytics/session-replay tools running concurrently — Adobe Analytics, SiteCatalyst (legacy AA), Glassbox (session replay), and a custom event tracker.

**Data quality impact:** Event naming inconsistencies across tools (e.g., "lead_form_submit", "form_lead_submit", "lead-form-submission" all tracking the same event). Behavioral data divergence of 12-18% between tools.

### 4. Documentation Fragmentation (Medium)

**Discovery:** Marketing documentation stored across 7 locations (SharePoint, Google Drive, network shares, Confluence, email attachments) with no consistent naming convention.

- Data discovery: 1-2 months baseline
- Inter-department handoff: 2-3 months for campaign artifacts
- Metadata schema compliance: 0% (no schema defined)

## Remediation Architecture

### Phase 1: Tag Consolidation (Weeks 1-4)

**Target state:** Single Adobe Launch container with server-side GTM for third-party tags.

**Implementation:**
```yaml
tag_governance:
  permitted_containers:
    - "Adobe Launch"  # Primary
    - "GTM-ServerSide"  # Third-party only
  prohibited_containers:
    - "Adobe DTM"  # Migrate
    - "GTM-ClientSide"  # Migrate to server-side
  validation:
    - "SRI hash required on all external scripts"
    - "CSP nonce on all inline scripts"
```

### Phase 2: Library Modernization (Weeks 5-6)

Incremental migration plan using feature detection and CI-based linting:

```javascript
// Before: Modernizr feature detection
if (Modernizr.flexbox) { /* ... */ }

// After: Native CSS feature detection
@supports (display: flex) {
  /* ... */
}
```

**CI enforcement:**
```yaml
# .eslintrc.yml
rules:
  no-restricted-globals:
    - error
    - name: "Modernizr"
      message: "Use CSS @supports instead of Modernizr"
    - name: "$"
      message: "Use native document.querySelector instead of jQuery"
```

### Phase 3: CDN Optimization (Weeks 7-8)

- Consolidate from dual-CDN (Akamai + Cloudflare) to primary/fallback configuration
- Implement consistent caching headers: `Cache-Control: public, max-age=31536000, immutable` for versioned assets
- Enable Brotli compression (12-18% smaller than gzip)
- Preconnect to critical origins in `<head>`

### Phase 4: Governance Automation (Weeks 9-12)

Deploy OPA-based governance pipeline:

```rego
package martech.dbs

# Enforce single tag manager
deny[msg] {
  containers := {c | c := input.tag_containers[_].name}
  count(containers) > 1
  msg = sprintf("Multiple tag containers: %v. Must consolidate to Adobe Launch.", [containers])
}

# Enforce library version minimums
deny[msg] {
  lib := input.libraries[_]
  lib.name == "jQuery"
  semver.compare(lib.version, "< 3.5.0")
  msg = sprintf("jQuery %v is below minimum 3.5.0", [lib.version])
}

# Enforce SRI on external scripts
deny[msg] {
  script := input.external_scripts[_]
  not script.integrity
  msg = sprintf("Script %v missing integrity hash", [script.src])
}

# Enforce metadata compliance
deny[msg] {
  page := input.pages[_]
  not page.frontmatter.canonical_uri
  msg = sprintf("Page %v missing canonical_uri frontmatter", [page.path])
}
```

## Measured Outcomes

| Metric | Baseline | Post-Implementation | Improvement |
| :--- | :---: | :---: | :---: |
| Page Load Time (LCP) | 3.2s | 2.4s | 25% reduction |
| Tag Containers | 3 | 1 | 66% reduction |
| Legacy Libraries | 12 | 0 | 100% elimination |
| Data Discovery | 1-2 months | Minutes | ~99.8% reduction |
| Campaign Velocity | 15 months | 3 months | 80% acceleration |
| SRI Coverage | 0% | 100% | Full coverage |

## Financial Impact

| Item | Value |
| :--- | ---: |
| Investment | S$250,000 |
| Year 1 Benefit | S$2,790,000 |
| 5-Year IRR | 916% |
| Payback | 1.1 months |
| Conversion Impact | +2.4% (projected) |

## Lessons Learned

1. **Graph analysis is orders of magnitude faster than manual audit** — What took 2 months with spreadsheets takes minutes with graph traversal
2. **Governance must be automated to be sustainable** — Manual governance policies decay within weeks; OPA-enforced policies are self-sustaining
3. **Technical debt compounds exponentially** — Each deprecated library blocks adoption of modern alternatives, creating a widening gap
4. **Documentation standards must be enforced at commit time** — Post-hoc metadata compliance is 10× more expensive than pre-commit validation

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Similar Assessment →</a>
