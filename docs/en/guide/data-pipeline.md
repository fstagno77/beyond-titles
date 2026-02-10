# Data Pipeline

## Overview

This page documents the data transformation process from the source Excel file to the JSON files used by the application, including normalisation rules, the inheritance system and known discrepancies.

## Data Source

**File:** `mansioni-softskills-dude-20251230.xlsx`

The Excel file contains two main sheets:

### "Struttura" (Structure) Sheet

| Column | Content |
|---|---|
| **Value** | Role name |
| **Relation** | Relationship type (`JobTitles` or `SoftSkills`) |
| **Relation Value** | Generic job title or soft skill name |

**Total records:** 2,823

The values in the **Relation** column determine the meaning of each row:

- `Relation = "JobTitles"` — The role in `Value` is linked to the generic job title in `Relation Value`
- `Relation = "SoftSkills"` — The role in `Value` possesses the competency specified in `Relation Value`

### "Offerte su sito" (Site Offers) Sheet

Contains **445 roles** with active job postings and their respective offer counts.

## The Two Counts Problem

### Discrepancy 469 vs 379

The database contains two different role counts with soft skills, **both correct** but referring to different definitions.

#### Method A: Complete count (469)

Extracts all unique roles from the database considering **both** the `Value` column **and** the `Relation Value` column for records with `Relation = "JobTitles"`. After normalisation and duplicate removal: **469 roles**.

This count represents the **complete universe** of job titles in the database, including both generic titles (e.g. "Warehouse Worker") and specific roles (e.g. "Warehouse attendant - order management and goods dispatch").

#### Method B: K8 count (379)

Counts only roles that have soft skills **directly** associated in the database — those appearing as `Value` when `Relation = "SoftSkills"`. **Excludes** generic job titles that exist only as `Relation Value` and inherit soft skills from linked roles.

#### Summary

| Method | Result | What it includes |
|---|:---:|---|
| Complete (JobTitles) | **469** | Value + Relation Value for JobTitles |
| K8 (SoftSkills) | **379** | Only Value with Relation = SoftSkills |
| **Difference** | **90** | Generic job titles without direct soft skills |

::: info
The discrepancy is **methodological, not an error**. The K8 model correctly uses 379 because it refers to roles with directly mapped soft skills — those actually usable for calculating affinity with archetypes.
:::

## Inheritance System

### Problem

Generic job titles like "Warehouse Worker", "Forklift Operator" or "Pallet Truck Driver" do not have directly mapped soft skills in the database. A user searching for these terms would not find associated competencies.

### Solution

The inheritance system (introduced in v2.0 of the K8 model) solves the problem: each generic role **inherits soft skills** from the specific roles linked via the `JobTitles` relationship.

### Example: Warehouse Worker

"Warehouse Worker" exists in the database **only as a `Relation Value`** (generic job title). It has no soft skills of its own.

Its soft skills are inherited from 4 specific roles:

| Specific role | Soft Skills |
|---|---|
| Warehouse attendant - order management and goods dispatch | Initiative, Planning & Organisation, Thoroughness |
| Warehouse attendant - goods reception | Planning & Organisation, Emotional Stability |
| Loading/unloading attendant | Planning & Organisation, Emotional Stability |
| Warehouse administrative clerk | Planning & Organisation, Problem Solving, Thoroughness, Collaboration & Teamwork |

In the POC, a user searching for "Warehouse Worker" sees the aggregated soft skills from all linked roles.

### Impact

| Metric | Before (v1.1) | After (v2.0) | Delta |
|---|:---:|:---:|:---:|
| Roles with mapped soft skills | 379 | **453** | +74 |
| Associated job offers | 2,460 | **2,671** | +211 |
| Validation accuracy | — | **100%** | — |

## Normalisation

### Role Names

The names in the Excel file are in UPPERCASE. Normalisation converts them to **Title Case** for readability:

```
Excel:    "TECNICO COMMERCIALE"
JSON:     "Tecnico commerciale"
```

Multiple spaces are reduced to a single space.

### Soft Skill Names

Uniform formatting applied. The original file contains **35 unique soft skills** — the same number is maintained after normalisation.

```
Excel:    "COORDINAMENTO OPERATIVO/CONTROLLO"
JSON:     "Coordinamento operativo / Controllo"
```

::: details Known anomaly
One soft skill in the original file is written in lowercase: `"fiducia in sé/consapevolezza"`. It is associated with only 2 roles: "Installatore e collaudatore - impianti" and "Installatore e collaudatore - macchinari industriali". Maintained in the JSON as in the original.
:::

### Impact on Counts

Normalisation **does not alter** the role counts — they remain **379** in both the original Excel and the JSONs.

## JSON Structure

### mansioni_database.json

**604 total records**, divided into 3 categories:

| Category | Count | Description |
|---|:---:|---|
| `categoria_principale` | 445 | Roles in the "Offers" sheet with active postings |
| `profilo_incompleto` | 134 | Roles in "Structure" but not in "Offers" (no active postings) |
| `alias` | 25 | Generic job titles that point to other roles |

For each role, the JSON contains:

```json
{
  "nome": "Tecnico Commerciale",
  "id": "tecnico-commerciale",
  "numero_offerte": 59,
  "url": "https://www.gigroup.it/offerte-lavoro/tecnico-commerciale/",
  "soft_skills": ["Comunicazione", "Ascolto", "Analisi", "..."],
  "mapping_type": "categoria_principale",
  "has_custom_skills": true
}
```

### survey_archetypes.json

Defines the 8 archetypes of the K8 model with their respective indicative soft skills that determine affinity with roles (see [K8 Model](./k8-model)).

## Known Discrepancies

### K8 vs Excel Offer Count

The offer figures in the K8 document do not exactly match the current Excel file:

| Metric | K8 | Excel | Match |
|---|:---:|:---:|:---:|
| Total records | 604 | 604 | ✓ |
| Roles with soft skills | 379 | 379 | ✓ |
| Roles without soft skills | 225 | 225 | ✓ |
| Offers (roles with SS) | 2,460 | 2,235 | ✗ |
| Offers (roles without SS) | 912 | 957 | ✗ |
| Total offers | 3,372 | 3,192 | ✗ |

::: warning
The offer numbers in the K8 were probably calculated on a previous version of the database or with different criteria. It is recommended to update the K8 with the current Excel values.
:::

## Current Data Scope

| Metric | Value |
|---|:---:|
| Total database records | **604** |
| Roles with mapped soft skills | **453** (with inheritance) |
| Active job offers | **2,671** |
| Roles without soft skills | **151** |
| Unique soft skills | **35** |
| Professional areas | **22** |
