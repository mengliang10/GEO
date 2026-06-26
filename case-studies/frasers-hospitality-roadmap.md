---
title: "Frasers Hospitality: Legacy Graph Extraction & Composable Data Plane Migration"
subtitle: "Reverse-engineering 2,400+ undocumented stored procedures, 180+ database views, and 47 inter-system dependencies from a 25-year-old property management system."
sidebar: true
---

## Engagement Overview

**Client:** Frasers Hospitality — Global Hospitality  
**Stack:** FPMS (Legacy 25-year custom PMS), Salesforce MC, D-EDGE, Adyen, Google Cloud/Vertex AI  
**Assessment Focus:** Legacy extraction, composable CDP architecture, API gateway migration  
**Competitive Context:** 24-36 month technology gap behind Ascott Limited

## The Legacy Extraction Problem

Frasers Hospitality's operational backbone is the Fraser Property Management System (FPMS) — a custom-built system deployed ~2001 that manages reservations, inventory, billing, housekeeping, and loyalty accounting across the property portfolio.

The system has:
- **No API layer** — all integration is database-level (direct table access)
- **No documentation** — the developer who built it left in 2012
- **2,400+ stored procedures** — undocumented, with cryptic naming (e.g., `sp_XX_867_calc`, `fn_get_Y_rate`)
- **180+ database views** — many unused, dependencies unknown
- **47 confirmed inter-system dependencies** — feeding data to Salesforce MC, D-EDGE, Adyen, and 6 other downstream systems

## Extraction Methodology

We deployed a two-phase extraction approach to reverse-engineer the FPMS knowledge graph.

### Phase 1: Static Code Analysis

**Tools:** Custom Python parser (sqlparse + ANTLR4 grammar)  
**Scope:** All stored procedures, functions, views, triggers, and scheduled jobs  
**Depth:** Table-level lineage, column-level lineage, execution frequency estimation

**Output:** GraphML representation of:
```
[Table] ←depends_on→ [StoredProcedure] ←calls→ [StoredProcedure]
[View]  ←depends_on→ [Table]
[Job]   ←executes→   [StoredProcedure]
[Downstream] ←reads→ [View]
```

**Scale:** 2,487 procedures, 183 views, 47 downstream dependencies — all connected in a directed acyclic dependency graph.

### Phase 2: Dynamic Runtime Analysis

**Tools:** SQL Server Extended Events + query store  
**Duration:** 14-day capture across production and staging  
**Metrics captured:**
- Execution frequency per procedure (daily, hourly patterns)
- Average/max execution time
- Data volume (rows returned, bytes transferred)
- Error rate and type distribution

**Key findings:**
- 340 of 2,487 procedures (13.7%) never executed in 14 days — candidates for deprecation
- 12 procedures executed >10,000×/day — performance-critical hot paths
- 7 views with sub-second execution on 10M+ row tables — well-optimized
- 23 procedures with >50% error rates — candidates for immediate remediation

## The Dependency Graph

Using the extracted metadata, we built an ArcadeDB knowledge graph mapping the entire FPMS ecosystem:

```cypher
// Find all downstream systems dependent on a given table
MATCH (t:Table {name: 'reservations'})<-[r:READS]-(v:View)
MATCH (v)<-[s:SERVES]-(d:DownstreamSystem)
RETURN t.name, v.name, d.name, d.criticality, d.sla
ORDER BY d.criticality DESC

// Result:
// reservations | vw_active_bookings  | Salesforce MC  | critical
// reservations | vw_rate_inventory   | D-EDGE         | critical  
// reservations | vw_guest_history    | Salesforce MC  | important
// reservations | vw_audit_log        | Internal Audit | compliance
// reservations | vw_revenue_summary  | Finance BI     | important
```

## Migration Architecture

### Phase 1: API Gateway Wrapper (0-6 Months)

Expose FPMS data via a GraphQL gateway without modifying the legacy system:

```
[FPMS Database] → [Change Data Capture (CDC)] → [Event Bus (Kafka)] → 
[GraphQL Gateway] → [BigQuery (Warehouse)] → [Hightouch (Reverse ETL)]
```

**CDC implementation:**
```yaml
sources:
  - name: fpms_reservations
    type: sqlserver_cdc
    table: reservations
    publication: fpms_pub
    capture_instance: dbo_reservations
    output: kafka://topics/fpms.reservations

  - name: fpms_inventory
    type: sqlserver_cdc  
    table: room_inventory
    capture_instance: dbo_room_inventory
    output: kafka://topics/fpms.inventory
```

### Phase 2: Composable CDP (6-12 Months)

Build on BigQuery with Hightouch for activation:

```yaml
stack:
  warehouse: Google BigQuery (serverless, auto-scaling, on-demand pricing)
  transformation: dbt (incremental models with snapshot strategy)
  reverse_etl: Hightouch (syncs to Salesforce MC, Braze, Adyen)
  identity: Custom probabilistic matching on BigQuery
```

**Identity resolution SQL pattern:**
```sql
CREATE OR REPLACE VIEW customer_360 AS
WITH deterministic_match AS (
  SELECT 
    COALESCE(g.email, sf.email, fpms.email) AS primary_email,
    g.id AS google_id,
    sf.id AS salesforce_id,
    fpms.id AS fpms_guest_id,
    -- Deterministic match on email
    ROW_NUMBER() OVER (PARTITION BY COALESCE(g.email, sf.email, fpms.email) ORDER BY fpms.last_visit DESC) AS rn
  FROM raw_google_analytics g
  FULL OUTER JOIN raw_salesforce sf ON g.email = sf.email
  FULL OUTER JOIN raw_fpms fpms ON COALESCE(g.email, sf.email) = fpms.email
)
SELECT * FROM deterministic_match WHERE rn = 1;
```

### Phase 3: Mobile Loyalty App (6-12 Months)

React Native application as zero-party data collection engine:

```
Features:
- Booking and check-in
- Digital key (BLE/NFC)
- Service requests
- Loyalty balance and redemption
- Push notifications for offers and check-in reminders

Data collection:
- Preference center (room type, amenities, communication channels)
- Behavioral signals (browsed properties, search patterns)
- Transaction history (stays, spend, loyalty activity)
```

### Phase 4: Legacy Decommission Planning (12-24 Months)

Phased migration of FPMS functionality to modern stack:

| FPMS Module | Replacement | Migration Strategy | Timeline |
| :--- | :--- | :--- | :---: |
| Reservations | Mews / Oracle Opera | Parallel run → Cutover | 12 months |
| Inventory/Rate | IDeaS / Duetto | API integration → Migration | 18 months |
| Housekeeping | ALICE / Amadeus | Standalone → Integration | 24 months |
| Loyalty | Salesforce Loyalty | Data migration → Activation | 18 months |
| Billing/Finance | Adyen + NetSuite | API integration → Sunset | 24 months |

## Financial Projection

| Item | Investment | Year 1 Benefit | Payback |
| :--- | ---: | ---: | ---: |
| API Gateway Implementation | S$180K | S$420K (operational efficiency) | 5.1 months |
| Composable CDP | S$250K | S$890K (personalization lift) | 3.4 months |
| Mobile App (Phase 1) | S$350K | S$1.2M (direct bookings) | 3.5 months |
| Legacy Migration (Phase 1) | S$500K | S$600K (maintenance savings) | 10 months |

## AEO Readiness Trajectory

| Dimension | Current | 12-Month Target | 24-Month Target |
| :--- | :---: | :---: | :---: |
| Semantic Layer | 2/10 | 5/10 | 8/10 |
| Authentication | 3/10 | 5/10 | 7/10 |
| Capability Discovery | 1/10 | 4/10 | 7/10 |
| Transaction API | 2/10 | 6/10 | 8/10 |
| Agent Negotiation | 1/10 | 2/10 | 5/10 |
| **Composite** | **1.8/10** | **4.4/10** | **7.0/10** |

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Migration Assessment →</a>
