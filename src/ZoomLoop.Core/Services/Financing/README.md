# Financing Calculator

The Financing Calculator service provides accurate vehicle financing calculations including taxes and fees based on Canadian provincial tax rates.

## Features

- **Tax Calculation**: Automatically applies correct tax rates based on province/region
- **Fee Management**: Configurable option to finance fees or pay upfront
- **Trade-In Support**: Handles trade-in values that reduce the financed principal
- **Custom Tax Rates**: Override default provincial rates when needed
- **Comprehensive Testing**: Full unit test coverage for all provinces and scenarios

## Supported Regions

### Canadian Provinces

| Province/Territory | Code | Tax Rate | Description |
|-------------------|------|----------|-------------|
| Ontario | ON | 13% | HST |
| British Columbia | BC | 12% | 5% GST + 7% PST |
| Alberta | AB | 5% | GST only |
| Quebec | QC | 14.975% | 5% GST + 9.975% QST (compound) |
| Nova Scotia | NS | 15% | HST |
| New Brunswick | NB | 15% | HST |
| Saskatchewan | SK | 11% | 5% GST + 6% PST |
| Manitoba | MB | 12% | 5% GST + 7% RST |
| Prince Edward Island | PE | 15% | HST |
| Newfoundland and Labrador | NL | 15% | HST |
| Northwest Territories | NT | 5% | GST only |
| Nunavut | NU | 5% | GST only |
| Yukon | YT | 5% | GST only |

## Calculation Formula

The financed principal is calculated as:

```
Financed Principal = Vehicle Price - Down Payment - Trade-In Value + [Financed Fees] + Taxes

Where:
  Taxable Amount = Vehicle Price - Down Payment - Trade-In Value + [Financed Fees if applicable]
  Taxes = Taxable Amount × Tax Rate
```

### Key Points

- **Fees**: Can be configured to be financed (added to principal) or paid upfront (excluded from financing)
- **Trade-In**: Positive trade-in values reduce the amount to be financed
- **Taxes**: Applied to the taxable amount (after down payment and trade-in, including financed fees if applicable)

## API Usage

### Calculate Financing

**Endpoint**: `POST /api/financing/calculate`

**Request Body**:
```json
{
  "vehiclePrice": 30000.00,
  "downPayment": 5000.00,
  "tradeInValue": 0.00,
  "fees": 1000.00,
  "financeFees": true,
  "region": "ON",
  "customTaxRate": null
}
```

**Response**:
```json
{
  "vehiclePrice": 30000.00,
  "downPayment": 5000.00,
  "tradeInValue": 0.00,
  "fees": 1000.00,
  "feesFinanced": true,
  "taxableAmount": 26000.00,
  "taxRate": 0.13,
  "taxAmount": 3380.00,
  "financedPrincipal": 29380.00,
  "region": "ON"
}
```

### Get Tax Rates

**Endpoint**: `GET /api/financing/tax-rates`

**Response**:
```json
{
  "taxRates": {
    "ON": 0.13,
    "BC": 0.12,
    "AB": 0.05,
    "QC": 0.14975,
    ...
  }
}
```

## Code Usage

### Using the Service

```csharp
using ZoomLoop.Core.Services.Financing;

// Create calculator
var calculator = new FinancingCalculator();

// Configure options
var options = new FinancingOptions
{
    VehiclePrice = 30000m,
    DownPayment = 5000m,
    TradeInValue = 0m,
    Fees = 1000m,
    FinanceFees = true,
    Region = "ON"
};

// Calculate
var result = calculator.CalculateFinancing(options);

// Access results
Console.WriteLine($"Financed Principal: ${result.FinancedPrincipal}");
Console.WriteLine($"Tax Amount: ${result.TaxAmount}");
```

### Getting Tax Rates

```csharp
using ZoomLoop.Core.Services.Financing;

// Get all tax rates
var allRates = TaxConfiguration.GetAllTaxRates();

// Get specific province rate
var ontarioRate = TaxConfiguration.GetTaxRate("ON"); // 0.13

// Check if region is supported
var isSupported = TaxConfiguration.IsSupportedRegion("ON"); // true
```

## Examples

### Example 1: Ontario Vehicle with Financed Fees

- Vehicle Price: $30,000
- Down Payment: $5,000
- Trade-In: $0
- Fees: $1,000 (financed)
- Region: Ontario (13% HST)

**Calculation**:
- Taxable Amount: $30,000 - $5,000 - $0 + $1,000 = $26,000
- Tax: $26,000 × 0.13 = $3,380
- Financed Principal: $30,000 - $5,000 - $0 + $1,000 + $3,380 = **$29,380**

### Example 2: Alberta Vehicle with Upfront Fees

- Vehicle Price: $35,000
- Down Payment: $7,000
- Trade-In: $3,000
- Fees: $800 (not financed)
- Region: Alberta (5% GST)

**Calculation**:
- Taxable Amount: $35,000 - $7,000 - $3,000 = $25,000 (fees not included)
- Tax: $25,000 × 0.05 = $1,250
- Financed Principal: $35,000 - $7,000 - $3,000 + $0 + $1,250 = **$26,250**

### Example 3: Quebec Vehicle with Custom Tax Rate

- Vehicle Price: $28,000
- Down Payment: $4,000
- Trade-In: $2,000
- Fees: $600 (financed)
- Custom Tax Rate: 10%

**Calculation**:
- Taxable Amount: $28,000 - $4,000 - $2,000 + $600 = $22,600
- Tax: $22,600 × 0.10 = $2,260
- Financed Principal: $28,000 - $4,000 - $2,000 + $600 + $2,260 = **$24,860**

## Testing

The service includes comprehensive unit tests covering:

- All Canadian provinces and territories
- Fee inclusion/exclusion scenarios
- Trade-in calculations
- Custom tax rates
- Edge cases (negative values, exceeding amounts, etc.)
- Case-insensitive region matching
- Null/empty region handling

Run tests:
```bash
dotnet test --filter "FullyQualifiedName~Financing"
```

## Notes

- All monetary values should be in decimal format for precision
- Trade-in values are always represented as positive numbers (they reduce the principal)
- Tax rates are stored as decimals (e.g., 0.13 for 13%)
- Unknown or null regions default to 0% tax rate
- Custom tax rates override regional defaults when provided
