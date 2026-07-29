# Utpala Group Review Website

This repository publishes the refined Utpala Group review website for stakeholder feedback.

## Review scope

- The V2 navigation, centred logo, five-slide hero carousel, typography, CTA styling, colours, spacing, overlays, controls, and motion remain locked.
- Content presents the four approved divisions: Real Estate Consulting, Loans & Mortgages, Realty, and Constructions.
- Feasibility Report, Interior Design, Web Design, and Property Management appear as Consulting add-ons.
- Realty Resources adds an OpenStreetMap area explorer, a dated June 2026 TRREB market snapshot, and an Ontario/Toronto residential land transfer tax estimator.
- “Discuss this area” carries the selected community into the consultation form.
- The consultation form validates in the browser but does not transmit information.

## Updating Realty Resources

Update supported areas and tax brackets in `assets/realty-resources.js`. Update the dated market figures in `index.html` only after verifying the newest official TRREB Market Watch release.

## Deployment

The GitHub Pages workflow publishes the static website automatically after a push to `main`. The repository owner must select **GitHub Actions** once under **Settings → Pages → Build and deployment → Source**.

## Important

This is a review version. Replace illustrative images and review copy only after Utpala approves the corresponding production content.
