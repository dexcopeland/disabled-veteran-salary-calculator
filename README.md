# VA Disability & Salary Calculator

A tool for disabled veterans to calculate the gross salary needed to reach a desired take-home pay. It factors in **tax-free VA disability compensation** alongside federal, state, and local taxes to reverse-engineer the required salary.

## How It Works

1. Enter your **VA disability rating** and dependent information (spouse, children, parents).
2. Enter your **desired monthly or yearly take-home pay**.
3. Select your **state**, **city/county** (if applicable), and **filing status**.
4. Click **Calculate** — the tool uses a binary search to find the gross salary that, after all taxes, plus your VA compensation, equals your target take-home.

## Features

- **2026 VA Rates** — Updated with the 2.8% COLA increase (effective Dec 1, 2025).
- **Progressive State Brackets** — 30 states computed bracket-by-bracket with state standard deductions, not flat-rate estimates.
- **City/County Taxes** — Locality selector for 8 states (NY, PA, MD, OH, IN, MI, MO, AL) with specific rates for major cities and counties.
- **Private** — Runs entirely in the browser. No data is stored or sent to any server.

## Limitations

- **Estimates only.** This is not a substitute for professional tax advice.
- **No itemized deductions** — assumes the standard deduction at both federal and state levels.
- **No pre-tax contributions** — does not account for 401(k), HSA, FSA, or other pre-tax payroll deductions.
- **No tax credits** — earned income credit, child tax credit, etc. are not factored in.
- **Local tax coverage is partial** — only major cities/counties in 8 states are listed. Many smaller jurisdictions are not included.
- **State bracket data** — based on 2025 published rates and may not reflect mid-year legislative changes.

## Use It

**[Launch the calculator →](https://dexcopeland.github.io/disabled-veteran-salary-calculator/)**

No install required — runs in your browser.

## Local Development

If you want to run it locally or contribute:

```bash
npm install
npm run dev       # Start dev server
npm run build     # Production build → dist/
```

Built with React, TypeScript, Vite, Tailwind CSS, and [shadcn/ui](https://ui.shadcn.com).

## License

MIT License. Free for veterans and their families.

---

**Version**: 2.0 | **Updated**: March 2026 | **VA Rates**: 2026 (Effective Dec 1, 2025)
