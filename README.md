# InsiderLens — fictional insider-activity mobile concept

A small, fully offline React Native prototype for scanning fictional insider
activity on mobile: a Market Pulse home screen, a searchable/filterable trades
screener, and a trade detail view with a mock activity chart.

## Project overview

InsiderLens helps a user quickly scan notable (entirely fictional) insider
transactions, find a specific filing by ticker or company name, narrow the list
with filters, and open a single filing to understand what the mock signal means.

The user problem: public insider filings are dense and table-heavy. This
prototype explores a mobile-first, card-based discovery and research flow for
the same broad product category. It is a prototype, **not an investing tool**,
and it deliberately contains no live data.

## Concept and data statement

Original mobile concept inspired by the broad insider-activity product
category represented by StockInsider.io. StockInsider.io was **not** used as a
data, copy, layout, or UI source: nothing was scraped, downloaded,
screenshot, copied, or recreated from it, and no market API, SEC feed, or other
financial-data source is used.

Every company, ticker, person, value, date, signal label, and chart point in
this app was invented for the assignment and is stored locally in
[`src/data/mockTrades.ts`](src/data/mockTrades.ts). The app makes **no network
requests**; it runs fully offline. All displayed content is fictional
mock/demo data.

## Screens and features

1. **Market Pulse (Home)**
   - Header with a persistent "Fictional demo data" badge
   - Search entry point that opens the screener and auto-focuses the input
   - Three summary cards with totals derived from the local data
     (transaction count, summed purchase value, summed sale value)
   - High-strength signal count
   - Top signals list and the four latest filings
   - Navigation into the screener and individual trade details
2. **Latest Trades / Screener**
   - Case-insensitive search over ticker **and** company name
   - Three independent filter groups:
     transaction type (All / Purchases / Sales),
     insider role (All roles / CEO / CFO / Director; Officer remains under
     All roles),
     and value threshold (Any / $100K+ / $500K+ / $1M+)
   - Live result count with singular/plural handling
   - Empty state ("No fictional demo trades match those filters.") with a
     Clear filters action
   - Inline search clear and a global Clear filters action
3. **Trade Details**
   - Back navigation and a company header with a FICTIONAL DEMO DATA badge
   - Prominent signal card with a demo headline value
   - Eight-row filing breakdown (insider, transaction + code, shares, price,
     total value, transaction date, filed date/time, signal strength)
   - Custom **Mock 7-day activity** SVG chart with an accessible label
   - "Why this matters" education block
   - Required demo/non-advice disclaimer
   - Defensive "Trade not found" fallback for an unknown trade id

## Tech stack

- Expo (SDK 57) with the blank TypeScript template
- React Native 0.86 / React 19
- TypeScript (strict mode)
- React Navigation native stack
- @expo/vector-icons (Ionicons)
- react-native-svg for the hand-built mock activity chart
- EAS Build for the installable Android APK
- No state library, no backend, no analytics, no HTTP client

## Setup

Prerequisites: Node.js 20+ and the Expo Go app on a phone (or an emulator).

```bash
# 1. install dependencies
npm install

# 2. start the development server
npm start
# or: npx expo start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS), or press
`a` / `i` for an emulator.

Other useful commands:

```bash
npx tsc --noEmit        # TypeScript type-check (no output = passing)
npx expo start -c       # start with a cleared Metro cache
npx expo install        # install an Expo-SDK-compatible package
```

### Building an installable Android APK

The `eas.json` `preview` profile produces a standalone APK (no Expo Go needed):

```bash
npm install -g eas-cli      # or use npx eas-cli@latest
eas login
eas build:configure         # first time only; creates/links the EAS project
eas build -p android --profile preview
```

When the cloud build finishes, EAS prints a download URL for the APK.

A fully local build (`eas build -p android --profile preview --local`) is also
possible but requires a local Android SDK/JDK setup.

## Mobile design decisions

- **Dark, high-contrast shell** (`#0B1220` background, `#172033` surfaces)
  keeps dense financial information scannable in a quick glance.
- **8-point spacing rhythm** (8/12/16/20/24) and 14–18 px card radii with
  subtle 1 px borders instead of heavy shadows.
- **Transaction semantics are never colour-only**: purchases and sales always
  pair colour, an up/down arrow, and a text label.
- **Filter chips** wrap onto multiple rows and show colour + a tick + the
  platform "selected" accessibility state.
- **Flexible rows** (`flex: 1`, `numberOfLines`) keep long fictional company
  names readable between 375 px and 430 px widths.
- **Touch targets** are at least 40×40 px, cards have descriptive
  `accessibilityLabel`s, and the mock chart exposes an accessibility label.
- Totals and filter results are **derived** from the single local data array,
  so the home summary, screener, and details can never disagree.

## Known limitations

- Data is static, fictional, and bundled in the app — there is no syncing,
  persistence, or "latest market" behaviour.
- No live filings, authentication, portfolios, watchlists, notifications, or
  alerts.
- No unit-test suite; filtering and data math were verified manually and with
  throwaway local scripts during development.
- Charts show invented relative activity values, not prices.
- The iOS flow was designed for safe areas but the submission APK is Android.

## AI-use disclosure

I used Arena.ai Agent Mode as a step-by-step guide while learning: it produced
a part-by-part implementation plan, starter code, explanations of React
Navigation and Expo patterns, and troubleshooting suggestions (for example,
installing `@expo/vector-icons` explicitly for SDK 57). I typed, ran, reviewed,
and edited every file on my own machine, fixed issues as they came up, tested
all screens and filter combinations in Expo Go, and I can explain every
component, style decision, and line of code in this repository. No code was
submitted unread or untested.

## Deliverables

- GitHub repository: this repository
- Google Drive folder: APK, three screenshots (Home, filtered Screener,
  Details), and a 1–3 minute demo video