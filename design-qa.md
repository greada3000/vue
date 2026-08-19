# Design QA

## Comparison target

- Source visual truth: `C:\Users\Administrator\.codex\generated_images\01a017ca-7818-7113-8420-bd5738b09fe2\exec-7b89420f-37e6-4df7-9673-8d7c0067e807.png`
- Browser-rendered implementation: `D:\ugb\backend1\vue\qa\home-implementation.png`
- Side-by-side comparison: `D:\ugb\backend1\vue\qa\home-comparison.png`
- Mobile evidence: `D:\ugb\backend1\vue\qa\home-mobile.png`
- Supporting screen evidence: `D:\ugb\backend1\vue\qa\login-implementation.png`, `D:\ugb\backend1\vue\qa\admin-implementation.png`
- Source pixels: 1487 × 1058.
- Implementation pixels: 1425 × 970, captured from a 1440 × 1024 CSS viewport with a 1425 × 1024 visual viewport and device pixel ratio 1.
- Density normalization: source and implementation were top-aligned and fitted to 1425 × 970 for the side-by-side comparison. No device frame or browser chrome was included.
- State: anonymous desktop homepage using realistic local fallback content because the API service at `localhost:8080` was not running. The selected source shows a signed-in variant; auth-dependent header controls are therefore an expected state difference.

## Findings

- No actionable P0, P1, or P2 visual differences remain.
- [P3] The anonymous header shows “登录” instead of the signed-in avatar/menu in the source. This is an intentional state difference; the signed-in structure is implemented and activates from Vuex user state.
- [P3] Dynamic circle thumbnails reuse the generated editorial image set until the API supplies circle imagery. They remain real raster assets with the selected art direction, not placeholders or CSS drawings.

## Required fidelity surfaces

- Fonts and typography: passed. Chinese system sans-serif fallbacks, display weights, body line-height, metadata scale, truncation, and optical hierarchy match the warm editorial direction. Headline wrapping remains readable at desktop and mobile widths.
- Spacing and layout rhythm: passed. The sticky header, welcome strip, asymmetric feature grid, article stream, discovery rail, 16 px radii, subtle borders, and generous page margins preserve the source hierarchy. Desktop scroll width equals the visual viewport; mobile scroll width is 375 px for a 375 px visual viewport.
- Colors and visual tokens: passed. Warm cream canvas, plum text, violet primary action, pale lavender surfaces, coral story label, muted borders, and restrained elevation map consistently to global CSS tokens.
- Image quality and asset fidelity: passed. The bookstore, coastal train, journal, summer drink, and community-note artwork are project-local raster assets with correct subjects, aspect ratios, crops, and a shared warm editorial treatment. Element Plus provides the icon family; no handcrafted SVG, CSS art, or generic image placeholders are used.
- Copy and content: passed. Navigation, community prompts, article copy, circle descriptions, authentication language, and admin labels are coherent Chinese product copy and align with the selected mockup.
- Icons: passed. Element Plus icons use a consistent stroke/fill family and have accessible labels for icon-only controls.
- States and interactions: passed for the visible core flow. Search submits to `/search/articles?keyword=...`; login navigation opens the authentication screen; the main CTA routes unauthenticated users to login; tabs, topic filters, sorting, circle links, pagination, profile menus, dialogs, and admin navigation are wired.
- Accessibility and responsiveness: passed. Semantic header/nav/main regions, labeled search and notification controls, alt text, visible focus treatment, responsive grids, practical mobile tap targets, and zero horizontal overflow were verified.

## Full-view comparison evidence

`qa/home-comparison.png` places the source and latest browser-rendered homepage in one image. The implementation reproduces the selected composition: restrained top navigation, warm welcome strip, one large and two stacked editorial stories, tabbed content stream, weekly prompt, recommended circles, and community guidance rail.

## Focused region comparison evidence

The full comparison was inspected at original detail, where the header typography, feature-card crops, labels, metadata, article row rhythm, and right-rail surfaces remain readable. Separate login and admin captures were also reviewed because those screens establish the same token, typography, and component system beyond the homepage. A separate browser clip was not used because the in-app browser returned an empty clipped raster; the full viewport and DOM measurements remained valid.

## Comparison history

### Iteration 1

- Earlier [P1] finding: the weekly prompt and community guidance areas did not yet include the source's supporting illustrations.
  - Fix: generated and integrated `summer-drink.png` and `community-note.png` as real project-local raster assets.
  - Post-fix evidence: `qa/home-implementation.png` and the image load inspection show all five project imagery assets loaded at native dimensions.
- Earlier [P2] finding: the mobile feature grid expanded to 530 px inside a 375 px visual viewport.
  - Fix: changed grid tracks to `minmax(0, 1fr)`, added explicit `min-width: 0`, corrected the responsive `min(calc(...))` rule, and constrained feature/article/discovery children.
  - Post-fix evidence: `qa/home-mobile.png`; browser metrics report scroll width 375 px, visual viewport 375 px, and `overflow: false`.
- Earlier [P2] finding: the search field did not expose a discoverable semantic submit control to browser automation.
  - Fix: added an accessible icon submit button and Enter-key handling while preserving the pill-search appearance.
  - Post-fix evidence: browser interaction navigated to `/search/articles?keyword=%E8%AE%BE%E8%AE%A1` and displayed the search page heading.

### Final pass

- Production build: passed (`vite build`).
- Homepage console errors/warnings: none.
- Primary interactions tested: homepage search, login navigation, admin dashboard rendering, desktop overflow, and mobile overflow.
- Search results emitted an Axios network error only because the documented backend service at `http://localhost:8080` was not running; this is not a visual implementation defect.
- Post-fix P0/P1/P2 findings: none.

## Implementation checklist

- [x] Selected visual hierarchy and tokens implemented.
- [x] Real image assets generated and placed in the project.
- [x] API client aligned to `API_DOCUMENTATION.md` (`keyword/page/size` and `/api/...` routes).
- [x] Core navigation and search interactions verified.
- [x] Desktop and mobile responsive layout verified.
- [x] Production build passed.

## Follow-up polish

- When the Spring service is running, repeat the signed-in browser pass with test account `10001` to verify live avatar/user state and API-populated circle/article imagery.

final result: passed
