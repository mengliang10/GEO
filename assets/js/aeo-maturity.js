/* ─── AEO Maturity Assessment Engine v0.1.0 ─────────────────────────────── */
/* Implements ρ(o) = 0.25·SL + 0.20·Auth + 0.20·CD + 0.20·API + 0.15·AN    */

(function() {
  'use strict';

  // Guard: only run on the assessment page
  if (!document.getElementById('aeoStepContainer')) return;

  // ─── Weights ────────────────────────────────────────────────────────────
  const WEIGHTS = {
    semantic: 0.25,
    auth: 0.20,
    discovery: 0.20,
    api: 0.20,
    negotiation: 0.15
  };

  // ─── Question Data ──────────────────────────────────────────────────────
  const QUESTIONS = [
    // Step 0: Semantic Layer
    {
      dimension: 'semantic',
      dimensionName: 'Semantic Layer',
      weight: WEIGHTS.semantic,
      questions: [
        {
          id: 'sl1',
          text: 'What is the extent of your Schema.org/JSON-LD implementation?',
          options: [
            { label: 'No structured data implemented', desc: 'HTML-only content rendering', score: 0.0 },
            { label: 'Basic Schema.org on some pages', desc: 'Article, Organization types implemented', score: 0.25 },
            { label: 'Comprehensive Schema.org coverage', desc: 'Product, FAQ, BreadcrumbList, Event across 80%+ pages', score: 0.60 },
            { label: 'Full ontological coverage + SHACL validation', desc: 'JSON-LD 1.1 with @context resolution, shape validation, canonical URIs', score: 1.0 }
          ]
        },
        {
          id: 'sl2',
          text: 'Do you maintain a knowledge graph of your entities?',
          options: [
            { label: 'No knowledge graph', desc: 'Entity data exists in silos with no relationship mapping', score: 0.0 },
            { label: 'Entity list in spreadsheets', desc: 'Basic inventory of entities, no typed relationships', score: 0.20 },
            { label: 'Connected knowledge graph', desc: 'Typed entities and relationships in graph database', score: 0.60 },
            { label: 'Production knowledge graph with vector search', desc: 'ArcadeDB/Neo4j with HNSW indexes, automated ingestion, SHACL validation', score: 1.0 }
          ]
        },
        {
          id: 'sl3',
          text: 'How do you handle entity resolution across systems?',
          options: [
            { label: 'No entity resolution', desc: 'Same entity may appear differently across systems', score: 0.0 },
            { label: 'Manual reconciliation', desc: 'Human review to identify and merge duplicate entities', score: 0.25 },
            { label: 'Deterministic matching', desc: 'Rule-based matching on email, phone, customer ID', score: 0.60 },
            { label: 'Probabilistic + deterministic graph', desc: 'Probabilistic matching with graph-based identity resolution', score: 1.0 }
          ]
        }
      ]
    },
    // Step 1: Authentication
    {
      dimension: 'auth',
      dimensionName: 'Authentication',
      weight: WEIGHTS.auth,
      questions: [
        {
          id: 'au1',
          text: 'How do external agents authenticate with your systems?',
          options: [
            { label: 'No programmatic authentication', desc: 'Human-only login via web UI', score: 0.0 },
            { label: 'API keys / shared secrets', desc: 'Static API keys in headers', score: 0.25 },
            { label: 'OAuth 2.0 client credentials', desc: 'Standard OAuth flow for machine-to-machine auth', score: 0.60 },
            { label: 'W3C Verifiable Credentials + DPoP', desc: 'VC 2.0 with proof-of-possession, delegation chains', score: 1.0 }
          ]
        },
        {
          id: 'au2',
          text: 'Do you support verifiable delegation for agent actions?',
          options: [
            { label: 'No delegation support', desc: 'Agents cannot act on behalf of users', score: 0.0 },
            { label: 'Manual delegation via admin UI', desc: 'Human must manually authorize each delegation', score: 0.20 },
            { label: 'Token-based delegation', desc: 'OAuth 2.0 token exchange with scoped permissions', score: 0.55 },
            { label: 'Verifiable credential delegation chains', desc: 'W3C VC chains with DID resolution and revocation', score: 1.0 }
          ]
        },
        {
          id: 'au3',
          text: 'How are agent credentials issued and managed?',
          options: [
            { label: 'No credential management', desc: 'No system for agent credential issuance', score: 0.0 },
            { label: 'Manual credential creation', desc: 'Credentials created via admin interface', score: 0.25 },
            { label: 'Automated credential issuance', desc: 'API-based credential creation with role-based permissions', score: 0.55 },
            { label: 'DID-based decentralized identity', desc: 'Self-sovereign identity with did:web, key rotation, revocation', score: 1.0 }
          ]
        }
      ]
    },
    // Step 2: Capability Discovery
    {
      dimension: 'discovery',
      dimensionName: 'Capability Discovery',
      weight: WEIGHTS.discovery,
      questions: [
        {
          id: 'cd1',
          text: 'Do you expose a machine-readable capability registry?',
          options: [
            { label: 'No capability registry', desc: 'Agents must know your API structure a priori', score: 0.0 },
            { label: 'Static API documentation', desc: 'Human-readable OpenAPI/Swagger docs', score: 0.25 },
            { label: 'Well-known capability endpoint', desc: '.well-known/capabilities with typed action definitions', score: 0.60 },
            { label: 'Dynamic capability discovery', desc: 'Real-time capability negotiation with versioning and constraints', score: 1.0 }
          ]
        },
        {
          id: 'cd2',
          text: 'Do you publish Function Calling / Tool Use schemas for your APIs?',
          options: [
            { label: 'No function schemas', desc: 'APIs are not documented for LLM consumption', score: 0.0 },
            { label: 'Partial function schemas', desc: 'Some endpoints have OpenAI/Anthropic tool definitions', score: 0.30 },
            { label: 'Comprehensive tool schemas', desc: 'All agent-facing endpoints have OpenAI + Anthropic tool definitions', score: 0.65 },
            { label: 'Multi-platform tool schemas + MCP', desc: 'OpenAI, Anthropic, MCP formats with automated schema publishing', score: 1.0 }
          ]
        },
        {
          id: 'cd3',
          text: 'How do agents discover your available actions and their constraints?',
          options: [
            { label: 'Not discoverable', desc: 'Actions must be reverse-engineered or manually communicated', score: 0.0 },
            { label: 'Static documentation pages', desc: 'Markdown/HTML pages describing available actions', score: 0.20 },
            { label: 'Structured capability catalog', desc: 'JSON-LD catalog with action types, input schemas, rate limits', score: 0.55 },
            { label: 'Real-time capability discovery', desc: 'Discoverable with authentication scopes, dynamic rate limits, and SLA terms', score: 1.0 }
          ]
        }
      ]
    },
    // Step 3: Transaction API
    {
      dimension: 'api',
      dimensionName: 'Transaction API',
      weight: WEIGHTS.api,
      questions: [
        {
          id: 'ap1',
          text: 'Do your mutation endpoints support idempotency?',
          options: [
            { label: 'No idempotency support', desc: 'Duplicate requests may create duplicate transactions', score: 0.0 },
            { label: 'Basic deduplication', desc: 'Time-window based deduplication (e.g., 5 min)', score: 0.30 },
            { label: 'Idempotency keys', desc: 'Client-provided idempotency keys on all mutation endpoints', score: 0.70 },
            { label: 'Idempotency + exactly-once semantics', desc: 'Idempotency keys with exactly-once delivery guarantees', score: 1.0 }
          ]
        },
        {
          id: 'ap2',
          text: 'What is your error response schema?',
          options: [
            { label: 'No standard error schema', desc: 'Error responses vary by endpoint', score: 0.0 },
            { label: 'HTTP status codes only', desc: 'Standard HTTP statuses with no structured error body', score: 0.20 },
            { label: 'Structured error responses', desc: 'Error code, message, and correlation ID in all error responses', score: 0.55 },
            { label: 'Machine-readable error taxonomy', desc: 'Hierarchical error codes with remediation hints, retry headers', score: 1.0 }
          ]
        },
        {
          id: 'ap3',
          text: 'Do you support webhooks / callbacks for async workflows?',
          options: [
            { label: 'No webhook support', desc: 'Agents must poll for status updates', score: 0.0 },
            { label: 'Limited webhook support', desc: 'Webhooks for some event types, manual registration', score: 0.30 },
            { label: 'Comprehensive webhook system', desc: 'Webhook registration API with event types, retry, delivery receipts', score: 0.65 },
            { label: 'Agent-initiated webhooks + callback discovery', desc: 'Agents register webhooks at runtime, discoverable via capability registry', score: 1.0 }
          ]
        },
        {
          id: 'ap4',
          text: 'How is rate limiting communicated to agents?',
          options: [
            { label: 'No rate limiting', desc: 'No limits enforced, or limits are opaque', score: 0.0 },
            { label: 'Static rate limits in docs', desc: 'Limits documented but not communicated at runtime', score: 0.20 },
            { label: 'Rate limit headers', desc: 'X-RateLimit headers on all responses (limit, remaining, reset)', score: 0.55 },
            { label: 'Agent-aware rate limit negotiation', desc: 'Rate limits in capability registry, burst allowances, priority levels', score: 1.0 }
          ]
        }
      ]
    },
    // Step 4: Agent Negotiation
    {
      dimension: 'negotiation',
      dimensionName: 'Agent Negotiation',
      weight: WEIGHTS.negotiation,
      questions: [
        {
          id: 'an1',
          text: 'Do you support structured intent declarations from buyer agents?',
          options: [
            { label: 'No intent support', desc: 'Agents must use unstructured forms or human channels', score: 0.0 },
            { label: 'Limited intent capture', desc: 'Email/contact form for agent-initiated inquiries', score: 0.20 },
            { label: 'Structured intent API', desc: 'Machine-readable RFQ/RFP endpoint with defined schema', score: 0.55 },
            { label: 'Intent discovery + automated response', desc: 'Buyer agents submit intents via API, auto-evaluated with structured response', score: 1.0 }
          ]
        },
        {
          id: 'an2',
          text: 'Do you have a counteroffer protocol for agent negotiations?',
          options: [
            { label: 'No negotiation support', desc: 'Fixed prices, no counteroffer mechanism', score: 0.0 },
            { label: 'Human-mediated negotiation', desc: 'Counteroffers handled by human sales team', score: 0.20 },
            { label: 'Structured counteroffer API', desc: 'Counteroffer JSON schema with expiration, terms, conditions', score: 0.55 },
            { label: 'Automated agent-to-agent negotiation', desc: 'Real-time negotiation with state machines, binding commitments, escalation paths', score: 1.0 }
          ]
        },
        {
          id: 'an3',
          text: 'How are negotiated commitments digitally enforced?',
          options: [
            { label: 'No digital commitment', desc: 'Negotiations are verbal or email-based', score: 0.0 },
            { label: 'Digital signature on documents', desc: 'DocuSign/Adobe Sign for human signing', score: 0.25 },
            { label: 'API-based commitment confirmation', desc: 'Programmatic agreement confirmation with references', score: 0.55 },
            { label: 'Verifiable on-chain commitments', desc: 'Cryptographic binding commitments with automatic execution and dispute resolution', score: 1.0 }
          ]
        }
      ]
    }
  ];

  // ─── Maturity Levels ────────────────────────────────────────────────────
  const LEVELS = [
    { min: 0.00, label: 'L1 — HUMAN-ONLY', desc: 'Content and transactions designed exclusively for human-mediated interaction. Agents cannot discover, evaluate, or transact.', badge: 'l1' },
    { min: 0.20, label: 'L2 — MACHINE-READABLE', desc: 'Basic structured data enables agents to identify entities. API surfaces are available for programmatic access but not optimized for agent discovery.', badge: 'l2' },
    { min: 0.40, label: 'L3 — MACHINE-UNDERSTANDABLE', desc: 'Knowledge graph infrastructure enables agents to reason about entity relationships and infer capabilities. Basic capability discovery is supported.', badge: 'l3' },
    { min: 0.60, label: 'L4 — AGENT COMMERCE READY', desc: 'Agents can discover, authenticate, evaluate, negotiate, and execute transactions autonomously. Full function calling and VC infrastructure deployed.', badge: 'l4' },
    { min: 0.80, label: 'L5 — AUTONOMOUS ECOSYSTEM', desc: 'The organization operates as a fully autonomous node in the agentic commerce network. Self-describing, self-optimizing, continuously learning.', badge: 'l5' }
  ];

  // ─── Recommendations ────────────────────────────────────────────────────
  const RECS = {
    semantic: {
      low: 'Implement Schema.org/JSON-LD markup on all public-facing pages starting with Article, Organization, and Product types. Prioritize FAQ and HowTo schemas for highest citation probability.',
      medium: 'Expand Schema.org coverage to 80%+ of pages. Begin mapping entities into a knowledge graph with typed relationships and canonical URIs.',
      high: 'Deploy SHACL shape validation, automate entity resolution, and implement vector similarity search (HNSW) for semantic retrieval optimization.'
    },
    auth: {
      low: 'Implement OAuth 2.0 client credentials flow for machine-to-machine authentication. Document token issuance and refresh procedures for agent developers.',
      medium: 'Begin W3C Verifiable Credential implementation. Issue test credentials to partner agent platforms and validate your verification infrastructure.',
      high: 'Deploy DID-based decentralized identity with key rotation, revocation, and federated trust. Implement DPoP for delegation chain verification.'
    },
    discovery: {
      low: 'Create .well-known/capabilities endpoint with basic action definitions. Publish OpenAPI 3.0 schema for your primary API surfaces.',
      medium: 'Expand capability registry with typed action definitions, input/output schemas, and authentication requirements. Add OpenAI Function Calling tool definitions.',
      high: 'Implement dynamic capability discovery with real-time constraint negotiation and SLA exposure. Publish MCP (Model Context Protocol) endpoint.'
    },
    api: {
      low: 'Add idempotency keys to all mutation endpoints. Implement standardized error response format with error codes and correlation IDs.',
      medium: 'Add RateLimit headers to all API responses. Implement webhook registration API with retry logic and delivery receipts.',
      high: 'Implement exactly-once semantics for critical transactions. Deploy agent-aware rate limit negotiation with burst allowances and priority levels.'
    },
    negotiation: {
      low: 'Create a structured intent declaration API for buyer agents. Document the schema and expected negotiation flow publicly.',
      medium: 'Implement counteroffer protocol with structured JSON schema, expiration policies, and escalation paths for human review.',
      high: 'Deploy automated agent-to-agent negotiation with state machines, cryptographic commitments, and verifiable dispute resolution.'
    }
  };

  // ─── State ──────────────────────────────────────────────────────────────
  let currentStep = 0;
  const answers = {};  // { questionId: score }

  // ─── DOM Refs ───────────────────────────────────────────────────────────
  const container = document.getElementById('aeoStepContainer');
  const prevBtn = document.getElementById('aeoPrevBtn');
  const nextBtn = document.getElementById('aeoNextBtn');
  const progressFill = document.getElementById('aeoProgressFill');
  const resultsSection = document.getElementById('aeoResults');

  // ─── Render Current Step ────────────────────────────────────────────────
  function renderStep(stepIdx) {
    const step = QUESTIONS[stepIdx];
    let html = '<div class="aeo-step-content active">';
    
    html += '<div class="aeo-step-header">';
    html += `<h3 class="aeo-step-title">${step.dimensionName} <span style="font-size:0.8rem;color:var(--color-text-muted);font-weight:400;">(${Math.round(step.weight * 100)}% of composite)</span></h3>`;
    html += `<p class="aeo-step-desc">Answer the following questions about your ${step.dimensionName.toLowerCase()} capabilities.</p>`;
    html += '</div>';

    step.questions.forEach(function(q, qi) {
      var answered = answers[q.id] !== undefined;
      html += `<div class="aeo-question ${answered ? 'answered' : ''}" id="q-${q.id}">`;
      html += `<div class="aeo-q-text">${qi + 1}. ${q.text}</div>`;
      html += '<div class="aeo-q-options">';
      
      q.options.forEach(function(opt, oi) {
        var selected = answers[q.id] === opt.score;
        html += `<div class="aeo-q-option ${selected ? 'selected' : ''}" onclick="window.aeoSelect('${q.id}', ${opt.score}, this)">`;
        html += `<div class="aeo-q-radio ${selected ? 'selected' : ''}"></div>`;
        html += '<div class="aeo-q-option-text">';
        html += `<div class="aeo-q-label">${opt.label}</div>`;
        html += `<div class="aeo-q-desc">${opt.desc}</div>`;
        html += '</div>';
        html += `<span class="aeo-q-score">${opt.score === 0.0 ? '0' : opt.score === 1.0 ? '1.0' : opt.score.toFixed(2)}</span>`;
        html += '</div>';
      });
      
      html += '</div></div>';
    });

    html += '</div>';
    container.innerHTML = html;
    updateNav();
    updateProgress();
  }

  // ─── Answer Selection (called from onclick) ─────────────────────────────
  window.aeoSelect = function(qId, score, el) {
    answers[qId] = score;
    
    // Update visual state
    var questionEl = el.closest('.aeo-question');
    questionEl.classList.add('answered');
    
    var options = questionEl.querySelectorAll('.aeo-q-option');
    options.forEach(function(opt) {
      opt.classList.remove('selected');
      opt.querySelector('.aeo-q-radio').classList.remove('selected');
    });
    
    el.classList.add('selected');
    el.querySelector('.aeo-q-radio').classList.add('selected');
    
    updateNav();
  };

  // ─── Navigation ─────────────────────────────────────────────────────────
  function updateNav() {
    // Check if all questions in current step are answered
    var step = QUESTIONS[currentStep];
    var allAnswered = step.questions.every(function(q) {
      return answers[q.id] !== undefined;
    });
    
    nextBtn.disabled = !allAnswered;
    prevBtn.disabled = currentStep === 0;
    
    // Change button text on last step
    if (currentStep === QUESTIONS.length - 1) {
      nextBtn.textContent = 'Calculate Results →';
    } else {
      nextBtn.textContent = 'Next →';
    }

    // Update step circles
    for (var i = 0; i < QUESTIONS.length; i++) {
      var circle = document.getElementById('stepCircle' + i);
      var label = document.getElementById('stepLabel' + i);
      var stepQuestions = QUESTIONS[i].questions;
      var stepAnswered = stepQuestions.every(function(q) { return answers[q.id] !== undefined; });
      
      circle.className = 'aeo-step-circle';
      label.className = 'aeo-step-label';
      
      if (i === currentStep) {
        circle.classList.add('active');
        label.classList.add('active');
      } else if (stepAnswered) {
        circle.classList.add('completed');
        circle.textContent = '✓';
      }
    }
  }

  function updateProgress() {
    var totalQuestions = 0;
    var answeredQuestions = 0;
    QUESTIONS.forEach(function(step) {
      totalQuestions += step.questions.length;
      step.questions.forEach(function(q) {
        if (answers[q.id] !== undefined) answeredQuestions++;
      });
    });
    
    var pct = Math.round((answeredQuestions / totalQuestions) * 100);
    progressFill.style.width = pct + '%';
  }

  window.aeoPrev = function() {
    if (currentStep > 0) {
      currentStep--;
      renderStep(currentStep);
    }
  };

  window.aeoNext = function() {
    if (currentStep < QUESTIONS.length - 1) {
      currentStep++;
      renderStep(currentStep);
    } else {
      calculateResults();
    }
  };

  // ─── Results Calculation ────────────────────────────────────────────────
  function calculateResults() {
    // Hide questions, show results
    document.getElementById('aeoStepContainer').style.display = 'none';
    document.getElementById('aeoNav').style.display = 'none';
    document.getElementById('aeoProgress').style.display = 'none';
    resultsSection.classList.add('active');

    // Calculate dimension scores
    var dimScores = {};
    QUESTIONS.forEach(function(step) {
      var total = 0;
      var count = 0;
      step.questions.forEach(function(q) {
        if (answers[q.id] !== undefined) {
          total += answers[q.id];
          count++;
        }
      });
      dimScores[step.dimension] = count > 0 ? total / count : 0;
    });

    // Calculate composite score
    var composite = 0;
    composite += dimScores.semantic * WEIGHTS.semantic;
    composite += dimScores.auth * WEIGHTS.auth;
    composite += dimScores.discovery * WEIGHTS.discovery;
    composite += dimScores.api * WEIGHTS.api;
    composite += dimScores.negotiation * WEIGHTS.negotiation;

    // Determine level
    var level = LEVELS[0];
    for (var i = LEVELS.length - 1; i >= 0; i--) {
      if (composite >= LEVELS[i].min) {
        level = LEVELS[i];
        break;
      }
    }

    // Render score
    document.getElementById('aeoFinalScore').textContent = composite.toFixed(1);

    var badge = document.getElementById('aeoLevelBadge');
    badge.textContent = level.label;
    badge.className = 'aeo-level-badge ' + level.badge;
    document.getElementById('aeoLevelDesc').textContent = level.desc;

    // Render dimension cards
    var dimHtml = '';
    var dimConfig = [
      { key: 'semantic', name: 'Semantic Layer', color: 'linear-gradient(90deg, #00bcd4, #7c4dff)' },
      { key: 'auth', name: 'Authentication', color: 'linear-gradient(90deg, #7c4dff, #00e676)' },
      { key: 'discovery', name: 'Capability Discovery', color: 'linear-gradient(90deg, #00e676, #ffd740)' },
      { key: 'api', name: 'Transaction API', color: 'linear-gradient(90deg, #ffd740, #ff5252)' },
      { key: 'negotiation', name: 'Agent Negotiation', color: 'linear-gradient(90deg, #ff5252, #00bcd4)' }
    ];

    dimConfig.forEach(function(dim) {
      var score = dimScores[dim.key];
      var pct = Math.round(score * 100);
      var recs = getRecForDim(dim.key, score);
      
      dimHtml += '<div class="aeo-dim-card">';
      dimHtml += '<div class="aeo-dim-header">';
      dimHtml += `<span class="aeo-dim-name">${dim.name}</span>`;
      dimHtml += `<span class="aeo-dim-score">${(score * 100).toFixed(0)}%</span>`;
      dimHtml += '</div>';
      dimHtml += `<div class="aeo-dim-bar"><div class="aeo-dim-fill" style="width:${pct}%;background:${dim.color};"></div></div>`;
      dimHtml += `<div class="aeo-dim-desc">${recs}</div>`;
      dimHtml += '</div>';
    });

    document.getElementById('aeoDimResults').innerHTML = dimHtml;

    // Render recommendations
    renderRecommendations(dimScores);
  }

  function getRecForDim(dim, score) {
    if (score <= 0.35) return RECS[dim].low;
    if (score < 0.65) return RECS[dim].medium;
    return RECS[dim].high;
  }

  function renderRecommendations(dimScores) {
    var sorted = Object.keys(dimScores).sort(function(a, b) {
      return dimScores[a] - dimScores[b];
    });

    var html = '';
    sorted.forEach(function(dim) {
      var score = dimScores[dim];
      var priority = score < 0.30 ? 'high' : (score < 0.60 ? 'medium' : 'low');
      var dimNames = {
        semantic: 'Semantic Layer',
        auth: 'Authentication',
        discovery: 'Capability Discovery',
        api: 'Transaction API',
        negotiation: 'Agent Negotiation'
      };
      
      html += '<div class="aeo-rec-item">';
      html += `<div class="aeo-rec-priority ${priority}">${priority.toUpperCase()}</div>`;
      html += `<div class="aeo-rec-text"><strong>${dimNames[dim]}</strong> (${(score * 100).toFixed(0)}%) — ${getRecForDim(dim, score)}</div>`;
      html += '</div>';
    });

    document.getElementById('aeoRecList').innerHTML = html;
  }

  // ─── Restart ────────────────────────────────────────────────────────────
  window.aeoRestart = function() {
    // Reset state
    currentStep = 0;
    for (var key in answers) delete answers[key];

    // Show UI elements
    document.getElementById('aeoStepContainer').style.display = '';
    document.getElementById('aeoNav').style.display = '';
    document.getElementById('aeoProgress').style.display = '';
    resultsSection.classList.remove('active');

    // Re-render
    renderStep(0);
  };

  // ─── Initialize ─────────────────────────────────────────────────────────
  renderStep(0);
})();
