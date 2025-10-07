// VA Disability Rates for 2025 (monthly)
// Source: VA Compensation Rates (effective December 1, 2024)
// https://www.va.gov/disability/compensation-rates/veteran-rates/
const vaRates = {
    "0": { 
        veteranAlone: 0,
        withSpouse: 0,
        withSpouseAndOneChild: 0,
        withSpouseAndTwoChildren: 0,
        withOneParent: 0,
        withTwoParents: 0,
        withOneChild: 0,
        addPerChild: 0
    },
    "10": { 
        veteranAlone: 171.23,
        withSpouse: 171.23,
        withSpouseAndOneChild: 171.23,
        withSpouseAndTwoChildren: 171.23,
        withOneParent: 171.23,
        withTwoParents: 171.23,
        withOneChild: 171.23,
        addPerChild: 0
    },
    "20": { 
        veteranAlone: 338.49,
        withSpouse: 338.49,
        withSpouseAndOneChild: 338.49,
        withSpouseAndTwoChildren: 338.49,
        withOneParent: 338.49,
        withTwoParents: 338.49,
        withOneChild: 338.49,
        addPerChild: 0
    },
    "30": { 
        veteranAlone: 524.31,
        withSpouse: 579.07,
        withSpouseAndOneChild: 624.60,
        withSpouseAndTwoChildren: 664.60,
        withOneParent: 564.31,
        withTwoParents: 604.31,
        withOneChild: 564.31,
        addPerChild: 40.00
    },
    "40": { 
        veteranAlone: 755.28,
        withSpouse: 837.85,
        withSpouseAndOneChild: 893.73,
        withSpouseAndTwoChildren: 943.73,
        withOneParent: 805.28,
        withTwoParents: 855.28,
        withOneChild: 805.28,
        addPerChild: 50.00
    },
    "50": { 
        veteranAlone: 1075.16,
        withSpouse: 1186.60,
        withSpouseAndOneChild: 1258.87,
        withSpouseAndTwoChildren: 1323.87,
        withOneParent: 1140.16,
        withTwoParents: 1205.16,
        withOneChild: 1140.16,
        addPerChild: 65.00
    },
    "60": { 
        veteranAlone: 1361.88,
        withSpouse: 1503.23,
        withSpouseAndOneChild: 1593.92,
        withSpouseAndTwoChildren: 1676.92,
        withOneParent: 1441.88,
        withTwoParents: 1521.88,
        withOneChild: 1441.88,
        addPerChild: 83.00
    },
    "70": { 
        veteranAlone: 1716.28,
        withSpouse: 1887.51,
        withSpouseAndOneChild: 1998.66,
        withSpouseAndTwoChildren: 2101.66,
        withOneParent: 1811.28,
        withTwoParents: 1906.28,
        withOneChild: 1811.28,
        addPerChild: 103.00
    },
    "80": { 
        veteranAlone: 1995.01,
        withSpouse: 2194.09,
        withSpouseAndOneChild: 2328.65,
        withSpouseAndTwoChildren: 2454.65,
        withOneParent: 2105.01,
        withTwoParents: 2215.01,
        withOneChild: 2105.01,
        addPerChild: 126.00
    },
    "90": { 
        veteranAlone: 2241.91,
        withSpouse: 2468.91,
        withSpouseAndOneChild: 2626.92,
        withSpouseAndTwoChildren: 2775.92,
        withOneParent: 2366.91,
        withTwoParents: 2491.91,
        withOneChild: 2366.91,
        addPerChild: 149.00
    },
    "100": { 
        veteranAlone: 3737.85,
        withSpouse: 3946.25,
        withSpouseAndOneChild: 4201.35,
        withSpouseAndTwoChildren: 4447.10,
        withOneParent: 3899.11,
        withTwoParents: 4060.37,
        withOneChild: 3899.11,
        addPerChild: 245.75
    }
};

// Comprehensive ZIP code to location mapping (sample data - expanded coverage)
const zipToLocation = {
    // New York
    '100': { state: 'NY', city: 'New York City', county: 'New York' },
    '101': { state: 'NY', city: 'New York City', county: 'New York' },
    '102': { state: 'NY', city: 'New York City', county: 'New York' },
    '103': { state: 'NY', city: 'New York City', county: 'New York' },
    '104': { state: 'NY', city: 'New York City', county: 'Bronx' },
    '105': { state: 'NY', city: 'New York City', county: 'Westchester' },
    '106': { state: 'NY', city: 'New York City', county: 'Westchester' },
    '107': { state: 'NY', city: 'Yonkers', county: 'Westchester' },
    '108': { state: 'NY', city: null, county: 'Westchester' },
    '109': { state: 'NY', city: null, county: 'Westchester' },
    '110': { state: 'NY', city: 'New York City', county: 'Queens' },
    '111': { state: 'NY', city: 'New York City', county: 'Queens' },
    '112': { state: 'NY', city: 'New York City', county: 'Brooklyn' },
    '113': { state: 'NY', city: 'New York City', county: 'Brooklyn' },
    '114': { state: 'NY', city: 'New York City', county: 'Staten Island' },
    '115': { state: 'NY', city: null, county: 'Nassau' },
    '116': { state: 'NY', city: null, county: 'Nassau' },
    '117': { state: 'NY', city: null, county: 'Suffolk' },
    '118': { state: 'NY', city: null, county: 'Suffolk' },
    '119': { state: 'NY', city: null, county: 'Suffolk' },
    '120': { state: 'NY', city: null, county: 'Albany' },
    '121': { state: 'NY', city: null, county: 'Albany' },
    '122': { state: 'NY', city: null, county: 'Albany' },
    '140': { state: 'NY', city: null, county: 'Erie' },
    '141': { state: 'NY', city: null, county: 'Erie' },
    '142': { state: 'NY', city: null, county: 'Erie' },
    
    // Pennsylvania
    '150': { state: 'PA', city: null, county: 'Allegheny' },
    '151': { state: 'PA', city: 'Pittsburgh', county: 'Allegheny' },
    '152': { state: 'PA', city: 'Pittsburgh', county: 'Allegheny' },
    '190': { state: 'PA', city: 'Philadelphia', county: 'Philadelphia' },
    '191': { state: 'PA', city: 'Philadelphia', county: 'Philadelphia' },
    '192': { state: 'PA', city: 'Philadelphia', county: 'Philadelphia' },
    '193': { state: 'PA', city: 'Philadelphia', county: 'Philadelphia' },
    '194': { state: 'PA', city: 'Philadelphia', county: 'Philadelphia' },
    
    // Maryland
    '206': { state: 'MD', city: null, county: 'Prince Georges' },
    '207': { state: 'MD', city: null, county: 'Prince Georges' },
    '208': { state: 'MD', city: null, county: 'Prince Georges' },
    '209': { state: 'MD', city: null, county: 'Montgomery' },
    '210': { state: 'MD', city: 'Baltimore', county: 'Baltimore City' },
    '211': { state: 'MD', city: 'Baltimore', county: 'Baltimore City' },
    '212': { state: 'MD', city: 'Baltimore', county: 'Baltimore City' },
    '214': { state: 'MD', city: null, county: 'Anne Arundel' },
    
    // California
    '900': { state: 'CA', city: null, county: 'Los Angeles' },
    '901': { state: 'CA', city: null, county: 'Los Angeles' },
    '902': { state: 'CA', city: null, county: 'Los Angeles' },
    '903': { state: 'CA', city: null, county: 'Los Angeles' },
    '904': { state: 'CA', city: null, county: 'Los Angeles' },
    '905': { state: 'CA', city: null, county: 'Los Angeles' },
    '906': { state: 'CA', city: null, county: 'Los Angeles' },
    '910': { state: 'CA', city: null, county: 'Los Angeles' },
    '920': { state: 'CA', city: null, county: 'San Diego' },
    '921': { state: 'CA', city: null, county: 'San Diego' },
    '940': { state: 'CA', city: 'San Francisco', county: 'San Francisco' },
    '941': { state: 'CA', city: 'San Francisco', county: 'San Francisco' },
    '943': { state: 'CA', city: null, county: 'Alameda' },
    '944': { state: 'CA', city: null, county: 'San Mateo' },
    '945': { state: 'CA', city: null, county: 'Alameda' },
    '946': { state: 'CA', city: null, county: 'Contra Costa' },
    '947': { state: 'CA', city: null, county: 'Alameda' },
    '948': { state: 'CA', city: null, county: 'Contra Costa' },
    '949': { state: 'CA', city: null, county: 'Contra Costa' },
    '950': { state: 'CA', city: null, county: 'Santa Clara' },
    '951': { state: 'CA', city: null, county: 'Santa Clara' },
    
    // Ohio
    '430': { state: 'OH', city: 'Columbus', county: 'Franklin' },
    '431': { state: 'OH', city: 'Columbus', county: 'Franklin' },
    '432': { state: 'OH', city: 'Columbus', county: 'Franklin' },
    '441': { state: 'OH', city: 'Cleveland', county: 'Cuyahoga' },
    '442': { state: 'OH', city: 'Cleveland', county: 'Cuyahoga' },
    '443': { state: 'OH', city: 'Cleveland', county: 'Cuyahoga' },
    '452': { state: 'OH', city: 'Cincinnati', county: 'Hamilton' },
    '453': { state: 'OH', city: 'Cincinnati', county: 'Hamilton' },
    
    // Indiana
    '460': { state: 'IN', city: null, county: 'Marion' },
    '461': { state: 'IN', city: null, county: 'Marion' },
    '462': { state: 'IN', city: null, county: 'Marion' },
    
    // Illinois
    '600': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '601': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '602': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '603': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '604': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '605': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '606': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '607': { state: 'IL', city: 'Chicago', county: 'Cook' },
    '608': { state: 'IL', city: 'Chicago', county: 'Cook' },
};

// State tax rates and local tax information
const taxRates = {
    'AL': { state: 0.05, county: 0, city: 0, progressive: false },
    'AK': { state: 0, county: 0, city: 0, progressive: false },
    'AZ': { state: 0.025, county: 0, city: 0, progressive: false },
    'AR': { state: 0.049, county: 0, city: 0, progressive: false },
    'CA': { state: 0.093, county: 0, city: 0, progressive: true }, // Top rate, progressive
    'CO': { state: 0.0463, county: 0, city: 0, progressive: false },
    'CT': { state: 0.0699, county: 0, city: 0, progressive: true },
    'DE': { state: 0.066, county: 0, city: 0, progressive: true },
    'FL': { state: 0, county: 0, city: 0, progressive: false },
    'GA': { state: 0.0575, county: 0, city: 0, progressive: false },
    'HI': { state: 0.11, county: 0, city: 0, progressive: true },
    'ID': { state: 0.058, county: 0, city: 0, progressive: false },
    'IL': { state: 0.0495, county: 0, city: 0, progressive: false },
    'IN': { state: 0.0315, county: 0.01, city: 0, progressive: false }, // Average county rate
    'IA': { state: 0.06, county: 0, city: 0, progressive: true },
    'KS': { state: 0.057, county: 0, city: 0, progressive: true },
    'KY': { state: 0.045, county: 0, city: 0, progressive: false },
    'LA': { state: 0.0425, county: 0, city: 0, progressive: false },
    'ME': { state: 0.0715, county: 0, city: 0, progressive: true },
    'MD': { state: 0.0575, county: 0.032, city: 0, progressive: true }, // Average county rate
    'MA': { state: 0.05, county: 0, city: 0, progressive: false },
    'MI': { state: 0.0419, county: 0, city: 0, progressive: false },
    'MN': { state: 0.0985, county: 0, city: 0, progressive: true },
    'MS': { state: 0.05, county: 0, city: 0, progressive: false },
    'MO': { state: 0.048, county: 0, city: 0, progressive: false },
    'MT': { state: 0.0675, county: 0, city: 0, progressive: true },
    'NE': { state: 0.0684, county: 0, city: 0, progressive: true },
    'NV': { state: 0, county: 0, city: 0, progressive: false },
    'NH': { state: 0, county: 0, city: 0, progressive: false },
    'NJ': { state: 0.1075, county: 0, city: 0, progressive: true },
    'NM': { state: 0.059, county: 0, city: 0, progressive: true },
    'NY': { state: 0.109, county: 0, city: 0, progressive: true }, // Top rate
    'NC': { state: 0.0475, county: 0, city: 0, progressive: false },
    'ND': { state: 0.029, county: 0, city: 0, progressive: false },
    'OH': { state: 0.0385, county: 0, city: 0.02, progressive: true }, // Average city rate
    'OK': { state: 0.0475, county: 0, city: 0, progressive: true },
    'OR': { state: 0.099, county: 0, city: 0, progressive: true },
    'PA': { state: 0.0307, county: 0, city: 0, progressive: false },
    'RI': { state: 0.0599, county: 0, city: 0, progressive: true },
    'SC': { state: 0.065, county: 0, city: 0, progressive: true },
    'SD': { state: 0, county: 0, city: 0, progressive: false },
    'TN': { state: 0, county: 0, city: 0, progressive: false },
    'TX': { state: 0, county: 0, city: 0, progressive: false },
    'UT': { state: 0.0485, county: 0, city: 0, progressive: false },
    'VT': { state: 0.0875, county: 0, city: 0, progressive: true },
    'VA': { state: 0.0575, county: 0, city: 0, progressive: true },
    'WA': { state: 0, county: 0, city: 0, progressive: false },
    'WV': { state: 0.065, county: 0, city: 0, progressive: true },
    'WI': { state: 0.0765, county: 0, city: 0, progressive: true },
    'WY': { state: 0, county: 0, city: 0, progressive: false },
    'DC': { state: 0.1075, county: 0, city: 0, progressive: true },
    // US Territories
    'AS': { state: 0, county: 0, city: 0, progressive: false }, // American Samoa
    'GU': { state: 0, county: 0, city: 0, progressive: false }, // Guam
    'MP': { state: 0, county: 0, city: 0, progressive: false }, // Northern Mariana Islands
    'PR': { state: 0, county: 0, city: 0, progressive: false }, // Puerto Rico (uses federal tax system)
    'VI': { state: 0, county: 0, city: 0, progressive: false }, // U.S. Virgin Islands
};

// City-specific tax rates
const cityTaxRates = {
    'New York City': 0.03876, // NYC has its own income tax (top rate)
    'Philadelphia': 0.03398, // Philly wage tax for residents
    'Pittsburgh': 0.03, // Pittsburgh local services tax
    'San Francisco': 0.0138, // Payroll expense tax (simplified)
    'Columbus': 0.025, // Columbus city income tax
    'Cleveland': 0.025, // Cleveland city income tax
    'Cincinnati': 0.0191, // Cincinnati city income tax
    'Yonkers': 0.01695, // Yonkers resident income tax surcharge
    'Baltimore': 0.032, // Baltimore city income tax
    'Detroit': 0.024, // Detroit city income tax
    'Kansas City': 0.01, // Kansas City earnings tax
    'St. Louis': 0.01, // St. Louis earnings tax
};

// County-specific tax rates (for states with county taxes)
const countyTaxRates = {
    // Maryland counties
    'Allegany': 0.03,
    'Anne Arundel': 0.027,
    'Baltimore': 0.032,
    'Baltimore City': 0.032,
    'Calvert': 0.03,
    'Caroline': 0.0263,
    'Carroll': 0.0305,
    'Cecil': 0.028,
    'Charles': 0.03,
    'Dorchester': 0.0262,
    'Frederick': 0.0296,
    'Garrett': 0.0265,
    'Harford': 0.0306,
    'Howard': 0.032,
    'Kent': 0.0285,
    'Montgomery': 0.032,
    'Prince Georges': 0.032,
    'Queen Annes': 0.028,
    'Somerset': 0.032,
    'St. Marys': 0.03,
    'Talbot': 0.0225,
    'Washington': 0.028,
    'Wicomico': 0.032,
    'Worcester': 0.0125,
    
    // Indiana counties (sample)
    'Marion': 0.0225,
    'Lake': 0.0155,
    'Allen': 0.0135,
    'Hamilton': 0.0125,
    
    // Ohio counties (sample - combined county + school district)
    'Franklin': 0.025,
    'Cuyahoga': 0.025,
    'Hamilton': 0.021,
};

// Federal tax brackets for 2025 (Single, Married Filing Jointly, Married Filing Separately, Head of Household)
const federalTaxBrackets = {
    single: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11601, max: 47150, rate: 0.12 },
        { min: 47151, max: 100525, rate: 0.22 },
        { min: 100526, max: 191950, rate: 0.24 },
        { min: 191951, max: 243725, rate: 0.32 },
        { min: 243726, max: 609350, rate: 0.35 },
        { min: 609351, max: Infinity, rate: 0.37 }
    ],
    marriedJoint: [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23201, max: 94300, rate: 0.12 },
        { min: 94301, max: 201050, rate: 0.22 },
        { min: 201051, max: 383900, rate: 0.24 },
        { min: 383901, max: 487450, rate: 0.32 },
        { min: 487451, max: 731200, rate: 0.35 },
        { min: 731201, max: Infinity, rate: 0.37 }
    ],
    marriedSeparate: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11601, max: 47150, rate: 0.12 },
        { min: 47151, max: 100525, rate: 0.22 },
        { min: 100526, max: 191950, rate: 0.24 },
        { min: 191951, max: 243725, rate: 0.32 },
        { min: 243726, max: 365600, rate: 0.35 },
        { min: 365601, max: Infinity, rate: 0.37 }
    ],
    headOfHousehold: [
        { min: 0, max: 16550, rate: 0.10 },
        { min: 16551, max: 63100, rate: 0.12 },
        { min: 63101, max: 100500, rate: 0.22 },
        { min: 100501, max: 191950, rate: 0.24 },
        { min: 191951, max: 243700, rate: 0.32 },
        { min: 243701, max: 609350, rate: 0.35 },
        { min: 609351, max: Infinity, rate: 0.37 }
    ]
};

// Standard deduction for 2025
const standardDeductions = {
    single: 13850,
    marriedJoint: 27700,
    marriedSeparate: 13850,
    headOfHousehold: 20800
};

// Rate limiting configuration
const RATE_LIMIT = {
    maxRequests: 100, // Maximum calculations per time window
    timeWindow: 60000, // Time window in milliseconds (1 minute)
    requests: [],
};

// Check rate limit
function checkRateLimit() {
    const now = Date.now();
    // Remove old requests outside the time window
    RATE_LIMIT.requests = RATE_LIMIT.requests.filter(time => now - time < RATE_LIMIT.timeWindow);
    
    if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
        throw new Error('Too many calculations. Please wait a moment before trying again.');
    }
    
    // Add current request
    RATE_LIMIT.requests.push(now);
    return true;
}

// DOM Elements
const form = document.querySelector('form');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('results');
const loadingElement = document.getElementById('loading');

// Result elements
const requiredSalaryElement = document.getElementById('requiredSalary');
const hourlyRateElement = document.getElementById('hourlyRate');
const vaCompensationElement = document.getElementById('vaCompensation');
const netSalaryElement = document.getElementById('netSalary');
const totalTakeHomeElement = document.getElementById('totalTakeHome');
const federalTaxElement = document.getElementById('federalTax');
const stateTaxElement = document.getElementById('stateTax');
const ficaTaxElement = document.getElementById('ficaTax');
const totalTaxesElement = document.getElementById('totalTaxes');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any default values or event listeners
    calculateBtn.addEventListener('click', calculateSalary);
    
    // Add input event listeners for real-time updates
    document.getElementById('vaRating').addEventListener('change', updateVADependentFields);
    document.getElementById('hasSpouse').addEventListener('change', updateVADependentFields);
    document.getElementById('hasDependentParent').addEventListener('change', updateVADependentFields);
    
    // Initialize the form
    updateVADependentFields();
});

// Enable/disable dependent fields based on VA rating
function updateVADependentFields() {
    const vaRating = document.getElementById('vaRating').value;
    const hasSpouseCheckbox = document.getElementById('hasSpouse');
    const hasDependentParentCheckbox = document.getElementById('hasDependentParent');
    
    // Only enable spouse and parent checkboxes if rating is 30% or higher
    const isEligible = parseInt(vaRating) >= 30;
    
    hasSpouseCheckbox.disabled = !isEligible;
    hasDependentParentCheckbox.disabled = !isEligible || parseInt(vaRating) < 100;
    
    // Uncheck if disabled
    if (hasSpouseCheckbox.disabled) hasSpouseCheckbox.checked = false;
    if (hasDependentParentCheckbox.disabled) hasDependentParentCheckbox.checked = false;
}

// Sanitize string input to prevent XSS
function sanitizeString(input) {
    if (typeof input !== 'string') return '';
    // Remove any HTML tags and special characters
    return input.replace(/[<>\"'&]/g, '').trim();
}

// Validate and sanitize numeric input
function sanitizeNumber(input, min = -Infinity, max = Infinity) {
    const num = parseFloat(input);
    if (isNaN(num) || !isFinite(num)) {
        return null;
    }
    // Clamp the number within the valid range
    return Math.max(min, Math.min(max, num));
}

// Validate inputs
function validateInputs() {
    const desiredIncomeInput = document.getElementById('desiredIncome').value;
    const stateSelect = document.getElementById('stateSelect').value;
    
    // Sanitize and validate desired income
    const desiredIncome = sanitizeNumber(desiredIncomeInput, 0, 100000000);
    
    // Check if desired income is provided and valid
    if (desiredIncome === null || desiredIncome <= 0) {
        throw new Error('Please enter a valid desired take-home pay greater than $0');
    }
    
    // Check if desired income is reasonable (not too high)
    if (desiredIncome > 100000000) {
        throw new Error('Desired income seems unreasonably high. Please enter a realistic amount.');
    }
    
    // Validate state selection (optional but if provided, must be valid)
    if (stateSelect && !taxRates[stateSelect]) {
        throw new Error('Please select a valid state or territory');
    }
    
    return true;
}

// Calculate the required salary
function calculateSalary() {
    // Show loading state
    loadingElement.textContent = 'Calculating...';
    loadingElement.style.display = 'block';
    resultsSection.style.display = 'none';
    
    // Use setTimeout to allow the UI to update before heavy calculations
    setTimeout(() => {
        try {
            // Check rate limit first
            checkRateLimit();
            
            // Validate inputs
            validateInputs();
            
            // Get form values
            const vaRating = document.getElementById('vaRating').value;
            const dependents = parseInt(document.getElementById('dependents').value) || 0;
            const hasSpouse = document.getElementById('hasSpouse').checked;
            const hasDependentParent = vaRating === '100' && document.getElementById('hasDependentParent').checked;
            
            let desiredIncome = parseFloat(document.getElementById('desiredIncome').value) || 0;
            const payPeriod = document.getElementById('payPeriod').value;
            
            // Convert to annual if monthly was provided
            if (payPeriod === 'monthly') {
                desiredIncome *= 12;
            }
            
            const stateCode = document.getElementById('stateSelect').value;
            const filingStatus = getFilingStatus();
            
            // 1. Calculate VA compensation (tax-free)
            const vaCompensation = calculateVACompensation(vaRating, dependents, hasSpouse, hasDependentParent);
            
            // 2. Calculate required salary to achieve desired take-home pay
            const result = calculateRequiredSalary(desiredIncome, vaCompensation, stateCode, filingStatus);
            
            // 3. Display results
            displayResults(result, vaCompensation);
            
            // Show results and hide loading
            loadingElement.style.display = 'none';
            resultsSection.style.display = 'block';
            
        } catch (error) {
            console.error('Error calculating salary:', error);
            loadingElement.textContent = 'Error: ' + error.message;
            loadingElement.style.display = 'block';
            resultsSection.style.display = 'none';
        }
    }, 10); // Small delay to allow UI to update
}

// Calculate VA compensation based on rating and dependents
function calculateVACompensation(rating, dependents, hasSpouse, hasDependentParent) {
    const rate = vaRates[rating] || vaRates["0"];
    let compensation = 0;
    
    // Determine the base compensation based on family situation
    if (hasSpouse && dependents === 0 && !hasDependentParent) {
        // Veteran with spouse only
        compensation = rate.withSpouse;
    } else if (hasSpouse && dependents === 1 && !hasDependentParent) {
        // Veteran with spouse and one child
        compensation = rate.withSpouseAndOneChild;
    } else if (hasSpouse && dependents === 2 && !hasDependentParent) {
        // Veteran with spouse and two children
        compensation = rate.withSpouseAndTwoChildren;
    } else if (hasSpouse && dependents > 2 && !hasDependentParent) {
        // Veteran with spouse and more than two children
        compensation = rate.withSpouseAndTwoChildren + (rate.addPerChild * (dependents - 2));
    } else if (!hasSpouse && dependents === 1 && !hasDependentParent) {
        // Veteran with one child only
        compensation = rate.withOneChild;
    } else if (!hasSpouse && dependents > 1 && !hasDependentParent) {
        // Veteran with multiple children, no spouse
        compensation = rate.withOneChild + (rate.addPerChild * (dependents - 1));
    } else if (!hasSpouse && dependents === 0 && hasDependentParent) {
        // Veteran with one or two parents, no spouse or children
        compensation = rate.withOneParent; // Simplified - would need to distinguish 1 vs 2 parents
    } else if (hasSpouse && dependents > 0 && hasDependentParent) {
        // Complex case: spouse, children, and parents
        // Start with spouse and children rate, then add parent amount
        if (dependents === 1) {
            compensation = rate.withSpouseAndOneChild;
        } else if (dependents === 2) {
            compensation = rate.withSpouseAndTwoChildren;
        } else {
            compensation = rate.withSpouseAndTwoChildren + (rate.addPerChild * (dependents - 2));
        }
        // Add parent differential (difference between withOneParent and veteranAlone)
        const parentAddition = rate.withOneParent - rate.veteranAlone;
        compensation += parentAddition;
    } else {
        // Veteran alone (no dependents)
        compensation = rate.veteranAlone;
    }
    
    return compensation;
}

// Calculate the required gross salary to achieve desired take-home pay
function calculateRequiredSalary(desiredAnnualTakeHome, vaMonthlyCompensation, stateCode, filingStatus) {
    // Convert VA compensation to annual
    const vaAnnualCompensation = vaMonthlyCompensation * 12;
    
    // Calculate the target salary after taxes (excluding VA compensation)
    const targetAfterTaxSalary = desiredAnnualTakeHome - vaAnnualCompensation;
    
    if (targetAfterTaxSalary <= 0) {
        return {
            grossSalary: 0,
            federalTax: 0,
            stateTax: 0,
            ficaTax: 0,
            netSalary: 0,
            totalTaxes: 0,
            vaCompensation: vaAnnualCompensation
        };
    }
    
    // Use binary search to find the required gross salary
    let low = 0;
    let high = desiredAnnualTakeHome * 2; // Start with a reasonable upper bound
    let result = {
        grossSalary: 0,
        federalTax: 0,
        stateTax: 0,
        ficaTax: 0,
        netSalary: 0,
        totalTaxes: 0
    };
    
    // Binary search to find the gross salary that results in the target after-tax income
    for (let i = 0; i < 50; i++) { // Limit iterations to prevent infinite loops
        const mid = Math.floor((low + high) / 2);
        const calc = calculateTaxes(mid, stateCode, filingStatus);
        
        // Calculate how close we are to the target
        const currentNet = mid - calc.totalTaxes;
        const difference = currentNet - targetAfterTaxSalary;
        
        if (Math.abs(difference) < 1) { // Close enough
            result = { ...calc, grossSalary: mid };
            break;
        } else if (currentNet < targetAfterTaxSalary) {
            low = mid;
        } else {
            high = mid;
        }
        
        // If we've converged, use this result
        if (high - low <= 1) {
            result = { ...calc, grossSalary: mid };
            break;
        }
    }
    
    return {
        ...result,
        vaCompensation: vaAnnualCompensation,
        totalMonthlyTakeHome: (result.netSalary + vaAnnualCompensation) / 12
    };
}

// Calculate taxes for a given gross salary
function calculateTaxes(grossSalary, stateCode, filingStatus) {
    // Calculate FICA taxes (Social Security + Medicare)
    const socialSecurityTax = Math.min(grossSalary, 168600) * 0.062; // 6.2% up to wage base limit
    const medicareTax = grossSalary * 0.0145; // 1.45% for all income
    const additionalMedicareTax = filingStatus === 'marriedJoint' && grossSalary > 250000 ? (grossSalary - 250000) * 0.009 : 0;
    
    const ficaTax = socialSecurityTax + medicareTax + additionalMedicareTax;
    
    // Calculate federal income tax
    const standardDeduction = standardDeductions[filingStatus] || 0;
    const taxableIncome = Math.max(0, grossSalary - standardDeduction);
    const federalTax = calculateProgressiveTax(taxableIncome, federalTaxBrackets[filingStatus]);
    
    // Calculate state and local taxes
    const taxInfo = getStateTaxRates(stateCode);
    const stateTax = grossSalary * taxInfo.stateTaxRate;
    const localTax = grossSalary * (taxInfo.countyTaxRate + taxInfo.cityTaxRate);
    
    // Calculate total taxes and net salary
    const totalTaxes = federalTax + stateTax + localTax + ficaTax;
    const netSalary = grossSalary - totalTaxes;
    
    return {
        federalTax,
        stateTax,
        localTax,
        ficaTax,
        totalTaxes,
        netSalary,
        location: taxInfo.location
    };
}

// Calculate tax using progressive tax brackets
function calculateProgressiveTax(income, brackets) {
    let tax = 0;
    
    for (const bracket of brackets) {
        if (income <= 0) break;
        
        const taxableAmount = Math.min(income, bracket.max - bracket.min + 1);
        tax += taxableAmount * bracket.rate;
        income -= taxableAmount;
    }
    
    return tax;
}

// Get state tax rates based on state code
function getStateTaxRates(stateCode) {
    // Default to no state tax if no state provided or invalid state
    if (!stateCode || !taxRates[stateCode]) {
        return {
            stateTaxRate: 0,
            countyTaxRate: 0,
            cityTaxRate: 0,
            location: 'No state selected'
        };
    }
    
    const stateInfo = taxRates[stateCode];
    const stateNames = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
        'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia',
        'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois',
        'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana',
        'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota',
        'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
        'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
        'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon',
        'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
        'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia',
        'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
        'AS': 'American Samoa', 'GU': 'Guam', 'MP': 'Northern Mariana Islands',
        'PR': 'Puerto Rico', 'VI': 'U.S. Virgin Islands'
    };
    
    return {
        stateTaxRate: stateInfo.state || 0,
        countyTaxRate: stateInfo.county || 0,
        cityTaxRate: stateInfo.city || 0,
        location: stateNames[stateCode] || stateCode
    };
}

// Get filing status from form
function getFilingStatus() {
    const status = document.getElementById('filingStatus').value;
    
    switch(status) {
        case 'marriedJoint': return 'marriedJoint';
        case 'marriedSeparate': return 'marriedSeparate';
        case 'headOfHousehold': return 'headOfHousehold';
        default: return 'single';
    }
}

// Format currency
function formatCurrency(amount, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(amount);
}

// Display the calculation results
function displayResults(result, vaMonthlyCompensation) {
    // Format all values
    requiredSalaryElement.textContent = formatCurrency(result.grossSalary, 0);
    hourlyRateElement.textContent = formatCurrency(result.grossSalary / 2080, 2); // 2080 hours = 40 hours/week * 52 weeks
    vaCompensationElement.textContent = formatCurrency(vaMonthlyCompensation, 2);
    netSalaryElement.textContent = formatCurrency(result.netSalary / 12, 2); // Monthly
    totalTakeHomeElement.textContent = formatCurrency((result.netSalary + result.vaCompensation) / 12, 2);
    
    // Display location information if available
    const locationInfoElement = document.getElementById('locationInfo');
    const taxLocationElement = document.getElementById('taxLocation');
    if (result.location) {
        taxLocationElement.textContent = result.location;
        locationInfoElement.style.display = 'flex';
    } else {
        locationInfoElement.style.display = 'none';
    }
    
    // Tax breakdown (annual)
    federalTaxElement.textContent = formatCurrency(result.federalTax, 0);
    stateTaxElement.textContent = formatCurrency(result.stateTax, 0);
    
    // Show local tax row only if there's local tax
    const localTaxRow = document.getElementById('localTaxRow');
    const localTaxElement = document.getElementById('localTax');
    if (result.localTax && result.localTax > 0) {
        localTaxElement.textContent = formatCurrency(result.localTax, 0);
        localTaxRow.style.display = 'flex';
    } else {
        localTaxRow.style.display = 'none';
    }
    
    ficaTaxElement.textContent = formatCurrency(result.ficaTax, 0);
    totalTaxesElement.textContent = formatCurrency(result.totalTaxes, 0);
}
