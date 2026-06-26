---
title: "DBS Bank: Martech Stack Modernization & Knowledge Graph Implementation"
subtitle: "How a comprehensive martech audit and strategic consolidation delivered 916% ROI"
sidebar: true
---

## Executive Summary

DBS Bank, a leading financial services group headquartered in Singapore, engaged GEONEXUS to conduct a comprehensive audit of their marketing technology stack on dbs.com.sg. The engagement revealed significant tool redundancy, technical debt, and documentation fragmentation — all of which were impacting page performance, data quality, and campaign velocity.

**The solution:** A strategic consolidation and modernization program anchored by an ArcadeDB-powered knowledge graph that mapped the entire martech ecosystem.

## The Challenge

### Tool Sprawl
DBS was running **three tag managers simultaneously**:
- Adobe Launch (primary)
- Adobe Tag Manager (legacy, still active)
- Google Tag Manager (for specific campaigns)

This triple-setup created a 0.8-second page load penalty, data inconsistencies, and an expanded security surface area.

### Technical Debt
The website was serving:
- **Modernizr 2.6.2** (released 2012) — feature detection library kept for legacy compatibility
- **jQuery Migrate 3.0.1** — compatibility layer for old jQuery plugins
- **HTML5 Shiv** — unnecessary for modern browsers

These obsoleted libraries blocked the adoption of native browser capabilities and created security vulnerabilities.

### Documentation Fragmentation
Marketing documentation suffered from:
- Inconsistent URI schemes (no canonical naming convention)
- Unstructured metadata (no standardized front-matter)
- Fragmented directory trees across multiple storage locations
- Data discovery time: **1-2 months**
- Campaign handoff between departments: **2-3 months**

## Our Approach

### Phase 1: Knowledge Graph Construction
We built an ArcadeDB knowledge graph mapping DBS's entire martech ecosystem:

**Entity types captured:**
- Platforms (Adobe Launch, Adobe Analytics, GTM, Akamai, Cloudflare, etc.)
- Strategies (AI-Fuelled Bank, Digital Transformation, Sustainability)
- Metrics (page load time, conversion rate, data freshness)
- Processes (campaign deployment, data discovery, tag management)
- Companies (DBS, partners, vendors)

**Relationship types mapped:**
- `REQUIRES` — Platform dependencies
- `IMPLEMENTS_STRATEGY` — Strategic alignment
- `MEASURES` — Metric tracking
- `COMPATIBLE_WITH` — Interoperability
- `ACQUIRED` — Organizational history

**Scale:** 115,000+ nodes with 384-dimension HNSW vector indexes for semantic search.

### Phase 2: Comparative Analysis
The knowledge graph enabled us to compare DBS's current state against best practices curated from our industry knowledge base, automatically surfacing:
- Overlapping tools and redundant capabilities
- Undocumented dependencies
- Deprecated technologies past end-of-life
- Gap areas where capabilities were missing

### Phase 3: Strategic Roadmap
Based on the analysis, we developed a 12-week implementation plan:

**Weeks 1-4: Audit & Architecture**
- Comprehensive tag mapping and dependency analysis
- Canonical URI and metadata schema design
- Governance framework definition

**Weeks 5-8: Migration & Cleanup**
- Tag manager consolidation (Adobe Launch only)
- Legacy library deprecation
- Modernizr and jQuery Migrate removal

**Weeks 9-10: Optimization**
- CDN rationalization (Akamai + Cloudflare optimization)
- JavaScript performance optimization
- SRI hash implementation for security

**Weeks 11-12: Testing & Validation**
- Staging environment validation
- Performance regression testing
- Governance automation (Compliance as Code)

## Financial Impact

| Item | Value |
| :--- | ---: |
| **Investment** | S$250,000 |
| **Year 1 Benefit** | S$2,790,000 |
| **ROI** | 916% |
| **Payback Period** | 1.1 months |
| **Page Load Improvement** | 0.8 seconds |
| **Conversion Rate Impact** | +2.4% |
| **Data Discovery Time** | From 2 months to minutes |

## Key Recommendations

1. **Consolidate Tag Management** — Single Adobe Launch container only; third-party tags to server-side GTM
2. **Modernize JavaScript** — Replace Modernizr with native CSS `@supports`; incremental jQuery removal
3. **Implement Canonical Metadata** — Standardized URI scheme and front-matter requirements
4. **Deploy Governance as Code** — Pre-commit hooks, CI validation, automated compliance dashboards
5. **Maintain Knowledge Graph** — Continuous updates with automated ingestion pipelines

## The Bigger Picture

This engagement demonstrated that martech stack optimization isn't just about cost savings — it's about building the foundation for AI-powered marketing. A clean, governed, well-documented technology stack is a prerequisite for GEO, AEO, and AIO readiness.

The DBS case study shows that with the right methodology, enterprises can achieve both immediate performance gains and long-term strategic capabilities.

*This case study is based on actual analysis conducted for DBS Bank. [Contact us](/contact/) to learn how we can help your organization.*
