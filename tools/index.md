---
title: "Protocol & Infrastructure Registry — v0.1.0"
subtitle: "Curated instrumentation, platforms, and frameworks for GEO, AEO, and AIO engineering deployments."
sidebar: true
---

## Tool Ecosystem Reference

The GEO/AEO/AIO engineering stack spans graph databases, vector indexes, verifiable credential infrastructure, policy engines, LLM gateways, and data plane components. Below is our curated registry — categorized by architectural layer — of tools we spec, benchmark, and deploy in production engagements.

---

### Knowledge Graph & Vector Infrastructure

<div class="tools-grid">

<div class="tool-card">
<h3>ArcadeDB</h3>
<p>Multi-model graph database supporting SQL, openCypher, and Gremlin. Deployed as the core graph engine in our knowledge graph analysis pipeline. Features 384-dim HNSW vector indexes for semantic similarity search, ACID compliance, and automated deadlock recovery via configurable retry decorators. Benchmarked at 8ms p99 query latency on 115K-node production graphs.</p>
<div class="tool-meta">
<span>Graph Database</span>
<span>Multi-Model</span>
</div>
</div>

<div class="tool-card">
<h3>Neo4j</h3>
<p>Established property graph database with Cypher query language. Mature ecosystem with Bloom visualization, APOC procedure library, and GraphQL integration. Preferred for organizations with existing Neo4j investments or requiring rich visualization tooling.</p>
<div class="tool-meta">
<span>Graph Database</span>
<span>Cypher / Gremlin</span>
</div>
</div>

<div class="tool-card">
<h3>Pinecone / Weaviate / Milvus</h3>
<p>Vector databases for semantic search and LLM memory infrastructure. Critical for RAG pipeline embedding storage and retrieval. We evaluate based on: query latency (p99), index build time (per 100K vectors), filtering performance, and multi-tenancy support. Current recommended stack: Pinecone for production, Milvus for self-hosted deployments.</p>
<div class="tool-meta">
<span>Vector Database</span>
<span>Cosine / Euclidean</span>
</div>
</div>

<div class="tool-card">
<h3>Ontotext GraphDB</h3>
<p>Semantic graph database with RDF 1.2 and SPARQL 1.2 support. Strong for organizations with existing linked data initiatives, W3C standards compliance, and SHACL shape validation requirements. Supports inferred reasoning via OWL 2 RL rulesets.</p>
<div class="tool-meta">
<span>Semantic Graph DB</span>
<span>RDF / SPARQL</span>
</div>
</div>

</div>

---

### Policy Engine & Governance Infrastructure

<div class="tools-grid">

<div class="tool-card">
<h3>Open Policy Agent (OPA)</h3>
<p>Unified policy engine with declarative Rego language. Deployed as the governance plane across our AIO engagements — enforcing tag management consolidation, library versioning, metadata schema compliance, and security header requirements at CI/CD time. Integrates with Kubernetes admission controllers, API gateways, and CI pipelines.</p>
<div class="tool-meta">
<span>Policy Engine</span>
<span>Rego / OPA</span>
</div>
</div>

<div class="tool-card">
<h3>Rego Policy Suite (GEONEXUS)</h3>
<p>Our published library of production Rego policies for martech governance — including tag management, library lifecycle, metadata schema, and security header rules. Deployed across DBS engagement with verified 99.9% audit time reduction. [Open protocol — available for integration.]</p>
<div class="tool-meta">
<span>Policy Library</span>
<span>Open Source</span>
</div>
</div>

</div>

---

### Verifiable Credential & Authentication Infrastructure

<div class="tools-grid">

<div class="tool-card">
<h3>W3C Verifiable Credential 2.0</h3>
<p>Emerging standard for autonomous agent authentication. Specifies credential data model, proof mechanisms (DataIntegrityProof, EdDSA), and presentation protocols. Our AEO deployments implement VC-based agent authentication with DPoP binding for secure delegation chains. Requires DID registration and key management infrastructure.</p>
<div class="tool-meta">
<span>Auth Standard</span>
<span>W3C / VC</span>
</div>
</div>

<div class="tool-card">
<h3>Decentralized Identifiers (DID)</h3>
<p>W3C-standard identifier format for verifiable credential subjects and issuers. Deployed in `did:web` method for HTTP-resolvable DIDs (aligns with GitHub Pages infrastructure). Supports key rotation, delegation, and cross-platform credential federation.</p>
<div class="tool-meta">
<span>Identity Standard</span>
<span>did:web</span>
</div>
</div>

</div>

---

### LLM Gateway & Model Infrastructure

<div class="tools-grid">

<div class="tool-card">
<h3>OpenAI API / Anthropic API / Gemini API</h3>
<p>Primary LLM providers for generative engine interaction and tool-augmented generation. We benchmark citation behavior across all three for GEO Score validation. Function Calling / Tool Use schemas must be maintained per provider as API versions evolve. Current focus: cross-provider schema portability and inference cost optimization.</p>
<div class="tool-meta">
<span>LLM API</span>
<span>Token-based</span>
</div>
</div>

<div class="tool-card">
<h3>LangChain / LlamaIndex</h3>
<p>Frameworks for building RAG pipelines and LLM-powered applications. We use these for:
- RAG pipeline orchestration (document chunking, embedding, retrieval)
- Tool-augmented generation workflows (function calling, tool selection)
- Agent runtime infrastructure (memory, planning, execution)
- Evaluation harnesses for citation accuracy and retrieval precision</p>
<div class="tool-meta">
<span>AI Framework</span>
<span>Python / TS</span>
</div>
</div>

<div class="tool-card">
<h3>Hugging Face Sentence-Transformers</h3>
<p>Reference implementation for dense passage retrieval (DPR) embedding generation. Used in our GEO Score validation pipeline to measure query-document embedding similarity (cosine) and semantic manifold density. Deployed with `all-MiniLM-L6-v2` for general domains, `BAAI/bge-large-en-v1.5` for technical content.</p>
<div class="tool-meta">
<span>Embedding Model</span>
<span>768-dim / 1024-dim</span>
</div>
</div>

</div>

---

### Data Plane & Warehousing Infrastructure

<div class="tools-grid">

<div class="tool-card">
<h3>Google BigQuery</h3>
<p>Serverless data warehouse deployed as the compute engine in our warehouse-native CDP architecture. Features: columnar storage, automatic scaling, on-demand pricing, BigQuery ML for in-warehouse model training. Benchmarked: 5-second query latency on 100M-row customer event tables with appropriate clustering.</p>
<div class="tool-meta">
<span>Data Warehouse</span>
<span>Serverless</span>
</div>
</div>

<div class="tool-card">
<h3>dbt (Data Build Tool)</h3>
<p>Transformation framework for warehouse-native data pipelines. Our standard for CDP data modeling: staging → intermediate → mart layers with incremental model strategies. Supports testing, documentation generation, and CI/CD integration for data quality enforcement.</p>
<div class="tool-meta">
<span>Data Transformation</span>
<span>SQL / Jinja</span>
</div>
</div>

<div class="tool-card">
<h3>Hightouch / Census</h3>
<p>Reverse ETL platforms for syncing warehouse data to operational tools. Deployed in our composable CDP architecture — replacing traditional CDP data duplication with warehouse-native segment activation. Supports: Braze, Salesforce MC, HubSpot, Google Ads, Facebook Ads.</p>
<div class="tool-meta">
<span>Reverse ETL</span>
<span>Warehouse Sync</span>
</div>
</div>

</div>

---

### CI/CD & Deployment Infrastructure

<div class="tools-grid">

<div class="tool-card">
<h3>GitHub Actions</h3>
<p>CI/CD platform for automated site deployment and governance pipeline execution. Our standard deployment: Jekyll build → OPA policy evaluation → Page deploy. Workflow executes governance checks (tag management, library versioning, metadata compliance) before deployment gates.</p>
<div class="tool-meta">
<span>CI/CD</span>
<span>GitHub</span>
</div>
</div>

<div class="tool-card">
<h3>Pagefind</h3>
<p>Static search library — zero server dependencies, client-side indexing and querying. Deployed in our documentation and content infrastructure for AI-accessible full-text search. Generates a static search index at build time that supports faceted filtering and multilingual tokenization.</p>
<div class="tool-meta">
<span>Static Search</span>
<span>Client-Side</span>
</div>
</div>

</div>

---

### Monitoring & Observability

<div class="tools-grid">

<div class="tool-card">
<h3>Citation Monitoring (Perplexity / ChatGPT / Gemini / Claude)</h3>
<p>Primary generative engines for GEO Score monitoring. We deploy automated pipelines that query each engine with topic-specific probes and analyze citation patterns — tracking brand mention frequency, citation position, sentiment, and source attribution accuracy.</p>
<div class="tool-meta">
<span>Monitoring</span>
<span>Multi-Engine</span>
</div>
</div>

<div class="tool-card">
<h3>Custom GEO Score Pipeline</h3>
<p>Internal tooling for continuous GEO Score measurement. Evaluates entity density, JSON-LD completeness, semantic manifold position, and citation graph centrality against defined benchmarks. Outputs per-document score with improvement recommendations. [Internal — not yet published.]</p>
<div class="tool-meta">
<span>Analytics</span>
<span>Internal</span>
</div>
</div>

</div>

---

### Interactive Tools

<div class="tools-grid">

<div class="tool-card">
<h3>🧮 GEO Score Calculator <span style="font-size:0.7rem;color:var(--color-accent-dark);font-weight:600;">v0.1.0</span></h3>
<p>Interactive estimator for citation probability across transformer-based RAG pipelines. Adjust entity density, structured data completeness, factual consistency, topological centrality, and freshness parameters — visualize the composite GEO Score in real time with dimension breakdown.</p>
<div class="tool-meta">
<span>Interactive Tool</span>
<span>JavaScript</span>
</div>
<a href="/tools/geo-score-calculator/" class="btn btn-outline" style="margin-top: var(--space-sm);">Launch Calculator →</a>
</div>

</div>

---

*This registry is continuously updated as the GEO/AEO/AIO tool ecosystem evolves. v0.1.0 — Last updated: June 2026.*

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Research Collaboration →</a>
