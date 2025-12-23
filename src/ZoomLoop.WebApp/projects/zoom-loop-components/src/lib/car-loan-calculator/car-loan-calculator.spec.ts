import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarLoanCalculator, CarLoanCalculation } from './car-loan-calculator';

describe('CarLoanCalculator', () => {
  let component: CarLoanCalculator;
  let fixture: ComponentFixture<CarLoanCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarLoanCalculator],
    }).compileComponents();

    fixture = TestBed.createComponent(CarLoanCalculator);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should have default title', () => {
      expect(component.title()).toBe('Car Loan Calculator');
    });

    it('should have default subtitle', () => {
      expect(component.subtitle()).toBe('Estimate your payment and what you can afford');
    });

    it('should have default vehicle price range', () => {
      expect(component.minVehiclePrice()).toBe(5000);
      expect(component.maxVehiclePrice()).toBe(100000);
    });

    it('should have default interest rate range', () => {
      expect(component.minInterestRate()).toBe(0);
      expect(component.maxInterestRate()).toBe(25);
    });

    it('should have default loan term range in months', () => {
      expect(component.minLoanTermMonths()).toBe(12);
      expect(component.maxLoanTermMonths()).toBe(96);
    });

    it('should show apply button by default', () => {
      expect(component.showApplyButton()).toBe(true);
    });

    it('should have default apply button text', () => {
      expect(component.applyButtonText()).toBe('Get Pre-Approved');
    });
  });

  describe('state initialization', () => {
    it('should initialize signals with input values after stable', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      // Wait for setTimeout in constructor
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(component.vehiclePrice()).toBe(25000);
      expect(component.downPayment()).toBe(0);
      expect(component.tradeInValue()).toBe(0);
      expect(component.interestRate()).toBe(8.99);
      expect(component.loanTermMonths()).toBe(60);
      expect(component.paymentFrequency()).toBe('monthly');
    });
  });

  describe('maxDownPayment calculation', () => {
    it('should calculate max down payment as 90% of vehicle price', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));

      component.vehiclePrice.set(30000);
      expect(component.maxDownPayment()).toBe(27000);
    });

    it('should return 0 if vehicle price is 0', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));

      component.vehiclePrice.set(0);
      expect(component.maxDownPayment()).toBe(0);
    });
  });

  describe('loan calculation', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    it('should calculate monthly payment correctly', async () => {
      component.vehiclePrice.set(20000);
      component.downPayment.set(0);
      component.tradeInValue.set(0);
      component.interestRate.set(6.15);
      component.loanTermMonths.set(60);
      component.paymentFrequency.set('monthly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();

      // Using amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      // P = 20000, r = 0.0615/12 = 0.005125, n = 60
      // Expected: ~$388.05
      expect(calc.paymentAmount).toBeCloseTo(388.05, 0);
      expect(calc.effectiveLoanAmount).toBe(20000);
      expect(calc.numberOfPayments).toBe(60);
    });

    it('should calculate bi-weekly payment correctly', async () => {
      component.vehiclePrice.set(20000);
      component.downPayment.set(0);
      component.tradeInValue.set(0);
      component.interestRate.set(6.15);
      component.loanTermMonths.set(60);
      component.paymentFrequency.set('bi-weekly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();

      // Bi-weekly has 26 payments per year, 5 years = 130 payments
      expect(calc.numberOfPayments).toBe(130);
      // Bi-weekly payment should be roughly half of monthly
      expect(calc.paymentAmount).toBeLessThan(200);
      expect(calc.paymentAmount).toBeGreaterThan(150);
    });

    it('should subtract down payment from loan amount', async () => {
      component.vehiclePrice.set(25000);
      component.downPayment.set(5000);
      component.tradeInValue.set(0);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.effectiveLoanAmount).toBe(20000);
    });

    it('should subtract trade-in value from loan amount', async () => {
      component.vehiclePrice.set(25000);
      component.downPayment.set(0);
      component.tradeInValue.set(3000);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.effectiveLoanAmount).toBe(22000);
    });

    it('should subtract both down payment and trade-in from loan amount', async () => {
      component.vehiclePrice.set(30000);
      component.downPayment.set(5000);
      component.tradeInValue.set(3000);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.effectiveLoanAmount).toBe(22000);
    });

    it('should handle zero interest rate', async () => {
      component.vehiclePrice.set(12000);
      component.downPayment.set(0);
      component.tradeInValue.set(0);
      component.interestRate.set(0);
      component.loanTermMonths.set(60);
      component.paymentFrequency.set('monthly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.paymentAmount).toBe(200); // 12000 / 60
      expect(calc.totalInterest).toBe(0);
      expect(calc.totalLoanCost).toBe(12000);
    });

    it('should handle zero loan amount', async () => {
      component.vehiclePrice.set(10000);
      component.downPayment.set(10000);
      component.tradeInValue.set(0);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.paymentAmount).toBe(0);
      expect(calc.effectiveLoanAmount).toBe(0);
    });

    it('should handle negative effective loan amount', async () => {
      component.vehiclePrice.set(10000);
      component.downPayment.set(5000);
      component.tradeInValue.set(8000);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.paymentAmount).toBe(0);
      expect(calc.effectiveLoanAmount).toBe(0);
    });

    it('should calculate total interest correctly', async () => {
      component.vehiclePrice.set(20000);
      component.downPayment.set(0);
      component.tradeInValue.set(0);
      component.interestRate.set(8.99);
      component.loanTermMonths.set(60);
      component.paymentFrequency.set('monthly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();

      // Total interest = total cost - principal (use toBeCloseTo for float precision)
      expect(calc.totalInterest).toBeCloseTo(calc.totalLoanCost - calc.effectiveLoanAmount, 2);
      expect(calc.totalInterest).toBeGreaterThan(0);
    });

    it('should calculate total loan cost correctly', async () => {
      component.vehiclePrice.set(20000);
      component.downPayment.set(0);
      component.tradeInValue.set(0);
      component.interestRate.set(8.99);
      component.loanTermMonths.set(60);
      component.paymentFrequency.set('monthly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();

      // Total cost = payment * number of payments
      expect(calc.totalLoanCost).toBeCloseTo(calc.paymentAmount * calc.numberOfPayments, 1);
    });
  });

  describe('payment frequency switching', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    it('should switch from monthly to bi-weekly', async () => {
      component.paymentFrequency.set('monthly');
      await fixture.whenStable();
      expect(component.paymentFrequency()).toBe('monthly');

      component.paymentFrequency.set('bi-weekly');
      await fixture.whenStable();
      expect(component.paymentFrequency()).toBe('bi-weekly');
    });

    it('should have more payments with bi-weekly frequency', async () => {
      component.vehiclePrice.set(20000);
      component.loanTermMonths.set(60);

      component.paymentFrequency.set('monthly');
      await fixture.whenStable();
      fixture.detectChanges();
      const monthlyPayments = component.calculation().numberOfPayments;

      component.paymentFrequency.set('bi-weekly');
      await fixture.whenStable();
      fixture.detectChanges();
      const biWeeklyPayments = component.calculation().numberOfPayments;

      expect(biWeeklyPayments).toBeGreaterThan(monthlyPayments);
      expect(monthlyPayments).toBe(60);
      expect(biWeeklyPayments).toBe(130); // 26 * 5 years
    });
  });

  describe('output events', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    it('should emit calculationChange when calculation updates', async () => {
      const spy = vi.fn();
      component.calculationChange.subscribe(spy);

      component.vehiclePrice.set(30000);
      await fixture.whenStable();
      fixture.detectChanges();

      // Access calculation to trigger the computed
      component.calculation();

      expect(spy).toHaveBeenCalled();
    });

    it('should emit applyClicked with calculation when apply button clicked', async () => {
      const spy = vi.fn();
      component.applyClicked.subscribe(spy);

      component.vehiclePrice.set(20000);
      await fixture.whenStable();
      fixture.detectChanges();

      component.onApplyClick();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          effectiveLoanAmount: 20000,
        })
      );
    });
  });

  describe('DOM rendering', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));
      fixture.detectChanges();
    });

    it('should render the calculator title', () => {
      const titleEl = fixture.nativeElement.querySelector('.car-loan-calculator__title');
      expect(titleEl.textContent).toContain('Car Loan Calculator');
    });

    it('should render the calculator subtitle', () => {
      const subtitleEl = fixture.nativeElement.querySelector('.car-loan-calculator__subtitle');
      expect(subtitleEl.textContent).toContain('Estimate your payment');
    });

    it('should render vehicle price input', () => {
      const input = fixture.nativeElement.querySelector('#vehiclePrice');
      expect(input).toBeTruthy();
    });

    it('should render down payment input', () => {
      const input = fixture.nativeElement.querySelector('#downPayment');
      expect(input).toBeTruthy();
    });

    it('should render trade-in value input', () => {
      const input = fixture.nativeElement.querySelector('#tradeInValue');
      expect(input).toBeTruthy();
    });

    it('should render interest rate input', () => {
      const input = fixture.nativeElement.querySelector('#interestRate');
      expect(input).toBeTruthy();
    });

    it('should render loan term input', () => {
      const input = fixture.nativeElement.querySelector('#loanTerm');
      expect(input).toBeTruthy();
    });

    it('should render payment frequency toggle buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll(
        '.car-loan-calculator__frequency-btn'
      );
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent.trim()).toBe('Monthly');
      expect(buttons[1].textContent.trim()).toBe('Bi-weekly');
    });

    it('should render results section', () => {
      const resultsSection = fixture.nativeElement.querySelector(
        '.car-loan-calculator__results'
      );
      expect(resultsSection).toBeTruthy();
    });

    it('should render apply button when showApplyButton is true', () => {
      const button = fixture.nativeElement.querySelector('.car-loan-calculator__apply-btn');
      expect(button).toBeTruthy();
      expect(button.textContent.trim()).toBe('Get Pre-Approved');
    });

    it('should highlight active frequency button', async () => {
      component.paymentFrequency.set('monthly');
      await fixture.whenStable();
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll(
        '.car-loan-calculator__frequency-btn'
      );
      expect(buttons[0].classList.contains('car-loan-calculator__frequency-btn--active')).toBe(
        true
      );
      expect(buttons[1].classList.contains('car-loan-calculator__frequency-btn--active')).toBe(
        false
      );

      component.paymentFrequency.set('bi-weekly');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(buttons[0].classList.contains('car-loan-calculator__frequency-btn--active')).toBe(
        false
      );
      expect(buttons[1].classList.contains('car-loan-calculator__frequency-btn--active')).toBe(
        true
      );
    });
  });

  describe('slider inputs', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));
      fixture.detectChanges();
    });

    it('should have range sliders for all numeric inputs', () => {
      const sliders = fixture.nativeElement.querySelectorAll('.car-loan-calculator__slider');
      expect(sliders.length).toBe(5); // vehiclePrice, downPayment, tradeIn, interestRate, loanTerm
    });

    it('should have input fields for all numeric values', () => {
      const inputs = fixture.nativeElement.querySelectorAll('.car-loan-calculator__input');
      expect(inputs.length).toBe(5);
    });
  });

  describe('edge cases', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    it('should handle very high interest rates', async () => {
      component.vehiclePrice.set(20000);
      component.interestRate.set(25);
      component.loanTermMonths.set(60);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.paymentAmount).toBeGreaterThan(0);
      expect(calc.totalInterest).toBeGreaterThan(calc.effectiveLoanAmount * 0.5);
    });

    it('should handle very short loan terms', async () => {
      component.vehiclePrice.set(12000);
      component.interestRate.set(8.99);
      component.loanTermMonths.set(12);
      component.paymentFrequency.set('monthly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.numberOfPayments).toBe(12);
      expect(calc.paymentAmount).toBeGreaterThan(1000);
    });

    it('should handle very long loan terms', async () => {
      component.vehiclePrice.set(50000);
      component.interestRate.set(8.99);
      component.loanTermMonths.set(96);
      component.paymentFrequency.set('monthly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      expect(calc.numberOfPayments).toBe(96);
      expect(calc.totalInterest).toBeGreaterThan(10000);
    });

    it('should round payment amounts to 2 decimal places', async () => {
      component.vehiclePrice.set(17531);
      component.interestRate.set(7.77);
      component.loanTermMonths.set(48);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();
      const decimalPlaces = (calc.paymentAmount.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('calculation accuracy', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    it('should match expected calculation for Clutch example', async () => {
      // From Clutch.ca: $20,000 at 6.15% APR for 60 months = $388.05/month
      component.vehiclePrice.set(20000);
      component.downPayment.set(0);
      component.tradeInValue.set(0);
      component.interestRate.set(6.15);
      component.loanTermMonths.set(60);
      component.paymentFrequency.set('monthly');

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();

      // Monthly payment should be approximately $388.05
      expect(calc.paymentAmount).toBeCloseTo(388.05, 0);

      // Total cost should be approximately $23,283.15
      expect(calc.totalLoanCost).toBeCloseTo(23283, 0);

      // Total interest should be approximately $3,283.15
      expect(calc.totalInterest).toBeCloseTo(3283, 0);
    });

    it('should maintain mathematical consistency', async () => {
      component.vehiclePrice.set(25000);
      component.downPayment.set(2500);
      component.tradeInValue.set(2500);
      component.interestRate.set(10);
      component.loanTermMonths.set(48);

      await fixture.whenStable();
      fixture.detectChanges();

      const calc = component.calculation();

      // Verify mathematical relationships
      expect(calc.effectiveLoanAmount).toBe(20000);
      expect(calc.totalLoanCost).toBeCloseTo(calc.effectiveLoanAmount + calc.totalInterest, 1);
      expect(calc.totalLoanCost).toBeCloseTo(calc.paymentAmount * calc.numberOfPayments, 0);
    });
  });
});
