# BIR ESP Accreditation Requirements, Plain-Language Breakdown

Source: `BIR-Updated-TOR-E-Invoicing-Service-Provider-ESP-260904.pdf`
(Draft Revenue Memorandum Circular, 13 pages, undated/number blank)

Legal basis chain: Tax Code Sections 237 (e-invoicing) and 237-A (electronic sales
reporting) -> TRAIN Law -> RR 8-2022 -> RA 12066 (CREATE MORE Act) -> RR 11-2025,
as amended by RR 26-2025. This RMC is the accreditation rulebook for ESPs.

---

## 1. The one-paragraph version

If you want to sell e-invoicing or e-sales-reporting services to more than one
taxpayer in the Philippines, you cannot go live without BIR accreditation plus a
Production Authority. Accreditation is earned through 11 gated stages, not by
submitting paperwork. Once accredited you hold the data in trust: the BIR owns
the tax-administration copy, the taxpayer owns the books, you own nothing. You
must be able to hand over complete machine-readable data fast, you can never
hold data hostage, and your obligations survive contract termination, insolvency,
and revocation.

---

## 2. Who is covered

You are an ESP if you provide any of these to one or more taxpayers:

- E-invoicing solutions (subscription or service model)
- ESR platforms that transmit sales data to the BIR
- Middleware or aggregation for multiple taxpayers
- Integrated POS, CAS, or ERP with electronic transmission
- Storage, preservation, validation, reconciliation, retrieval, or migration of
  invoice or sales data on behalf of taxpayers

You are NOT an ESP if the system is internally developed or acquired and used
exclusively by one taxpayer and its registered branches. That stays under CAS/POS
rules.

Watch the trap: the moment you offer it to an affiliate, subsidiary, related
party, franchisee, customer, or any other separate juridical entity, it becomes
an ESP service unless the BIR expressly exempts it.

---

## 3. Vocabulary that matters

| Term | Meaning |
|---|---|
| **EIS** | Electronic Invoicing and Sales Reporting System, the BIR's own platform |
| **ESRS** | Your system that extracts sales data from e-invoices and transforms it to BIR-prescribed JSON. Can be part of the e-invoicing system or standalone |
| **PTI** | Permit to Issue electronic invoices. Held by the **taxpayer**, not you. Distinct from CAS's PTU or Acknowledgement Certificate |
| **PTT** | Permit to Transmit. Production authorization for a specific approved system, version, interface, environment |
| **Production Authority** | Written BIR authority to run live taxpayer transactions on a specific approved stack |
| **Material Change** | Ownership, control, architecture, core functionality, data model, interface, hosting/cloud, encryption, auth method, critical subcontractor, data location, or anything else affecting security, integrity, interoperability, reliability, or BIR access |
| **Middleware ESP** | Routes or maps data without generating the invoice. Accreditation limited to approved middleware and transmission functions only |

Note the sharp edge: coverage is decided by **taxpayer classification** under the
Tax Code and BIR issuances, not by labels like B2B, B2C, or B2G.

---

## 4. The service models you can register for

**A. Full Package (e-invoicing + ESR)**
- End-to-end compliant structured e-invoice generation and preservation
- Transmit within BIR-prescribed period. If immediate transmission is unavailable,
  queue securely, preserve, reconcile, and retransmit with no loss, alteration,
  corruption, or duplication
- Manage all API integrations, certifications, and pre-production testing on the
  client's behalf, with written authorization per activity
- Unique QR code per invoice containing the e-invoice identifier, prescribed
  transaction details, and validation info
- Assist the client with PTI via the EIS PTI Portal. Client keeps the PTI. You get
  no proprietary interest or control over it
- ESP changes go through a BIR-prescribed migration preserving records,
  authorities, audit trail, and continuity

**B. E-Invoicing Package only**
- Accredited e-invoicing system that generates, preserves, retrieves, and
  reproduces compliant invoices plus audit trails
- Same QR code requirement
- Every invoice and sales adjustment document, printed or electronic, must show
  the "Permit to Issue Electronic Invoice through ESP" number
- Invoice integrity, immutability, sequential traceability, time-synchronized
  audit logging, secure backup, recoverability, storage controls
- Preserve full transaction-level data and give taxpayer and BIR direct access on
  lawful request, even before ESR becomes mandatory for that client

**C. ESR Package via your API**

*C1. Client-Controlled API.* Client buys the API and keeps control of
transmission. You provide an API compatible with BIR EIS technical requirements,
support onboarding, integration, testing, and PTT coordination. The client gets
the certification and transmission authority; you stay responsible for the
security, functionality, conformity, and documented performance of your API.

*C2. ESP-Managed API.* You run transmission end to end. You handle acknowledgment
receipts, retries, exception management, failure reporting. You keep complete logs
of transmissions, acks, rejections, retries, failures, reconciliations, and
corrections, and expose them to taxpayer and BIR. Certification and Production
Authority name the approved API, system version, service model, production
environment, and covered client configurations. Material changes need prior
approval or revalidation.

---

## 5. The 11 accreditation stages

These are mandatory and stage-gated. You cannot skip ahead. Failing one blocks
progress until you fix it and pass a retest.

1. Documentary completeness review
2. Fit-and-proper and financial-capacity review
3. Technical architecture and end-to-end data-flow review
4. Data-privacy and cybersecurity assessment
5. Live product demonstration
6. Sandbox conformance and validation testing
7. Interoperability and end-to-end transmission testing
8. Load, stress, scalability, concurrency, failover, backup, and recovery testing
9. Vulnerability assessment and penetration testing
10. Controlled pilot or user-acceptance testing
11. Production-readiness review

Stated explicitly: documentary compliance alone is not enough. You must pass
testing at volumes reasonably reflecting projected and peak production load.

---

## 6. Application package (19 items)

Submitted through the BIR's electronic accreditation portal:

1. Accomplished Application for ESP Accreditation
2. SEC registration, primary purpose clause, business permits
3. Detailed system description and functional scope
4. End-to-end data flow and transmission architecture
5. Security, encryption, authentication protocols
6. Audit trail, logging, user access controls
7. Business continuity and disaster recovery plans
8. Sample e-invoices, sales data formats, transmission files
9. Sworn certification by CEO and responsible technical/compliance officers,
   including a duty to disclose material change immediately while pending
10. Data-flow and data-lineage diagrams
11. Hosting, cloud, and data-location disclosures
12. Identity, access, encryption, key-management controls
13. Incident-response plan
14. BC/DR plans with **tested** RTO and RPO
15. Subcontractor and critical service-provider register
16. Service-level framework
17. Exit, migration, and data-portability plan
18. Latest VA/pen-test report
19. Evidence of required insurance or financial assurance

Also required: full disclosure of beneficial owners, directors, officers, key
technical personnel, subcontractors, cloud providers, and relevant affiliates.
You must update that disclosure BEFORE engaging or changing any material
subcontractor, hosting provider, cloud provider, affiliate, or foreign processor.

---

## 7. Approval, validity, and who decides

The **ESP Accreditation Board** includes ISG, Operations Group, Client Support
Service, Large Taxpayers Service, Legal Service, Assessment Service, and others
the CIR designates. Members with conflicts must inhibit.

On approval you receive two instruments: a **Certificate of ESP Accreditation**
naming your approved service models, and a **Production Authority** naming the
approved system, version, interfaces, infrastructure, environment, and material
conditions.

Accreditation lasts **5 years**, subject to annual compliance review, continuous
monitoring, maintenance of Production Authority, and immediate revalidation after
a material change or significant incident.

Third-party certifications and assurance reports are supporting evidence only.
They never replace BIR testing, inspection, audit, or independent verification.

---

## 8. Operating obligations once accredited (15 items)

1. Continuous compliance with all accreditation, technical, security, privacy,
   interoperability, performance, continuity, and service requirements
2. Accuracy, completeness, integrity, authenticity, non-duplication, sequencing,
   traceability of all processed or transmitted data
3. Immutable, time-synchronized audit logs accessible to the Bureau
4. Meet BIR-prescribed uptime, processing, acknowledgment, recovery,
   data-retrieval, and support service levels
5. Continuous monitoring, alerts, exception handling, reconciliation, retry, and
   failed-transmission recovery
6. **Report a critical security, integrity, availability, or transmission incident
   to the BIR within 1 hour of discovery, then a written report within 24 hours**
7. Notify and get prior approval before any material change
8. Periodic transaction, performance, incident, security, capacity,
   financial-sustainability, and client-onboarding reports
9. Full cooperation in audits, inspections, tests, investigations, forensic
   examinations, reconciliation
10. Maintain qualified technical, security, compliance, privacy, and
    taxpayer-support personnel
11. Preserve records and provide direct access, detailed extracts, and summary
    reports within prescribed periods
12. Notify affected clients of material service interruptions and run approved
    contingency arrangements
13. Maintain and periodically test BC, DR, backup, failover, incident response
14. Implement BIR-directed exit, migration, remediation, continuity measures
15. Never misrepresent the scope, status, limitations, or validity of your
    accreditation or Production Authority

---

## 9. Data rules (the part that constrains architecture)

**Ownership.** The taxpayer owns its books, records, invoices, and source data.
Data transmitted to the BIR, or stored by you for future transmission or BIR use,
is an official tax-administration record under BIR custody and control. You get no
ownership, lien, IP interest, or proprietary right over it.

**BIR access.** Complete, direct, secure, timely, continuous access to invoice and
sales data, metadata, audit logs, acknowledgments, rejection and error records,
and anything else lawfully required.

**Response clocks.**
- Standard summary reports in BIR-prescribed format: **within 1 working day**
- Complete transaction-level extracts, structured, machine-readable,
  non-proprietary: **within 3 working days**
- Shorter when required for authorized audit, investigation, enforcement,
  cybersecurity incident, or system emergency

**Storage pending BIR readiness.** Keep complete transaction-level data, metadata,
acks, error records, and audit trails until the BIR formally certifies that the
data has been completely and successfully migrated to BIR infrastructure AND
authorizes discontinuance of storage. There is no self-determined retention end
date.

**Continuing obligation.** Expiration, suspension, revocation, contract
termination, insolvency, cessation of business, merger, or change in control does
not extinguish storage, access, preservation, confidentiality, audit-support, or
migration duties.

**No vendor lock-in.** You may not withhold, disable, delete, degrade, or condition
access to data because of contractual dispute, unpaid fees, termination, or change
of provider.

**Portability.** Maintain the capability to export and transfer all relevant data,
metadata, logs, and audit trails to the taxpayer, the BIR, or another accredited
ESP without loss, alteration, duplication, unreasonable delay, or unreasonable
cost.

**Permitted use.** Only for authorized invoicing, reporting, storage, support,
security, reconciliation, and compliance. Never sell, monetize, profile, combine,
disclose, or use for advertising, credit scoring, competitive intelligence, or any
unrelated purpose.

**Subcontractors.** No affiliate, hosting provider, cloud provider, subcontractor,
or foreign processor may touch covered data unless disclosed to and approved by
the BIR and contractually bound to obligations at least equivalent to yours.

---

## 10. Liability and sanctions

You are directly accountable to both the BIR and your client-taxpayers. You bear
losses, damage, penalties, interest, data-restoration costs, and reasonable
remediation for your fraud, willful misconduct, gross negligence, material breach,
unauthorized data access or alteration, system manipulation or falsification,
transmission failure or duplication or corruption, material cybersecurity failure,
failure of storage/backup/audit-trail/portability/continuity/recovery, and acts of
your officers, employees, affiliates, cloud providers, subcontractors, or agents.

Two protections worth noting for your clients: using an ESP does not relieve the
taxpayer of statutory duties, but a taxpayer is **not** administratively penalized
for a transmission failure caused solely by an accredited ESP, provided the
taxpayer exercised reasonable diligence, reported timely, and followed
contingency procedures.

The BIR may require a performance bond, cyber-risk insurance, professional
liability insurance, or other financial assurance scaled to service model, risk
class, transaction volume, and taxpayer exposure.

Contractual limitation of liability, exclusion of responsibility, data-access
restriction, or waiver inconsistent with this Circular is **not recognized** for
BIR accreditation purposes. Standard SaaS contracts need rewriting.

Sanctions available: corrective action, restriction of new client onboarding,
suspension of Production Authority, suspension of accreditation, revocation.
Grounds include misrepresentation, technical/security/privacy/continuity failures,
repeated transmission or SLA failures, unauthorized data access or withholding,
invoice falsification, failure to provide BIR access or cooperation, failure to
maintain financial/staffing/insurance/bond capacity, unauthorized outsourcing or
hosting-location change, insolvency, and any violation of the Circular.

Emergency temporary suspension is allowed where continued operation poses
imminent material risk, with notice and a prompt chance to respond afterwards.
Suspension or revocation does not end data preservation, BIR access, taxpayer
assistance, migration, remediation, audit cooperation, confidentiality, or incident
reporting duties, and you must run a BIR-approved transition plan.

---

## 11. Relationship with CAS and POS rules

ESP accreditation does not replace taxpayer-level CAS, CRM, POS, or other system
registration. An integrated POS, CAS, or ERP must satisfy both the taxpayer-level
registration requirements and the ESP interface and transmission requirements.

A middleware ESP that does not generate invoices is not required to obtain
taxpayer-level POS or invoicing-system accreditation just for being middleware,
but still carries the middleware accreditation, security, transmission, logging,
and audit obligations.

Overlap: compliance with one regime is not an excuse for non-compliance with the
other. Where they conflict, the stricter requirement, or the one the BIR
specifically prescribes for that system or activity, prevails.

---

## 12. What this means if we build it

Hard requirements that shape architecture, in priority order:

1. **Append-only invoice and audit store.** Immutability, time synchronization,
   sequential traceability, non-duplication. Hash chain or WORM storage. You must
   prove no duplication and no reordering.
2. **Outbox pattern with reconciliation.** Never lose a transmission. Queue,
   retry idempotently, reconcile against BIR acknowledgments, log every rejection
   and correction.
3. **Machine-readable export on demand.** One-day summary, three-day full extract,
   non-proprietary format. This is a product feature, not an ops script.
4. **BIR-facing access channel.** Continuous, direct, authenticated read access to
   data, metadata, logs, acks, errors. Separate from your customer UI.
5. **Tenant-level data isolation with taxpayer-held authority.** The client holds
   the PTI. You must be able to hand over or migrate without retaining a copy that
   blocks them.
6. **Sub-processor registry as data.** Disclosure is a live record, not a PDF.
   Changing a cloud region or a critical vendor is a gated workflow with BIR
   notification before the change.
7. **Incident pipeline with a 1-hour clock.** Detection to BIR notification under
   60 minutes, written report under 24 hours. This needs automated detection and
   notification, not a runbook alone.
8. **Config and version registry.** Production Authority names system version,
   interface, environment, and client configurations. A deploy that changes any of
   those is a material change requiring prior approval.
9. **Data portability and exit as first-class.** Export to the taxpayer or another
   accredited ESP without loss or unreasonable cost. The contract cannot make exit
   expensive, and the code must make exit easy.
10. **Tested BC/DR with real RTO and RPO.** "Tested" is explicit in the
    application list, and periodic testing is an ongoing obligation.
11. **Evidence pipeline.** 11 accreditation stages, 19 application items, annual
    review, ongoing reporting. Build the compliance evidence pack as a generated
    artifact, not a scramble.

**Sequencing note.** Stage 9 (VA and pen test) and stage 8 (load, stress,
concurrency, failover) are the expensive gates and they come before the pilot.
Budget for third-party testing before you ask the BIR for a demonstration slot.

---

## 13. Open items

- The RMC has no number and no date in this draft. The TOR itself is Annex "A"
  and is referenced but not included in this file, so the technical and data
  specifications it points to are still unread.
- Specific numeric thresholds (uptime percentage, latency, RTO/RPO targets,
  minimum transaction volumes by service tier) are left to BIR prescription and
  are not fixed in this document.
- The BIR EIS API specification, JSON schema, and QR code technical spec are
  referenced as separately issued and are not in this file.
