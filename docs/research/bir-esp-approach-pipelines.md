# BIR ESP: Approach and Pipelines

Companion to `bir-esp-tor-requirements.md`. Source: draft RMC on ESP accreditation.

---

## 0. The mental model

There are **two clocks** running and they are not the same clock.

**Clock 1, the accreditation clock.** You are a vendor trying to earn the right
to operate. 11 gated stages, 19 application items, then 5 years of standing
obligations. This is a project with a start and an end.

**Clock 2, the runtime clock.** Once live, you are a regulated utility moving
taxpayer money-data. Every invoice, every transmission, every incident runs on
BIR-mandated timers that never stop.

Most teams conflate these. They build for clock 1 (pass the demo), then discover
clock 2 is the actual business. Design for clock 2; treat clock 1 as evidence
collection over the system you already built.

---

## 1. Top-level map

```mermaid
graph TB
    subgraph P0["PHASE 0 - Decide"]
        D1[Pick service model] --> D2[JV or solo?]
        D2 --> D3[Gap assessment vs 11 stages]
    end

    subgraph P1["PHASE 1 - Build the spine"]
        B1[Immutable invoice store] --> B2[Transmission pipeline]
        B2 --> B3[BIR access channel]
        B3 --> B4[Tenant + auth model]
    end

    subgraph P2["PHASE 2 - Build the evidence"]
        E1[Compliance evidence pack]
        E2[BC/DR with tested RTO/RPO]
        E3[VA + pen test]
    end

    subgraph P3["PHASE 3 - Accreditation"]
        A1[11 gated stages]
        A2[Certificate + Production Authority]
    end

    subgraph P4["PHASE 4 - Operate"]
        O1[Runtime pipelines]
        O2[Annual review + incident response]
        O3[Material change control]
    end

    P0 --> P1 --> P2 --> P3 --> P4
    P4 -.->|material change| P3

    style P1 fill:#e8f4e8
    style P4 fill:#f4e8e8
```

**Read it as:** Phase 1 is the only phase where you write product code. Phase 2
generates artifacts *from* that code. Phase 3 proves it. Phase 4 is the actual
business, and it can send you back to Phase 3 at any time.

---

## 2. Phase 0: the decision tree

Get this wrong and you rebuild later.

```mermaid
flowchart TD
    START([We want to serve taxpayers]) --> Q1{Do we generate<br/>the invoice?}

    Q1 -->|Yes| Q2{Transmit sales<br/>data too?}
    Q1 -->|No, route only| MW[Middleware ESP<br/>limited accreditation]

    Q2 -->|Yes| FULL[Full Package<br/>e-Invoicing + ESR]
    Q2 -->|No| EINV[E-Invoicing Package only]

    Q2 -.->|client has own<br/>invoicing system| Q3{Who controls<br/>transmission?}

    Q3 -->|Client buys API,<br/>keeps control| C1[ESR Package:<br/>Client-Controlled API]
    Q3 -->|We run it| C2[ESR Package:<br/>ESP-Managed API]

    FULL --> LEGAL{Entity structure?}
    EINV --> LEGAL
    C1 --> LEGAL
    C2 --> LEGAL
    MW --> LEGAL

    LEGAL -->|Single corp| SOLO[One applicant,<br/>full liability]
    LEGAL -->|JV / consortium| JV[Lead member applies,<br/>ALL members jointly<br/>and severally liable]

    SOLO --> SCOPE[Scope is set by TAXPAYER<br/>CLASSIFICATION<br/>not B2B/B2C/B2G labels]
    JV --> SCOPE

    SCOPE --> TRAP{Offering to affiliate,<br/>subsidiary, franchisee,<br/>or related party?}
    TRAP -->|Yes| ESP[It IS an ESP service<br/>unless BIR exempts]
    TRAP -->|No, one taxpayer<br/>and its branches| CAS[Stays under CAS/POS rules<br/>NOT an ESP]

    style FULL fill:#d4e8f4
    style MW fill:#f4e8d4
    style JV fill:#f4d4d4
```

**The trap to avoid:** an internal system you built for one client is not an ESP
service. The moment you sell it to that client's *sister company*, it is.

---

## 3. Phase 1: the core system

Four building blocks. Everything else is a view over these.

```mermaid
graph LR
    subgraph SPINE["The spine (build these four)"]
        direction TB
        S1["1. IMMUTABLE STORE<br/>append-only, hash-chained<br/>time-synchronized<br/>no dup, no reorder"]
        S2["2. TRANSMISSION<br/>outbox + idempotent retry<br/>ack tracking<br/>reconciliation"]
        S3["3. BIR ACCESS CHANNEL<br/>direct authenticated read<br/>separate from customer UI"]
        S4["4. TENANT + AUTH<br/>isolation, taxpayer holds PTI<br/>we hold no proprietary right"]
    end

    S1 --> S2
    S2 --> S3
    S4 --> S1

    style SPINE fill:#e8f4e8
```

### 3a. The runtime data pipelines

This is the actual money path. Every arrow is a failure point.

```mermaid
flowchart TD
    subgraph ISSUE["PIPELINE 1 - Invoice issuance"]
        V1[Validate against<br/>BIR data spec] --> V2[Assign invoice ID<br/>+ sequence]
        V2 --> V3[Persist to<br/>immutable store]
        V3 --> V4[Generate QR code<br/>ID + txn details<br/>+ validation info]
        V4 --> V5[Render / issue<br/>to buyer]
        V5 --> V6[Stamp PTI number<br/>on document]
    end

    subgraph TX["PIPELINE 2 - Sales data transmission"]
        T1[Extract from e-invoices] --> T2[Transform to<br/>BIR-prescribed JSON]
        T2 --> T3{Immediate<br/>transmission<br/>available?}
        T3 -->|No| T4[Secure queue]
        T4 --> T5[Preserve with<br/>no loss/alteration]
        T5 --> T6[Reconcile]
        T6 --> T3
        T3 -->|Yes| T7[Transmit to BIR EIS]
        T7 --> T8[Ack receipt]
        T8 --> T9{Accepted?}
        T9 -->|No| T10[Log rejection<br/>+ error record]
        T10 --> T11[Retry idempotently]
        T11 --> T7
        T9 -->|Yes| T12[Mark reconciled]
    end

    subgraph EXP["PIPELINE 3 - BIR access and export"]
        X1{Request type}
        X1 -->|Summary| X2["Within 1 working day<br/>BIR-prescribed format"]
        X1 -->|Full extract| X3["Within 3 working days<br/>structured, machine-readable,<br/>NON-PROPRIETARY"]
        X1 -->|Urgent: audit,<br/>investigation,<br/>incident| X4[Shorter clock<br/>expedited path]
        X1 -->|Continuous| X5[Direct authenticated<br/>read access to data,<br/>metadata, logs, acks, errors]
    end

    subgraph INC["PIPELINE 4 - Incident response"]
        I1[Detect] --> I2{Clock starts}
        I2 -->|1 hour| I3[Notify BIR]
        I3 -->|24 hours| I4[Written incident report]
        I4 --> I5[Remediate + preserve]
        I5 --> I6[Post-incident<br/>revalidation if material]
    end

    V3 --> T1
    T12 --> X5

    style ISSUE fill:#d4e8f4
    style TX fill:#d4f4e8
    style EXP fill:#f4e8d4
    style INC fill:#f4d4d4
```

**Why the outbox matters:** subgraph TX exists because "where immediate
transmission is unavailable, the system shall securely queue, preserve,
reconcile, and retransmit the data without loss, alteration, corruption, or
duplication." The words *without duplication* are why retries must be
idempotent. An at-least-once queue without a dedupe key fails accreditation.

### 3b. The one-way doors

These are architectural decisions that are expensive to reverse. Decide them
before writing code, not during the pen test.

```mermaid
graph TD
    OWD1["Append-only storage<br/><i>Retrofitting immutability onto<br/>mutable tables = rewrite</i>"]
    OWD2["Tenant isolation boundary<br/><i>Taxpayer must be able to leave<br/>with their data intact</i>"]
    OWD3["No proprietary export format<br/><i>Non-proprietary is a hard<br/>requirement, not a preference</i>"]
    OWD4["Subprocessor registry as DATA<br/><i>Changing a cloud region becomes<br/>a gated workflow</i>"]
    OWD5["Version/config registry<br/><i>Production Authority names<br/>version + interface + env</i>"]
    OWD6["BIR access as separate channel<br/><i>Not 'give them an admin login'</i>"]

    style OWD1 fill:#f4d4d4
    style OWD2 fill:#f4d4d4
    style OWD3 fill:#f4d4d4
    style OWD4 fill:#f4d4d4
    style OWD5 fill:#f4d4d4
    style OWD6 fill:#f4d4d4
```

---

## 4. Phase 2: the evidence pipelines

You do not write these documents. You generate them from the system.

```mermaid
flowchart LR
    subgraph CODE["System facts"]
        C1[Architecture]
        C2[Data flows]
        C3[Access controls]
        C4[Audit logs]
        C5[Test results]
    end

    subgraph GEN["Generated evidence"]
        G1[System overview<br/>+ architecture design]
        G2[Data-flow and<br/>data-lineage diagrams]
        G3[IAM, encryption,<br/>key-management controls]
        G4[Audit trail +<br/>access-control evidence]
        G5[Evidence pack<br/>for 11 stages]
    end

    C1 --> G1
    C2 --> G2
    C3 --> G3
    C4 --> G4
    C5 --> G5

    style CODE fill:#e8f4e8
    style GEN fill:#f4f4e8
```

### The 19 application items, grouped by how you produce them

| Group | Items | How produced |
|---|---|---|
| **Corporate** | SEC reg, primary purpose, permits, sworn CEO certification, beneficial-owner disclosure, insurance/bond | Legal + finance, manual |
| **Architecture** | System description, data flow, data lineage, hosting/cloud/data-location, API docs, third-party dependencies | **From code + infra** |
| **Security** | Encryption/auth protocols, IAM + key management, VA/pen-test report, incident-response plan | **From code + pen test** |
| **Continuity** | BC/DR plans with **tested** RTO/RPO, backup/recovery architecture | **From tested drills** |
| **Governance** | Subcontractor register, SLA framework, exit/migration/portability plan, sample invoices + formats | **From system + contract** |

Note the bolded ones. Six of the eleven system-overview sub-items are things you
should be able to regenerate from your own repo and infra config. If you're
writing them by hand in Word, you'll be re-writing them at every material change
for the next five years.

---

## 5. Phase 3: the accreditation pipeline

```mermaid
flowchart TD
    START([Application submitted<br/>via BIR portal]) --> S1

    S1["1. Documentary<br/>completeness review"] --> G1{Pass?}
    G1 -->|No| FIX1[Correct + resubmit]
    FIX1 --> S1
    G1 -->|Yes| S2

    S2["2. Fit-and-proper +<br/>financial-capacity review"] --> G2{Pass?}
    G2 -->|No| FAIL[BLOCKED<br/>cannot advance<br/>until corrected<br/>and retested]
    G2 -->|Yes| S3

    S3["3. Technical architecture +<br/>end-to-end data-flow review"] --> G3{Pass?}
    G3 -->|No| FAIL
    G3 -->|Yes| S4

    S4["4. Data-privacy +<br/>cybersecurity assessment"] --> G4{Pass?}
    G4 -->|No| FAIL
    G4 -->|Yes| S5

    S5["5. Live product<br/>demonstration"] --> G5{Pass?}
    G5 -->|No| FAIL
    G5 -->|Yes| S6

    S6["6. Sandbox conformance<br/>+ validation testing"] --> G6{Pass?}
    G6 -->|No| FAIL
    G6 -->|Yes| S7

    S7["7. Interoperability +<br/>end-to-end transmission testing"] --> G7{Pass?}
    G7 -->|No| FAIL
    G7 -->|Yes| S8

    S8["8. Load, stress, scalability,<br/>concurrency, failover,<br/>backup, recovery testing<br/><b>AT PEAK PROJECTED VOLUME</b>"] --> G8{Pass?}
    G8 -->|No| FAIL
    G8 -->|Yes| S9

    S9["9. Vulnerability assessment<br/>+ penetration testing"] --> G9{Pass?}
    G9 -->|No| FAIL
    G9 -->|Yes| S10

    S10["10. Controlled pilot /<br/>user-acceptance testing"] --> G10{Pass?}
    G10 -->|No| FAIL
    G10 -->|Yes| S11

    S11["11. Production-readiness<br/>review"] --> APPROVED

    APPROVED([Certificate of ESP Accreditation<br/>+ Production Authority<br/><b>Valid 5 years</b>])

    FAIL -.->|fix + retest| S1

    style S8 fill:#f4d4d4
    style S9 fill:#f4d4d4
    style APPROVED fill:#d4f4d4
    style FAIL fill:#f4d4d4
```

**Budget note:** stages 8 and 9 are the expensive third-party gates, and they
land *before* the pilot. Book your load-test and pen-test vendors early. Both
are recurring costs: annual review plus revalidation after any material change.

**Third-party certs are supporting evidence only.** A SOC 2 report never
replaces BIR testing.

---

## 6. Phase 4: the operating loops

Accreditation is not the finish line. Four loops run forever.

```mermaid
graph TB
    subgraph L1["LOOP A - Continuous compliance"]
        LA1[Monitor] --> LA2[Collect metrics]
        LA2 --> LA3[Periodic reports to BIR:<br/>transaction, performance,<br/>incident, security, capacity,<br/>financial, client-onboarding]
        LA3 --> LA1
    end

    subgraph L2["LOOP B - Material change control"]
        LB1[Proposed change] --> LB2{Material?<br/>ownership, control, arch,<br/>core function, data model,<br/>interface, hosting, encryption,<br/>auth, subcontractor,<br/>data location}
        LB2 -->|No| LB3[Deploy normally]
        LB2 -->|Yes| LB4[Notify BIR +<br/>prior approval]
        LB4 --> LB5[Revalidation]
        LB5 --> LB1
    end

    subgraph L3["LOOP C - Annual review"]
        LC1[Year N review] --> LC2{Pass?}
        LC2 -->|Yes| LC3[Continue]
        LC2 -->|No| LC4[Corrective action<br/>restrict onboarding<br/>suspend / revoke]
    end

    subgraph L4["LOOP D - Continuity"]
        LD1[BC/DR plans] --> LD2[Periodically TEST them]
        LD2 --> LD3[Prove RTO + RPO]
        LD3 --> LD1
        LD4[Client interruption] --> LD5[Notify affected<br/>client-taxpayers]
        LD5 --> LD6[Run approved<br/>contingency]
    end

    style L2 fill:#f4e8d4
    style L4 fill:#e8e8f4
```

**Loop B is the one teams forget.** Your normal CI/CD deploy pipeline can trip
it. If a release changes the interface, the encryption method, or the hosting
region, you need BIR approval *before* shipping. Put a gate in the pipeline, not
in someone's memory.

---

## 7. What survives death (and why it changes the design)

```mermaid
graph LR
    EVENTS["Termination<br/>Suspension<br/>Revocation<br/>Insolvency<br/>Cessation<br/>Merger<br/>Change of control"]
    SURVIVES["SURVIVES ALL OF IT:<br/>- Storage<br/>- BIR access<br/>- Preservation<br/>- Confidentiality<br/>- Audit support<br/>- Migration"]

    EVENTS --> SURVIVES

    SURVIVES --> IMPL["Implication:<br/>You cannot design a<br/>'wind down and delete' path.<br/>The data outlives the company."]

    style EVENTS fill:#f4d4d4
    style SURVIVES fill:#d4f4d4
```

Compounding on that: **storage continues until the BIR formally certifies
migration is complete AND authorizes discontinuance.** There is no
self-determined retention end date. Your retention policy cannot be a config
value you set.

And: you may not withhold, disable, degrade, or condition access because of
unpaid fees or a contract dispute. The obvious implication is that a
non-paying tenant does not get cut off from their own data.

---

## 8. Suggested build order

```mermaid
gantt
    title Sequencing (relative, not calendar-fixed)
    dateFormat X
    axisFormat %s

    section Phase 0
    Model + entity decision           :p0, 0, 2

    section Phase 1 (product)
    Immutable store + schema          :p1a, 2, 6
    Transmission + outbox + retry     :p1b, after p1a, 6
    BIR access channel + export       :p1c, after p1b, 5
    Tenant isolation + auth           :p1d, 2, 5

    section Phase 2 (evidence)
    Arch + lineage docs (generated)   :p2a, after p1c, 3
    BC/DR build + drill               :p2b, after p1c, 4
    VA + pen test vendor              :p2c, after p2a, 4

    section Phase 3
    Portal application                :p3a, after p2c, 2
    Stages 1-7                        :p3b, after p3a, 6
    Stages 8-9 (peak load + pen)      :p3c, after p3b, 4
    Stages 10-11 (pilot + readiness)  :p3d, after p3c, 4
```

The critical insight: **the evidence phase is not a documentation phase.** BC/DR
drills and pen tests take real wall-clock time and can force code changes. Start
the vendors during Phase 1, not after Phase 1 ends.

---

## 9. Ten requirements that become code

Filtered from the requirements doc down to things that show up in a repo.

| # | Requirement | Shows up as |
|---|---|---|
| 1 | Immutable, time-synchronized, sequential, non-duplicated | Append-only table + hash chain + monotonic sequence per tenant |
| 2 | Queue, preserve, reconcile, retransmit without duplication | Outbox table + idempotency key + ack reconciliation job |
| 3 | QR code per invoice with ID + txn details + validation | QR generation service, spec-driven, versioned |
| 4 | Summary 1 day / extract 3 days, non-proprietary | Export service + scheduler + object storage handoff |
| 5 | Continuous direct BIR access to data, logs, acks, errors | Read-only BIR-scoped API, separate from tenant UI |
| 6 | Client holds PTI, we hold no proprietary right | Authority records owned by tenant, transferable |
| 7 | Subprocessor disclosure before change | Registry table + approval workflow + change gate |
| 8 | 1-hour incident notification | Detection + alerting + notification service with timers |
| 9 | Production Authority names version/interface/env | Release registry + deploy gate checking against approved tuple |
| 10 | Export/migrate to another ESP without unreasonable cost | Full-fidelity export format + documented import path |

Each of these is a schema decision, not a feature ticket. Fix them at the
schema level and the features fall out.

---

## 10. Open questions before committing

1. **TOR Annex "A"** is referenced but not in the source PDF. It likely contains
   the actual technical and data specifications. Get it before finalizing schema.
2. **BIR EIS API spec, JSON schema, QR technical spec** are all "separately
   issued" and unread. These define Pipeline 2 precisely.
3. **Numeric thresholds** (uptime %, latency, RTO/RPO targets, minimum volumes by
   tier) are left to BIR prescription and are not in this document. Stages 8 and
   9 cannot be scoped without them.
4. **RMC number and effectivity** are blank in this draft. Effectivity is stated
   as immediate once issued.
5. **Which service model** you're targeting. The build differs substantially
   between Middleware ESP (thin) and Full Package (everything).
