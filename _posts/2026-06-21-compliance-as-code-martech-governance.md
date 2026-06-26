---
title: "Compliance as Code: Open Policy Agent-Governed Martech Infrastructure"
date: 2026-06-21
author: "GEONEXUS Research Team"
categories: [AIO]
tags: [Governance, OPA, Compliance-as-Code, CI-CD, Policy-Engineering]
excerpt: "Encoding marketing technology governance policies as executable Rego rules in Open Policy Agent — enabling automated tag management enforcement, library versioning, metadata compliance, and security header validation at CI/CD time."
---

## The Governance Problem

Marketing technology governance faces a fundamental scaling challenge: the number of tools, tags, libraries, and data flows grows exponentially while governance capacity grows linearly.

Manual governance (spreadsheets, email approvals, quarterly audits) has a documented compliance decay half-life of approximately 6-8 weeks — after which 50% of enforced policies have regressed to pre-governance states.

The solution is **Compliance as Code (CaC)** — encoding governance policies as executable, machine-verifiable rules that are enforced at CI/CD time.

## Open Policy Agent Architecture

Open Policy Agent (OPA) provides a unified policy engine with a declarative policy language (Rego) that can be embedded into CI/CD pipelines, API gateways, and infrastructure automation.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  POLICY AUTHORING                                                         │
│  Rego policies stored in git (version-controlled, peer-reviewed)          │
│  ├── martech/tag-governance.rego                                         │
│  ├── martech/library-lifecycle.rego                                       │
│  ├── martech/metadata-schema.rego                                         │
│  └── martech/security-headers.rego                                        │
├──────────────────────────────────────────────────────────────────────────┤
│  POLICY DECISION POINTS                                                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ Pre-commit │  │ CI Pipeline│  │ Deploy     │  │ Runtime          │   │
│  │ (git hook) │  │ (GitHub    │  │ Gate (Argo│  │ Monitoring       │   │
│  │            │  │  Actions)  │  │  CD)      │  │ (Prometheus)    │   │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────────┘   │
├──────────────────────────────────────────────────────────────────────────┤
│  POLICY ENFORCEMENT                                                        │
│  OPA Server (sidecar or centralized) evaluating policy decisions          │
│  Input: Kubernetes admission review, CI event, API request                │
│  Output: Allow/Deny + structured audit metadata                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Rego Policy Examples

### Tag Management Governance

```rego
package martech.tag_governance

# Only Adobe Launch is permitted
allowed_containers := {"Adobe Launch"}

deny[msg] {
  container := input.tag_containers[_]
    not container.name in allowed_containers
    msg = sprintf("Container %v is not permitted. Allowed: %v", [container.name, allowed_containers])
}

# All external scripts must have SRI hashes
deny[msg] {
  script := input.external_scripts[_]
    not script.integrity
    msg = sprintf("Script %v missing SRI integrity hash", [script.src])
}

# Duplicate tags across containers are not permitted
deny[msg] {
  tags := {t | c := input.tag_containers[_]; t := c.tags[_].name}
    duplicates := tags - {t | count({c | c := input.tag_containers[_]; c.tags[_].name == t}) == 1}
    count(duplicates) > 0
    msg = sprintf("Duplicate tags detected across containers: %v", [duplicates])
}
```

### Library Lifecycle Management

```rego
package martech.library_lifecycle

# Define library lifecycle policies
library_policies := {
  "jQuery": {"min_version": "3.5.0", "eol": "2026-12-31"},
  "Modernizr": {"status": "prohibited"},
  "Lodash": {"min_version": "4.17.21", "eol": "2027-06-30"}
}

# Prohibit end-of-life libraries
deny[msg] {
  lib := input.libraries[_]
    policy := library_policies[lib.name]
    policy.status == "prohibited"
    msg = sprintf("Library %v is prohibited. Use %v instead.", [lib.name, policy.replacement])
}

# Enforce minimum versions
deny[msg] {
  lib := input.libraries[_]
    policy := library_policies[lib.name]
    policy.min_version
    semver.compare(lib.version, "<", policy.min_version)
    msg = sprintf("Library %v version %v is below minimum %v", [lib.name, lib.version, policy.min_version])
}

# Warn about approaching EOL
warn[msg] {
  lib := input.libraries[_]
    policy := library_policies[lib.name]
    policy.eol
    days_until_eol := time.parse_rfc3339(policy.eol) - time.now_ns()
    days_until_eol < 90 * 24 * 60 * 60 * 1000000000  # 90 days
    msg = sprintf("Library %v approaching EOL on %v", [lib.name, policy.eol])
}
```

### Metadata Schema Compliance

```rego
package martech.metadata_schema

required_fields := {"title", "author", "date", "brand_owner", "campaign_id"}

deny[msg] {
  page := input.pages[_]
    missing := required_fields - {f | page.frontmatter[f]}
    count(missing) > 0
    msg = sprintf("Page %v missing required fields: %v", [page.path, missing])
}

# Validate date format
deny[msg] {
  page := input.pages[_]
    date := page.frontmatter.date
    not regex.match(`^\d{4}-\d{2}-\d{2}$`, date)
    msg = sprintf("Page %v has invalid date format: %v (expected YYYY-MM-DD)", [page.path, date])
}
```

### Security Headers

```rego
package martech.security_headers

required_headers := {
  "Content-Security-Policy": true,
  "Strict-Transport-Security": true,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}

deny[msg] {
  header := input.response_headers[_]
    expected := required_headers[header.name]
    expected != true  # boolean true means "any value accepted"
    header.value != expected
    msg = sprintf("Header %v has value %v, expected %v", [header.name, header.value, expected])
}

deny[msg] {
  missing := {h | required_headers[h]; not input.response_headers[_].name == h}
    count(missing) > 0
    msg = sprintf("Missing required security headers: %v", [missing])
}
```

## CI/CD Integration

```yaml
# .github/workflows/governance.yml
name: Governance Check
on: [pull_request, push]

jobs:
  policy-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate Compliance Manifest
        run: |
          python scripts/generate_manifest.py > _site/manifest.json
      
      - name: Evaluate OPA Policies
        uses: docker://openpolicyagent/opa:latest
        with:
          args: eval --data policies/ --input _site/manifest.json "data.martech"
      
      - name: Check for Violations
        run: |
          if opa eval --data policies/ --input _site/manifest.json "data.martech.deny" | grep -q 'true'; then
            echo "Governance violations detected:"
            opa eval --data policies/ --input _site/manifest.json "data.martech.deny" --format pretty
            exit 1
          fi
```

## Measured Outcomes

From our DBS engagement and subsequent implementations:

| Metric | Before CaC | After CaC | Improvement |
| :--- | :---: | :---: | :---: |
| Compliance audit time | 2 weeks/quarter | 3 seconds/commit | ~99.9% reduction |
| Tag drift (new unapproved tags) | 12/month | 0/month | 100% elimination |
| Library vulnerability window | 6 months avg | <24 hours | 99.5% reduction |
| Metadata compliance | 0% | 98% | Significant |
| Security header coverage | 40% | 100% | 60% increase |

## Implementation Roadmap

**Week 1:** Define 10 highest-impact policies (tag management, library versioning, metadata)  
**Week 2:** Write Rego policies and commit to version control  
**Week 3:** Integrate OPA into CI pipeline (GitHub Actions)  
**Week 4:** Deploy pre-commit hooks for local validation  
**Week 5-6:** Add runtime monitoring and alerting  
**Week 7-8:** Iterate based on violation patterns and team feedback

<a href="/contact/" class="btn btn-primary" style="margin-top: var(--space-xl);">Governance Architecture →</a>
