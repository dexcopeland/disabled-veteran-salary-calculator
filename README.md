# VA Disability & Salary Calculator

A tool for disabled veterans to estimate take-home pay two ways: reverse-engineer the **gross salary** needed for a target take-home, or enter a **known salary / offer** and see estimated take-home. Both paths factor in **tax-free VA disability compensation** plus federal, state, local, and FICA withholding.

## How It Works

1. Enter your **VA disability rating** and dependent information (spouse, children, parents).
2. Choose a mode:
   - **I know my target take-home** — enter the monthly or yearly take-home you want. The tool uses a binary search to find the gross salary that, after estimated taxes plus VA compensation, equals that target.
   - **I know my salary / offer** — enter a job or offer amount. The same tax engine estimates federal, state, local, and FICA withholding, then adds tax-free VA compensation to show take-home.
3. Select your **state**, **city/county** (if applicable), and **filing status**.
4. Click **Calculate required salary** or **Estimate take-home**.

Both modes use the same client-side tax engine, so a salary and the take-home it produces should agree if you switch modes.

## Features

- **Two calculation modes** — target take-home → required salary, or known salary / offer → estimated take-home.
- **Clear withholding breakdown** — federal income tax, state income tax, local tax (when selected), Social Security, and Medicare, with monthly equivalents.
- **2026 VA Rates** — Updated with the 2.8% COLA increase (effective Dec 1, 2025).
- **Progressive State Brackets** — 30 states computed bracket-by-bracket with state standard deductions, not flat-rate estimates.
- **City/County Taxes** — Locality selector for 8 states (NY, PA, MD, OH, IN, MI, MO, AL) with specific rates for major cities and counties.
- **Private** — Runs entirely in the browser. No data is stored or sent to any server.

## Limitations

- **Estimates only.** This is not a substitute for a W-2, a tax professional, or your employer's payroll withholding.
- **Withholding ≈ annual liability.** Federal and state lines are this calculator's estimated annual tax, shown as expected withholding. They are not a full IRS W-4 or state W-4 simulation, so a real paycheck can differ (extra withholding, allowances, supplemental wages, etc.).
- **FICA is included** (Social Security + Medicare employee share) so take-home is not just income tax. It does not include employer FICA or most other payroll deductions.
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
npm test          # Calculator unit tests
npm run build     # Production build → dist/
```

Built with React, TypeScript, Vite, Tailwind CSS, and [shadcn/ui](https://ui.shadcn.com).

### Contributing

1. Fork the repo → create a feature branch → open a PR.
2. Tax and VA rate changes must include sources.
3. All calculations must remain client-side (no server calls).
4. Test across multiple VA ratings and states, and both calculation modes, before submitting.

**Good areas to contribute:** additional city/county tax data, updated state brackets, accessibility improvements, and test coverage.

Questions? Open an issue or reach out on [LinkedIn](https://www.linkedin.com/in/dexcopeland/) or [GitHub](https://github.com/dexcopeland).

## License

[MIT License](./LICENSE) — free for veterans and their families.

---

**Version**: 2.1 | **Updated**: September 2026 | **VA Rates**: 2026 (Effective Dec 1, 2025)
