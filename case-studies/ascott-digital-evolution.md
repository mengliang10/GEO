---
title: "The Ascott Limited: Agentic Commerce Readiness & Cubby-Native AEO Architecture"
subtitle: "Architecture-level assessment of Ascott's 14-brand digital ecosystem — from conversational AI to autonomous agent transaction infrastructure."
sidebar: true
---

## Engagement Overview

**Client:** The Ascott Limited — Global Hospitality (14 brands, 400+ properties)  
**Stack:** Salesforce Data Cloud, DiscoverASR, Cubby AI Concierge, Oakwood PMS  
**Assessment Focus:** Agentic Commerce Readiness, AEO Maturity, Knowledge Graph Architecture  
**Competitive Context:** Estimated 24-36 month technology lead over Frasers Hospitality

## Current State Architecture

### Digital Platform Topology

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  CONSUMER INTERFACE                                                          │
│  ┌────────────────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ discoverASR.com        │  │ Mobile Apps  │  │ Cubby AI Concierge       │  │
│  │ (14 brands, unified)   │  │ (Native iOS/ │  │ (900K+ interactions)     │  │
│  │                        │  │  Android)    │  │                          │  │
│  └────────────────────────┘  └─────────────┘  └──────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│  EXPERIENCE LAYER                                                            │
│  ┌────────────────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Headless CMS           │  │ Salesforce  │  │ Contentful/Storyblok     │  │
│  │ (composable, API-first)│  │ Marketing   │  │ (multi-brand content     │  │
│  │                        │  │ Cloud       │  │  delivery)               │  │
│  └────────────────────────┘  └─────────────┘  └──────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│  INTELLIGENCE LAYER                                                          │
│  ┌────────────────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Salesforce Data Cloud  │  │ Cubby AI    │  │ Salesforce Agentforce    │  │
│  │ (CDP + Data Graph)     │  │ (LLM + RAG) │  │ (Agentic workflow engine)│  │
│  └────────────────────────┘  └─────────────┘  └──────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│  DATA PLANE                                                                  │
│  ┌────────────────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Salesforce Data Cloud  │  │ Azure       │  │ Oakwood PMS (legacy)     │  │
│  │ (unified customer      │  │ SQL DB      │  │ (not fully integrated)  │  │
│  │  profiles)             │  │             │  │                          │  │
│  └────────────────────────┘  └─────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### AEO Readiness Assessment

We evaluated Ascott's readiness for autonomous agent commerce across five dimensions using the AEO-ML framework:

| Dimension | Score | Assessment |
| :--- | :---: | :--- |
| **Semantic Layer** | 7/10 | Strong Schema.org coverage across discoverASR; inconsistent across Oakwood properties |
| **Authentication** | 6/10 | Salesforce Identity foundation; no W3C VC/DPoP for agent auth |
| **Capability Discovery** | 5/10 | No `.well-known/capabilities` endpoint; API surface not documented for agent consumption |
| **Transaction API** | 6/10 | Booking API exists; lacks idempotency keys and consistent error schemas |
| **Agent Negotiation** | 3/10 | No agent-to-agent negotiation protocol; Cubby is informational only |

**AEO Composite Score: 5.4/10 (L3 — Machine-Understandable)**
**Target: 8.0/10 (L5 — Autonomous Commerce Ecosystem)**

### Cubby AI Interaction Analysis

We analyzed 900,000+ Cubby interactions to classify the conversation corpus:

| Intent Category | Volume | Current Capability | Target Capability |
| :--- | :---: | :--- | :--- |
| Property info/amenities | 38% | ✅ Handled | ✅ Handled |
| Nearby attractions | 22% | ✅ Handled | ✅ Handled |
| Booking enquiries | 18% | ⚠️ Redirect to web | 🤖 Autonomous booking |
| Service requests | 12% | ✅ Handled | ✅ Handled |
| Modifications/cancellations | 7% | ❌ Transferred to agent | 🤖 Autonomous handling |
| Loyalty/payments | 3% | ❌ Transferred to agent | 🤖 Autonomous handling |

**Key insight:** 28% of interactions currently require human escalation. With Agentforce-powered transactional capability, an estimated 22 of 28 percentage points could be autonomously resolved — reducing human escalation to ~6%.

## Strategic Roadmap

### Phase 1: Agent Commerce Foundation (0-12 Months)

**1. Oakwood Integration — Graph API Gateway**
Deploy an API gateway (MuleSoft/Kong) between Oakwood's legacy PMS and the Ascott digital ecosystem. This creates a unified service interface without requiring a full PMS replacement.

**Architecture:**
```
[Oakwood PMS] → [API Gateway] → [GraphQL Federation] → [Salesforce Data Cloud]
```

**2. Cubby 2.0 — Agentic Workflow Engine**
Upgrade Cubby from informational chatbot to transactional agent using Salesforce Agentforce:

```json
{
  "capability": "booking:modify",
  "trigger": "User requests modification within cancellation window",
  "workflow": [
    {"step": "authenticate", "method": "Salesforce Identity"},
    {"step": "check_cancellation_policy", "method": "GraphQL query to PMS"},
    {"step": "present_options", "method": "LLM generates available date/room options"},
    {"step": "execute_modification", "method": "POST /bookings/{id} — idempotency-key: <uuid>"},
    {"step": "confirm", "method": "Send updated itinerary via email/SMS"}
  ],
  "escalation_triggers": ["Outside cancellation window", "Payment failure", "Multi-property booking"]
}
```

**3. Capability Registry Implementation**
Deploy `.well-known/capabilities` endpoint exposing all agent-accessible actions:

```json
{
  "@context": "https://schema.org/AEO/capabilities/v1",
  "agent": {"@type": "Organization", "name": "Ascott Limited"},
  "capabilities": [
    {"@type": "EntryPoint", "name": "SearchInventory", "urlTemplate": "https://api.discoverasr.com/v3/inventory{?city,dates,guests}"},
    {"@type": "EntryPoint", "name": "CreateBooking", "urlTemplate": "https://api.discoverasr.com/v3/bookings"},
    {"@type": "EntryPoint", "name": "ModifyBooking", "urlTemplate": "https://api.discoverasr.com/v3/bookings/{id}"},
    {"@type": "EntryPoint", "name": "CheckLoyaltyBalance", "urlTemplate": "https://api.discoverasr.com/v3/loyalty/{memberId}"}
  ]
}
```

### Phase 2: AEO Scale (12-24 Months)

- Full Schema.org/JSON-LD implementation across all 400+ properties
- AEO-optimized property entity framework with machine-readable room types, amenities, and pricing
- Reinforced learning revenue management system
- Cross-property availability search for AI travel agents

### Phase 3: Autonomous Commerce (24-36 Months)

- Agent-to-agent negotiation protocol for group bookings
- Dynamic pricing exposure via agent-readable price feeds
- Predictive availability optimization using multi-agent reinforcement learning

## Measurable Outcomes

| Metric | Current | Phase 1 Target | Phase 2 Target |
| :--- | :---: | :---: | :---: |
| Auto-resolved interactions | 72% | 92% | 97% |
| AEO Composite Score | 5.4/10 | 7.5/10 | 9.0/10 |
| Agent-completable transactions | 0 | 4 | 12 |
| Schema.org coverage | 65% | 90% | 100% |

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Readiness Assessment →</a>
