# Dagi Management Proposal (Updated)

**Criminal Database | Crime Prevention & Detection Wing | Ramgarh Police**

**Status:** Confirmed direction from stakeholder update — ready for development after final OK.

---

## Confirmed approach (simple)

**Dagi is not a separate module.** It is a **second type** of the same person record.

| Rule | Detail |
|---|---|
| Default | When adding someone → type = **Criminal** |
| Extra field | One field: **Record type** = `Criminal` or `Dagi` |
| Same form | **All other fields stay the same** (profile, address, history, photos, associates, verification, etc.) |
| Same workflows | Search, list, detail, verify, transfer, IO, PDF, CSV — all as today |
| ID difference | **Criminal** → has **PID number**; **Dagi** → has **Dagi number** |
| Filter | Filter / toggle by type: Criminal / Dagi / All |

---

## What changes in the system

### 1. Data (same `criminals` collection)

Add one field, e.g.:

- `recordType`: `"criminal"` | `"dagi"`  
  - Default on create: `"criminal"`

ID handling:

| Type | ID field | Example |
|---|---|---|
| Criminal | `pid` (existing) | as today |
| Dagi | `dagiNumber` (new) | e.g. `DGI-0001` or as they specify |

- Criminal records require PID (as now).
- Dagi records require Dagi number instead of PID.
- Uniqueness: PID unique among criminals; Dagi number unique among dagis.

### 2. Add / Edit form

- One dropdown / radio: **Type → Criminal (default) | Dagi**
- If Criminal → show **PID** (required)
- If Dagi → show **Dagi number** (required), hide PID (or keep empty)
- Rest of the form **unchanged**

### 3. List / Search / Filters

- Add filter: **All | Criminal | Dagi**
- Table can show a Type badge + the relevant ID (PID or Dagi number)
- Existing search fields work for both types

### 4. Everything else — unchanged

- Verification
- Photos
- Transfer
- IO assignment
- PDF / CSV (include type + correct ID column)
- Roles & police-station access rules
- Home / crime categories (optional later: show Dagi count separately)

---

## What we will NOT build (based on this update)

- No separate `/dagi` module or `dagis` collection
- No separate Dagi-only screens (unless they ask later)
- No different field set for Dagi
- No mandatory “Promote Dagi → Criminal” for v1 (can add later if needed)

---

## Implementation summary

1. Add `recordType` (+ `dagiNumber`) on criminal model / create & edit APIs  
2. Default `recordType = criminal` on create  
3. Validation: Criminal → PID required; Dagi → Dagi number required  
4. Search/list filter by type  
5. UI labels/badges for type + correct ID  
6. PDF/CSV include type and ID  

Existing criminal records → treat as `recordType: criminal` (migration / default on read).

---

## Confirmed answers

1. **Dagi number format** — manual (user enters)
2. **Can type change later?** — yes (Criminal ↔ Dagi on edit)
3. **Existing records** — all treated as Criminal

---

## One-line summary

> Same criminal dossier as today; add one type field (Criminal / Dagi). Criminals use PID; Dagis use Dagi number (manual). Type can be changed later. Filter by type. Everything else remains the same.

---

**Document status:** Confirmed — development in progress.
