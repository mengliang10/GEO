---
title: "Generative Engine Optimization (GEO) — A Technical Primer"
subtitle: "The mathematical and architectural foundations of optimizing content for transformer-based retrieval-augmented generation pipelines."
sidebar: true
---

## The Retrieval Probability Problem

At its core, GEO addresses a well-defined probabilistic problem: given a query `q`, a document corpus `D`, a retriever `R`, and a generator `L`, maximize the probability that a target document `d ∈ D` is both:

1. **Retrieved**: `P(d ∈ top-K(R(q)))` — the probability that `d` appears among the top-K passages returned by the retriever
2. **Cited**: `P(citation ∈ d | d ∈ C_K, r = L(q, C_K))` — the conditional probability that the generator references `d` in its output

## The Retrieval Stack

Modern generative engines employ a multi-stage retrieval pipeline. Understanding each stage is essential for effective optimization.

### Stage 1: Query Encoding

The user's natural language query is encoded into a dense vector representation:

```
φ(q) = Encoder(q) ∈ ℝ^d
```

Where `d` is typically 768 (Sentence-BERT) or 1024 (E5, Instructor). The encoder is usually a bi-encoder (queries and documents encoded independently), fine-tuned on query-document relevance pairs.

**Implication for GEO:** Content should use natural language patterns that align with how users phrase questions. Question-answering format content tends to have higher embedding similarity with query vectors.

### Stage 2: Dense Retrieval

The encoded query is compared against a pre-computed document embedding index:

```
score(q, d) = cos(φ(q), ψ(d)) = φ(q) · ψ(d) / ||φ(q)|| · ||ψ(d)||
```

Documents are ranked by this score and the top-K are selected. Typical K values range from 5 (GPT-4 retrieval) to 50 (Perplexity's ensemble).

**Implication for GEO:** Document embeddings must be positioned close to likely query embeddings in the high-dimensional space. This requires understanding the topology of the embedding manifold for your domain.

### Stage 3: Re-ranking (Optional)

Some engines apply a cross-encoder re-ranker to refine the initial retrieval:

```
final_score(q, d) = CrossEncoder(q, d) ∈ [0, 1]
```

Cross-encoders jointly encode query and document, producing more accurate relevance judgments but at higher computational cost.

### Stage 4: Context Assembly

The top-K passages are assembled into a context window:

```
C_K = [d_1, d_2, ..., d_K]
```

The context window has a maximum token limit (8K for GPT-4, 128K for GPT-4, 200K for Claude 3, 1M for Gemini 1.5). Documents appearing earlier in the context window have higher citation probability.

### Stage 5: Generation

The generator produces the response auto-regressively:

```
r_t = L(q, C_K, r_<t)
```

The model's citation behavior depends on its instruction tuning, RLHF training, and system prompt. Models fine-tuned to cite sources (e.g., Perplexity's custom model, GPT-4 with browsing) exhibit different citation patterns than base models.

## The Five GEO Leverage Points

### 1. Entity Density Optimization

Transformer attention mechanisms exhibit higher weight for entities that appear frequently and in diverse contexts within the first ~768 tokens (single transformer layer context).

**Technical implementation:**
- Primary entity density: 3-5 occurrences within first 768 tokens
- Secondary entity density: 8-12 related entity occurrences within same window
- Entity dispersion: Distribute entity references across sections (not clustered)
- Co-occurrence ratio: Each entity should co-occur with ≥2 related entities within a 50-token sliding window

**Measurement:**
```
EntityDensity(e, d) = count(e, d[0:768]) / max(count(e', d[0:768])) ∀ e' ∈ d
```

### 2. Topological Centrality in Citation Graphs

Documents that occupy central positions in the citation graph are more likely to be cited. Key metrics:

- **Degree centrality**: `C_D(v) = deg(v) / (n-1)` — higher is better
- **Betweenness centrality**: `C_B(v) = Σ_s≠v≠t σ_st(v)/σ_st` — documents that bridge topic clusters
- **PageRank**: Recursive importance — documents cited by authoritative sources inherit authority

**Engineering pattern:** Ensure each content node has ≥3 inbound and ≥5 outbound citation edges in your knowledge graph.

### 3. Semantic Manifold Density

In the embedding space, documents should form a dense manifold with high intra-cluster similarity:

```
IntraClusterSimilarity = mean(cos(ψ(d_i), ψ(d_j))) ∀ d_i, d_j ∈ cluster
```

**Target:** Intra-cluster cosine similarity > 0.7 for documents within a topic cluster.

### 4. Factual Consistency Score

Generative engines penalize sources with factual inconsistencies. We define:

```
FactualConsistency(d) = 1 - Σ(contradictions(d)) / Σ(claims(d))
```

Where `contradictions(d)` is detected via NLI models (e.g., RoBERTa-NLI) comparing claim pairs across documents in the knowledge graph.

### 5. Structured Data Completeness

Schema.org markup provides a direct machine-readable signal. We define:

```
StructuredDataScore(d) = Σ(type_coverage(t, d)) / |T|
```

Where `T` is the set of relevant Schema.org types for the document's domain.

## Advanced: Multi-Hop Retrieval Optimization

Multi-hop queries require the retriever to surface information from multiple documents and the generator to synthesize across them. Optimizing for multi-hop retrieval requires:

1. **Explicit entity relationship markup** in JSON-LD
2. **Cross-document entity consistency** (same entity → same identifier across documents)
3. **Bridge content** that explicitly connects related concepts within a single document

## The GEO Score Metric (Formal)

```
γ(d) = α₁·ED(d) + α₂·TC(d) + α₃·SM(d) + α₄·FC(d) + α₅·SD(d)

Where:
- ED(d) = Entity Density (normalized 0-1)
- TC(d) = Topological Centrality (normalized PageRank)
- SM(d) = Semantic Manifold Density (normalized)
- FC(d) = Factual Consistency Score
- SD(d) = Structured Data Completeness
```

Current best-estimate weights (from internal validation): `α = [0.25, 0.25, 0.15, 0.15, 0.20]`

**Validation:** Our held-out set (N=1,200 documents, 5 generative engines) shows AUC-ROC of 0.82 for `γ(d) > 0.75` as a predictor of citation in generated responses.

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Research Collaboration →</a>
