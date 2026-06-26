---
title: "AI Engine Optimization (AEO) — Autonomous Agent Protocol Architecture"
subtitle: "The protocol stack, capability discovery mechanisms, and trust infrastructure required for autonomous agent-mediated commerce."
sidebar: true
---

## The Agentic Commerce Protocol Stack

AEO addresses the engineering requirements for the emerging autonomous agent commerce layer. This layer is defined by five hierarchical protocols that enable machine-to-machine discovery, authentication, negotiation, and transaction execution.

## Layer 1: Machine-Readable Semantic Layer

### Knowledge Organization Systems (KOS)

Autonomous agents navigate organizational ecosystems through structured knowledge representations. The foundational requirement is a machine-readable knowledge organization system that exposes entities, relationships, and capabilities in a format parsable by LLM context encoders.

**Required standards compliance:**
- Schema.org (core vocabulary for entities and relationships)
- JSON-LD 1.1 (preferred serialization; supports `@context` resolution, `@graph` for entity collections)
- RDF 1.2 (for advanced graph query capabilities)
- SHACL (Shapes Constraint Language) for graph validation

**Critical schema types for agentic commerce:**
- `Service` with provider, areaServed, availableChannel, serviceType
- `Product` with sku, gtin, offers (with price, priceCurrency, availability)
- `Action` — the agent-readable capability descriptor
- `EntryPoint` — URL templates for API invocation
- `Demand` — for procurement agents searching for suppliers

### Entity Resolution

Agents must resolve entity references across documents. This requires:
- Canonical URIs for every entity (preferably `https://vendor.com/id/entity-type/entity-id`)
- `sameAs` relationships to known entity registries (Wikidata, Crunchbase, D&B)
- Consistent entity naming across all touchpoints

## Layer 2: Authentication & Trust Layer

### Verifiable Credential Infrastructure

For agents to authenticate and receive authorization, they must present machine-verifiable credentials.

**W3C Verifiable Credential Data Model 2.0:**

```
{
  "@context": ["https://www.w3.org/ns/credentials/v2", ...],
  "id": "urn:uuid:<uuid>",
  "type": ["VerifiableCredential", "<CredentialType>"],
  "issuer": "<DID>",
  "validFrom": "<ISO-8601>",
  "validUntil": "<ISO-8601>",
  "credentialSubject": {
    "id": "<DID of agent>",
    "authorizedActions": ["<action1>", "<action2>"],
    "constraints": { ... }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-rdfc-2022",
    "proofValue": "<signature>"
  }
}
```

### Delegation Chains

Agents may act on behalf of other agents or human principals. The delegation chain must be verifiable:

```
Principal → Agent A → Agent B → Vendor API
```

Each delegation link requires a verifiable credential issued by the delegator to the delegate, scoping the authorized actions.

### DPoP (Demonstration of Proof-of-Possession)

DPoP binds an agent's proof-of-possession of a private key to an OAuth 2.0 access token, preventing token theft and replay attacks in agent-mediated authentication flows.

## Layer 3: Capability Discovery Layer

### The `.well-known/capabilities` Endpoint

Agents discover what actions a vendor supports by querying the well-known capability discovery endpoint:

```
GET https://vendor.com/.well-known/capabilities
Accept: application/ld+json
```

**Response schema:**
```json
{
  "@context": "https://schema.org/AEO/capabilities/v1",
  "agent": {
    "@type": "Organization",
    "identifier": "did:web:vendor.com"
  },
  "capabilities": [
    {
      "@type": "EntryPoint",
      "name": "CreateBooking",
      "description": "Create a new hotel booking",
      "urlTemplate": "https://api.vendor.com/v3/bookings{?checkIn,checkOut,guestCount}",
      "httpMethod": "POST",
      "contentType": "application/json",
      "actionApplication": {
        "@type": "Action",
        "name": "CreateAction",
        "object": {
          "@type": "Reservation",
          "reservationFor": {"@type": "HotelRoom"}
        }
      },
      "authentication": {
        "@type": "VerifiableCredential",
        "requiredType": "HotelBookingAgentCredential"
      }
    }
  ]
}
```

### AgentQL / Function Calling Schema Discovery

Beyond capability discovery, agents need tool schemas in formats their LLM understands:

- **OpenAI Function Calling**: JSON Schema-based tool definitions
- **Anthropic Tool Use**: JSON Schema input schemas with descriptions
- **Model Context Protocol (MCP)**: Emerging standard for LLM tool discovery

## Layer 4: Function Execution Layer

### Tool-Augmented Generation (TAG)

When an agent decides to act, it invokes the vendor API through a tool call:

```json
{
  "type": "function",
  "function": {
    "name": "create_booking",
    "arguments": "{\"checkIn\":\"2026-08-15\",\"checkOut\":\"2026-08-18\",\"guestCount\":2,\"preferences\":[\"pool\",\"breakfast\"]}"
  }
}
```

**API design requirements for agent compatibility:**
- Idempotency keys for all mutation endpoints
- Consistent error response schemas
- Rate limiting with clear retry headers
- Pagination with stable cursors
- Comprehensive parameter validation error messages

### Webhook / Callback Support

Asynchronous workflows require agent-callable webhooks for status updates:

```
Agent → Vendor: CreateBooking → 202 Accepted (Location: /bookings/abc-123)
Vendor → Agent: POST /webhooks/agent.example.com/booking-update
  {"bookingId": "abc-123", "status": "confirmed", "confirmationCode": "XYZ789"}
```

## Layer 5: Experience Execution Layer

### Agent-to-Agent Negotiation

The frontier of AEO is enabling autonomous negotiation between buyer agents and vendor agents. This requires:

- **Intent declaration format**: Machine-readable RFQ/RFP documents
- **Counteroffer protocol**: Structured negotiation state machines
- **Commitment protocol**: Binding digital signatures for accepted terms
- **Dispute resolution**: Machine-readable SLA terms with automated enforcement

## AEO Readiness Assessment

We evaluate organizations on five dimensions:

| Dimension | Weight | Key Indicators |
| :--- | :---: | :--- |
| Semantic Foundation | 25% | Schema.org coverage, KG depth, entity resolution |
| Authentication | 20% | VC support, DID registration, delegation framework |
| Capability Discovery | 20% | `.well-known/capabilities`, function schemas, MCP |
| Transaction API | 20% | Idempotency, error handling, webhook support |
| Agent Negotiation | 15% | Intent declaration, counteroffer protocol, commitments |

**Composite Score:** `ρ(o) = Σ(w_i · s_i)` where each `s_i ∈ [0, 1]`

**Agent Commerce Ready:** `ρ(o) ≥ 0.80`

## Current Research

- **Cross-platform credential federation**: Verifiable credentials that span multiple agent platforms
- **Dynamic capability negotiation**: Moving from static `.well-known` to runtime protocol negotiation
- **Reputation graphs**: Verifiable, portable agent reputation across platforms
- **Multi-agent coordination protocols**: Orchestrating multiple agents across vendors

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Protocol Development →</a>
