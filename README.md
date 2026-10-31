# Utpala Group Website

This repository publishes the stakeholder-approved revision of the existing Utpala Group website. It preserves the established image-led carousel, navy-and-gold brand system, motion, card composition, and single responsive menu while simplifying the visitor journey.

## Current structure

- Home: five labelled hero states—Integrated, Finance, Real Estate, Design, and Construction—followed by the four service pathways and one contact form.
- Finance: financing strategy, mortgage coordination, preparation, funding conversations, mortgage and land-transfer-tax calculators, and a rate centre.
- Real Estate: purchase, sale, investment, property advisory, Real Estate Consulting, and the Niagara/GTA area explorer.
- Design: architectural, engineering, interior-design, and design-development coordination.
- Construction: residential, commercial, institutional, renovation/addition pathways, plus the approved builder credentials.

## Brand and interface amendments

- Uses the officially supplied Utpala mark in the centred `UTPALA [mark] CONSTRUCTION` header lockup.
- Enlarges the logo and Menu label, and changes the header action to `Contact Us`.
- Applies a high-contrast dark navy header after scrolling and on all service pages.
- Uses Montserrat for headings and controls as a geometric web-safe companion to Utpala’s Oddlini logo typography; Oddlini itself is not bundled because a licensed webfont file was not supplied.
- Keeps “How can we help you?” as a small kicker and makes “Contact Utpala” the dominant contact heading.
- Adds a persistent service switcher to Finance, Real Estate, Design, and Construction so visitors can move between services without returning to the homepage.
- Adds previous, next, and all-services links near the bottom of every service page.

## Finance tools and data

- Mortgage calculator: Canadian semi-annual compounding with monthly, biweekly, and weekly payment frequencies.
- Land transfer tax calculator: Ontario tax, Toronto municipal tax, and estimated first-time buyer rebates.
- Bank of Canada policy rate: loaded from the official Valet API with a last-verified fallback.
- Five-lender snapshot: TD, RBC, CIBC, Scotiabank, and BMO 5-year fixed and variable products, verified October 30, 2026, with official lender links.

Run `npm test` to verify calculator formulas, required page elements, duplicate IDs, and local links.

## Contact form

The homepage form posts to `info@utpala.ca` through FormSubmit. The first live submission requires the mailbox owner to approve FormSubmit’s one-time activation email. Until that approval is completed, delivery is not active.

## Content still awaiting official assets

- Replace the project-category illustrations with client-approved portfolio photography and case studies when supplied.
- Replace the social-channel labels with official profile links when supplied.
- Reconfirm the HCRA/Tarion display details in the Ontario Builder Directory before moving from the GitHub review URL to the final production domain.

## Deployment

GitHub Pages publishes the static site from the repository’s configured Pages source. The current review URL is:

`https://acatwalker88.github.io/utpala-group-review/`
