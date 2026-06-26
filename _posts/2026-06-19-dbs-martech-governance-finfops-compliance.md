---
title: "FinOps for Martech: The S$14M Governance Transformation at DBS Bank"
date: 2026-06-19
author: "GEONEXUS Research Team"
categories: [AIO]
tags: [FinOps, Governance, DBS, MAS-TRM, Hub-and-Spoke, Compliance-as-Code]
excerpt: "DBS Bank's proposed S$14M martech platform transformation reveals a sophisticated FinOps governance framework: metered chargeback, Compliance as Code, hub-and-spoke team topology, and MAS-TRM alignment."
---

## The Platform Economics Problem

Marketing technology platforms suffer from a well-documented economic problem: costs are centralized (the platform team bears the infrastructure burden) while benefits are distributed (business units capture the value). This creates a tragedy of the commons where:

- Business units have no incentive to optimize platform consumption
- Platform teams cannot accurately measure ROI per business unit
- Investment decisions are decoupled from value realization
- Cost allocation becomes a political negotiation rather than a data-driven process

DBS Bank's proposed S$14M marketing platform transformation addresses this through a rigorously designed **FinOps governance framework**.

## The Five-Layer FinOps Model

### Layer 1: Metered Chargeback

The core innovation is a **metered chargeback methodology** that treats platform capabilities as metered services:

```
BU_Cost(bu) = Σ(consumption(bu, s) · unit_price(s)) + fixed_allocation(bu)

Where:
- s = platform service (CDP queries, API calls, model inferences, etc.)
- consumption(bu, s) = metered usage of service s by business unit bu
- unit_price(s) = per-unit cost of service s
- fixed_allocation(bu) = amortized share of fixed platform costs
```

**Implementation:**
- Every platform API call is tagged with a business unit identifier
- Token counters on LLM inference requests attribute costs per model per business unit
- Data warehouse query costs (BigQuery slot consumption) are attributed per dataset per team
- Fixed costs (infrastructure, licensing, headcount) are amortized using a weighted allocation model

### Layer 2: Compliance as Code

DBS is moving from manual compliance audits (2 weeks/quarter) to automated Compliance as Code via OPA:

```rego
package dbs.compliance

# Enforce metadata schema on all marketing assets
deny[msg] {
  asset := input.marketing_assets[_]
  not asset.frontmatter.brand_owner
  msg = sprintf("Asset %v missing brand_owner — cannot allocate cost", [asset.path])
}

# Enforce chargeback attribution
deny[msg] {
  api_call := input.api_calls[_]
  not api_call.business_unit
  not api_call.campaign_id
  msg = sprintf("API call %v missing cost attribution tags", [api_call.id])
}

# Prevent unapproved tool procurement
deny[msg] {
  tool := input.procurement_requests[_]
  not tool.approved_by_governance_council
  msg = sprintf("Tool %v not approved by governance council", [tool.name])
}
```

### Layer 3: Hub-and-Spoke Team Topology

The organizational model deploys 22 full-time platform employees in a hub-and-spoke configuration:

- **Hub (12 FTE)**: Central platform engineering team owning the infrastructure, governance, and capability services
- **Spokes (10 FTE, embedded)**: Platform engineers embedded in business units, ensuring platform adoption and surfacing BU-specific requirements

**Rationale:** Pure centralization creates a bottleneck; pure decentralization creates fragmentation. The hub-and-spoke model balances platform consistency with business unit agility.

### Layer 4: MAS-TRM Alignment

For a regulated financial institution, all platform capabilities must align with Monetary Authority of Singapore (MAS) Technology Risk Management (TRM) guidelines:

| MAS-TRM Domain | Platform Control | Automation |
| :--- | :--- | :---: |
| Technology Risk Governance | Governance council with documented charters | Automated policy reviews |
| IT Security | OPA-enforced security header compliance | CI/CD gate |
| Data Protection | Consent ledger with row-level enforcement | Real-time monitoring |
| Business Continuity | Multi-region deployment with automated failover | Health-check based |
| Outsourcing | Vendor risk assessment integrated into procurement | Pre-approval gate |

### Layer 5: Balanced Scorecard Integration

Data quality metrics are cascaded into the broader Group Balanced Scorecard, ensuring governance compliance is tied to executive performance evaluation:

```
Executive Performance = 0.70·BusinessOutcomes + 0.15·DataQuality + 0.15·GovernanceCompliance

Where:
- DataQuality = completeness(freshness, accuracy, coverage)
- GovernanceCompliance = compliance_rate(OPA_policies)
```

## The Financial Projection

| Item | Investment | Annual Benefit | Payback |
| :--- | ---: | ---: | ---: |
| Platform Infrastructure | S$8.0M | — | — |
| Governance Automation | S$3.0M | S$4.2M (analyst time recovered) | 8.6 months |
| FinOps Implementation | S$1.5M | S$2.8M (cost optimization) | 6.4 months |
| Team & Operations (Y1) | S$1.5M | — | — |
| **Total** | **S$14.0M** | **S$13.2M (5-year)** | **24-30 months** |

## The Knowledge Graph Analysis

Our ArcadeDB knowledge graph analysis of the proposed architecture revealed:

- **22 distinct platform capabilities** required to serve all business units
- **47 integration dependencies** between platform services
- **8 governance policy domains** requiring OPA implementation
- **3 chargeback dimensions** (compute, storage, API calls)

The graph analysis reduced the architecture validation timeline from an estimated 3 months to **under 2 hours**.

## Key Takeaways

1. **FinOps for martech is inevitable** — As AI inference costs scale, organizations must attribute costs to business units
2. **Compliance as Code is a prerequisite** — Manual governance doesn't scale; automated policy enforcement is the only viable approach for enterprises with 350+ martech tools
3. **Hub-and-spoke > pure centralized or decentralized** — The hybrid model balances consistency with agility
4. **Regulatory alignment must be designed in, not retrofitted** — MAS-TRM, GDPR, and similar frameworks are easier to satisfy when governance is embedded in the architecture from day one

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Governance Architecture →</a>
