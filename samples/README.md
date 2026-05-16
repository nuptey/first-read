# Sample contracts

Drop test PDFs into this directory for local development. Files in this folder
are git-ignored (except this README), so real contracts will not be committed
by accident.

Suggested coverage:

- `nda-standard.pdf`: matches the playbook cleanly. Expected triage:
  `auto_approve`.
- `nda-minor.pdf`: small deviations, all covered by the playbook. Expected
  triage: `light_touch`.
- `nda-material.pdf`: material deviations or out-of-scope content. Expected
  triage: `full_review`.
- `order-form.pdf`: a short order form with mixed positions.

The portal accepts a single PDF at a time, up to 10 MB and 50 pages.
