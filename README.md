# VA Disability & Salary Calculator

A comprehensive web application that calculates the gross salary needed to achieve a desired take-home pay, accounting for VA disability compensation and all applicable taxes (federal, state, county, and local).

## Features

### VA Disability Compensation
- **Accurate 2025 VA Rates**: Uses official VA compensation rates effective December 1, 2024
- **Dependent Support**: Calculates compensation based on:
  - VA disability rating (0% - 100%)
  - Number of dependent children (0-10+)
  - Spouse status
  - Dependent parent(s) (for 100% rating)
- **All Scenarios Covered**: Handles all family configurations accurately

### Comprehensive Tax Calculations

#### Federal Taxes
- 2025 federal tax brackets for all filing statuses:
  - Single
  - Married Filing Jointly
  - Married Filing Separately
  - Head of Household
- Standard deductions applied automatically
- FICA taxes (Social Security & Medicare)
- Additional Medicare tax for high earners

#### State Taxes
- All 50 states plus DC
- Accurate state income tax rates
- Handles states with no income tax (FL, TX, WA, etc.)

#### County & Local Taxes
- **Maryland**: All 24 counties with specific rates
- **Indiana**: County-level income taxes
- **Ohio**: Combined county and school district taxes
- **Pennsylvania**: City wage taxes (Philadelphia, Pittsburgh)
- **New York**: NYC income tax, Yonkers surcharge
- **California**: Major cities covered
- **Ohio Cities**: Columbus, Cleveland, Cincinnati local taxes
- **Other Cities**: Baltimore, Detroit, Kansas City, St. Louis

### Smart ZIP Code Recognition
The calculator uses your ZIP code to determine:
- Your state
- Your county (where applicable)
- Your city (for cities with local income tax)
- All applicable tax rates

Covers major metropolitan areas including:
- New York City (all 5 boroughs)
- Los Angeles
- Chicago
- Philadelphia
- San Francisco Bay Area
- Baltimore/DC Metro
- And many more...

## How to Use

1. **Open the Calculator**
   - Simply open `index.html` in any modern web browser
   - No installation or dependencies required

2. **Enter VA Disability Information**
   - Select your VA disability rating
   - Enter number of dependent children
   - Check if you have a spouse
   - Check if you have dependent parent(s) (100% rating only)

3. **Enter Income Information**
   - Enter your desired take-home pay
   - Select pay period (monthly or yearly)
   - Enter your 5-digit ZIP code for accurate tax calculation
   - Select your tax filing status

4. **Calculate**
   - Click the "Calculate" button
   - View your results instantly

## Results Displayed

### Primary Results
- **Required Annual Gross Salary**: The salary you need to earn
- **Hourly Rate Equivalent**: Based on 2,080 hours/year (40 hrs/week × 52 weeks)

### Monthly Breakdown
- VA Disability Compensation (tax-free)
- Net Salary After Taxes
- Total Monthly Take-Home

### Tax Breakdown (Annual)
- Tax Location (shows your identified location)
- Federal Tax
- State Tax
- County/Local Tax (if applicable)
- FICA/Medicare
- Total Taxes

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern, responsive design
- **Vanilla JavaScript**: No dependencies, works offline
- **Client-Side Only**: All calculations happen in your browser for privacy

### Tax Data Sources
- VA rates: [VA.gov Official Rates](https://www.va.gov/disability/compensation-rates/veteran-rates/)
- Federal tax brackets: 2025 IRS tax tables
- State/local rates: Current published rates from state/local tax authorities

### Calculation Method
The calculator uses a binary search algorithm to efficiently find the gross salary that results in your desired take-home pay after all taxes are deducted.

## Important Disclaimers

⚠️ **This calculator provides estimates only** and should not be used for financial planning without consulting a tax professional.

- Actual taxes may vary based on deductions, credits, and other factors not considered here
- VA compensation rates are based on 2025 published rates and are subject to change
- State and local tax calculations are estimates and may not reflect all local jurisdictions
- The calculator does not account for:
  - Itemized deductions
  - Tax credits (child tax credit, earned income credit, etc.)
  - Pre-tax contributions (401k, HSA, etc.)
  - State-specific deductions or credits
  - Special tax situations

## Coverage Notes

### ZIP Code Coverage
The calculator has detailed coverage for:
- **100+ ZIP code prefixes** with specific city/county identification
- **All 50 states** with fallback state-level tax rates
- **Major metropolitan areas** with local tax rates

For ZIP codes not specifically mapped, the calculator will:
1. Estimate the state based on ZIP code prefix
2. Apply state-level tax rates
3. Note the location as "Estimated"

### Local Tax Coverage
Local taxes are specifically calculated for:
- **14+ major cities** with income taxes
- **24 Maryland counties** (all counties)
- **4 Indiana counties** (sample, expandable)
- **3 Ohio counties** (sample, expandable)

## Future Enhancements

Potential improvements could include:
- Export results to PDF
- Side-by-side scenario comparison
- Additional ZIP code coverage
- More granular local tax data
- Tax credit calculations
- Pre-tax contribution modeling

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is a free tool for veterans and their families. Feel free to use, modify, and distribute it.

## Support

For questions about VA disability compensation, visit [VA.gov](https://www.va.gov) or contact your local VA office.

For tax questions, consult a qualified tax professional or visit [IRS.gov](https://www.irs.gov).

---

**Version**: 1.0  
**Last Updated**: October 5, 2025  
**VA Rates Effective**: December 1, 2024
