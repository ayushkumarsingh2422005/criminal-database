# Dagi Management (Updated Rule)

## Rule

> **Dagi is a subset of Criminal.**  
> All Dagis are Criminals.  
> Not all Criminals are Dagis.

## Simple flow

1. Add/edit criminal as usual (**PID** always required)
2. Check **“Is also a Dagi / यह दागी भी है”**
3. Then enter:
   - **Dagi number** (manual)
   - **Dagi verification interval (days)** — e.g. 30
4. Dagi gets its **own verification** (history / overdue / verify button), same style as criminal verification

| | Criminal | Marked as Dagi |
|---|---|---|
| PID | Required | Required |
| Dagi number | — | Required |
| Criminal verification | Yes (global interval from Admin settings) | Yes |
| Dagi verification | — | Yes (**per-record** interval) |

## Filter

All / Criminal only / Dagi

---

**Status:** Implemented.
