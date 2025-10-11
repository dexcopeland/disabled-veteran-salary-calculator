# VA Disability & Salary Calculator

A comprehensive web application that calculates the gross salary needed to achieve a desired take-home pay, accounting for VA disability compensation, federal, and state taxes.

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

#### State & Territory Taxes
- All 50 US states plus DC
- US territories (American Samoa, Guam, Northern Mariana Islands, Puerto Rico, U.S. Virgin Islands)
- Accurate state income tax rates
- Handles states with no income tax (FL, TX, WA, etc.)
- Progressive tax calculations where applicable

### Simple State Selection
The calculator uses your state/territory selection to determine:
- Your state or territory tax rates
- All relevant tax calculations

Supports all US jurisdictions including:
- All 50 states
- District of Columbia
- American Samoa
- Guam
- Northern Mariana Islands
- Puerto Rico
- U.S. Virgin Islands

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
   - Select your state or territory for accurate tax calculation
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
- Tax Location (shows your selected state/territory)
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
  - Tax credits (child tax credit, earned income credit, etc.)
  - Pre-tax contributions (401k, HSA, etc.)
  - State-specific deductions or credits
  - Special tax situations

### Coverage Notes

### State & Territory Coverage
The calculator provides comprehensive coverage for:
- **All 50 US states** with accurate tax rates
- **District of Columbia** with local tax rates
- **5 US territories** with appropriate tax treatment
- **Simplified selection** via dropdown menu

State selection provides:
1. Direct access to accurate state tax rates
2. Clear identification of selected jurisdiction

## Future Enhancements

Potential improvements could include:
- Export results to PDF
- Multi-state comparison tool

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

**Version**: 1.1  
**Last Updated**: October 6, 2025  
**VA Rates Effective**: December 1, 2024
