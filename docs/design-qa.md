# Design QA — 推文三栏详情页

## Comparison target

- Source visual truth: `C:\Users\19223\AppData\Local\Temp\codex-clipboard-ab0d9a9f-9371-4e80-88f1-7ba3701a4e3e.png`
- Browser-rendered implementation: `D:\Bianc\vue_project\vue\qa\article-detail-three-column.png`
- Side-by-side comparison: `D:\Bianc\vue_project\vue\qa\article-detail-comparison.png`
- Mobile evidence: `D:\Bianc\vue_project\vue\qa\article-detail-mobile.png`
- Viewport: desktop 1760 × 1000 CSS px; mobile 390 × 844 CSS px; device pixel ratio 1.
- Source pixels: 1769 × 795. Implementation pixels: 1760 × 1000. Mobile pixels: 390 × 844.
- Density normalization: desktop images were proportionally fitted and top-aligned in the comparison artifact; browser chrome was excluded.
- State: anonymous user viewing the `/articles/demo` long-form example.

## Findings

- No actionable P0, P1, or P2 visual differences remain.
- [P3] The reference has a decorative reading illustration and utility controls above its right outline. The implementation intentionally follows the existing 拾光 design system and preserves its global header.
- [P3] The implementation uses the project's warmer cream/plum palette instead of the reference's gray/coral palette; this is intentional product consistency.

## Required fidelity surfaces

- Fonts and typography: passed. Songti-style long-form headings/body create editorial hierarchy, while navigation and metadata retain the project's sans-serif UI font. Sizes, weights, wrapping and line heights remain readable at both verified widths.
- Spacing and layout rhythm: passed. Desktop grid measures `240px 850px 220px`, both rails are sticky, and there is no horizontal overflow. At 390 px, the grid becomes one column, the chapter list and right outline are hidden, and no horizontal overflow occurs.
- Colors and visual tokens: passed. Existing canvas, surface, border, brand and muted tokens are used consistently, with restrained elevation and 18 px card radii.
- Image quality and asset fidelity: passed. The existing high-resolution bookstore raster is correctly cropped and sharp. Element Plus supplies all visible icons; no placeholder or handcrafted SVG/CSS icon art is used.
- Copy and content: passed. The example includes a credible title, abstract, author metadata, four major sections, eight subheadings, quote, list, process cards and comment copy sufficient to validate long-document behavior.
- Accessibility and responsiveness: passed. Semantic `aside`, `nav`, `article`, heading hierarchy, labels and image alt text are present. Desktop and mobile overflow checks passed.

## Full-view comparison evidence

`qa/article-detail-comparison.png` puts the supplied source and implementation together. Both establish the same three-region reading model: series navigation on the left, dominant long-form content in the center, and hierarchical in-page outline on the right. The implementation adapts spacing and visual tokens to the existing product.

## Focused region comparison evidence

The full-view comparison keeps headings, rail items, metadata, imagery and initial body copy readable, so no separate region crop was needed. `qa/article-detail-mobile.png` separately verifies the responsive header, summary card, article heading and cover crop.

## Comparison history

### Final pass

- Desktop composition: three columns visible; computed grid `240px 850px 220px`; right outline display `block`; horizontal overflow `false`.
- Mobile composition: one column at 390 px; series rail position `static`; chapter navigation and right outline display `none`; horizontal overflow `false`.
- Outline interaction: clicking “让系统持续运转” scrolls to the corresponding section; IntersectionObserver updates the active nested heading and progress reaches 100% near the end.
- Browser console errors/warnings: none.
- Production build: passed (`npm run build`).
- Post-verification P0/P1/P2 findings: none.

## Implementation checklist

- [x] Three-column desktop document layout.
- [x] Sticky left series navigation and right article outline.
- [x] Smooth anchor navigation, active heading tracking and reading progress.
- [x] Structured realistic long-form demo at `/articles/demo`.
- [x] Existing article API and review flow retained with plain-text compatibility.
- [x] Tablet and mobile responsive behavior.
- [x] Production build and browser verification.

## Follow-up polish

- If the backend later returns structured Markdown or editor JSON, replace the plain-text normalization with a renderer so API articles can expose the same multi-level outline automatically.

final result: passed
