# Utpala Group Review Website

This repository publishes the refined Utpala Group review website for stakeholder feedback.

## Review scope

- The V2 navigation, centred logo, hero carousel, service-card composition, typography, CTA styling, spacing, overlays, controls, and motion remain locked.
- Content now follows Deckyi's approved four service lines in order: Finance, Real Estate, Design, and Construction.
- Utpala Real Estate Consulting appears later under How We Work as Advisory, Strategy, Development, and Project Management.
- Real Estate Resources includes the OpenStreetMap area explorer, a dated July 2026 TRREB snapshot, and the Ontario/Toronto residential land transfer tax estimator.
- “Discuss this area” carries the selected community into the consultation form.
- The “How Can We Help?” CTA opens the six approved enquiry options. Real Estate Consulting reveals Advisory, Strategy, Development, Project Management, and “Not sure yet” only after selection.
- The contact form uses the same progressive-disclosure pattern and validates in the browser without transmitting information.
- The five Project Types cards use the supplied architecture assets in order from Utpa_01 through Utpa_05.
- The website uses the corporate Utpala Group mark with refined navy and gold brand tokens while preserving the V2 white, image-led composition and limited black footer treatment.

## Updating Real Estate Resources

Update supported areas and tax brackets in `assets/realty-resources.js`. Update the dated market figures in `index.html` only after verifying the newest official TRREB Market Watch release.

## Deployment

The GitHub Pages workflow publishes the static website automatically after a push to `main`. The repository owner must select **GitHub Actions** once under **Settings → Pages → Build and deployment → Source**.

## Important

This is a review version. Replace illustrative images and review copy only after Utpala approves the corresponding production content.
