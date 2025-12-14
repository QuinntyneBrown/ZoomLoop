import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisonWidget, LoanScenario } from './comparison-widget';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ComparisonWidget', () => {
  let component: ComparisonWidget;
  let fixture: ComponentFixture<ComparisonWidget>;
  let compiled: DebugElement;

  const mockPrimaryScenario: LoanScenario = {
    term: 60,
    rate: 5.0,
    principal: 30000
  };

  const mockSecondaryScenario: LoanScenario = {
    term: 48,
    rate: 4.5,
    principal: 30000
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonWidget);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Initialization', () => {
    it('should create the comparison widget component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.primaryScenario).toBeUndefined();
      expect(component.secondaryScenario).toBeUndefined();
      expect(component.activeScenario).toBe('primary');
    });

    it('should set primaryScenario from input', () => {
      component.primaryScenario = mockPrimaryScenario;
      fixture.detectChanges();
      expect(component.primaryScenario).toEqual(mockPrimaryScenario);
    });

    it('should set secondaryScenario from input', () => {
      component.secondaryScenario = mockSecondaryScenario;
      fixture.detectChanges();
      expect(component.secondaryScenario).toEqual(mockSecondaryScenario);
    });

    it('should set activeScenario from input', () => {
      component.activeScenario = 'secondary';
      fixture.detectChanges();
      expect(component.activeScenario).toBe('secondary');
    });
  });

  describe('Monthly Payment Calculation', () => {
    it('should calculate monthly payment correctly for standard scenario', () => {
      const payment = component.calculateMonthlyPayment(mockPrimaryScenario);
      expect(payment).toBeGreaterThan(0);
      expect(payment).toBeCloseTo(566.14, 1);
    });

    it('should calculate monthly payment for different term', () => {
      const payment = component.calculateMonthlyPayment(mockSecondaryScenario);
      expect(payment).toBeGreaterThan(0);
      expect(payment).toBeCloseTo(684.10, 1);
    });

    it('should handle zero interest rate', () => {
      const zeroRateScenario: LoanScenario = {
        term: 60,
        rate: 0,
        principal: 30000
      };
      const payment = component.calculateMonthlyPayment(zeroRateScenario);
      expect(payment).toBe(500); // 30000 / 60
    });

    it('should return 0 for invalid scenario', () => {
      const invalidScenario: LoanScenario = {
        term: 0,
        rate: 5.0,
        principal: 30000
      };
      const payment = component.calculateMonthlyPayment(invalidScenario);
      expect(payment).toBe(0);
    });

    it('should return 0 for negative rate', () => {
      const invalidScenario: LoanScenario = {
        term: 60,
        rate: -5.0,
        principal: 30000
      };
      const payment = component.calculateMonthlyPayment(invalidScenario);
      expect(payment).toBe(0);
    });
  });

  describe('Total Interest Calculation', () => {
    it('should calculate total interest correctly', () => {
      const interest = component.calculateTotalInterest(mockPrimaryScenario);
      expect(interest).toBeGreaterThan(0);
      expect(interest).toBeCloseTo(3968.22, 0);
    });

    it('should calculate different interest for different scenario', () => {
      const interest = component.calculateTotalInterest(mockSecondaryScenario);
      expect(interest).toBeGreaterThan(0);
      expect(interest).toBeCloseTo(2837.02, 0);
    });

    it('should return 0 for undefined scenario', () => {
      const interest = component.calculateTotalInterest(undefined as any);
      expect(interest).toBe(0);
    });
  });

  describe('Comparison Calculations', () => {
    beforeEach(() => {
      component.primaryScenario = mockPrimaryScenario;
      component.secondaryScenario = mockSecondaryScenario;
      fixture.detectChanges();
    });

    it('should get primary comparison values', () => {
      const comparison = component.primaryComparison();
      expect(comparison).toBeTruthy();
      expect(comparison?.monthlyPayment).toBeGreaterThan(0);
      expect(comparison?.totalInterest).toBeGreaterThan(0);
      expect(comparison?.totalPaid).toBeGreaterThan(0);
    });

    it('should get secondary comparison values', () => {
      const comparison = component.secondaryComparison();
      expect(comparison).toBeTruthy();
      expect(comparison?.monthlyPayment).toBeGreaterThan(0);
      expect(comparison?.totalInterest).toBeGreaterThan(0);
      expect(comparison?.totalPaid).toBeGreaterThan(0);
    });

    it('should return null when primary scenario is not set', () => {
      component.primaryScenario = undefined;
      fixture.detectChanges();
      const comparison = component.primaryComparison();
      expect(comparison).toBeNull();
    });

    it('should return null when secondary scenario is not set', () => {
      component.secondaryScenario = undefined;
      fixture.detectChanges();
      const comparison = component.secondaryComparison();
      expect(comparison).toBeNull();
    });
  });

  describe('Delta Calculations', () => {
    beforeEach(() => {
      component.primaryScenario = mockPrimaryScenario;
      component.secondaryScenario = mockSecondaryScenario;
      fixture.detectChanges();
    });

    it('should calculate monthly payment delta', () => {
      const delta = component.monthlyPaymentDelta();
      expect(delta).toBeGreaterThan(0); // Secondary has higher monthly payment
    });

    it('should calculate total interest delta', () => {
      const delta = component.totalInterestDelta();
      expect(delta).toBeLessThan(0); // Secondary has lower total interest
    });

    it('should return 0 delta when scenarios are missing', () => {
      component.secondaryScenario = undefined;
      fixture.detectChanges();
      const monthlyDelta = component.monthlyPaymentDelta();
      const interestDelta = component.totalInterestDelta();
      expect(monthlyDelta).toBe(0);
      expect(interestDelta).toBe(0);
    });
  });

  describe('Scenario Switching', () => {
    beforeEach(() => {
      component.primaryScenario = mockPrimaryScenario;
      component.secondaryScenario = mockSecondaryScenario;
      fixture.detectChanges();
    });

    it('should emit scenarioSwitch event when switching scenarios', () => {
      const emitSpy = vi.spyOn(component.scenarioSwitch, 'emit');
      component.switchScenarios();
      expect(emitSpy).toHaveBeenCalledWith({
        primary: mockSecondaryScenario,
        secondary: mockPrimaryScenario
      });
    });

    it('should not emit when scenarios are missing', () => {
      component.primaryScenario = undefined;
      const emitSpy = vi.spyOn(component.scenarioSwitch, 'emit');
      component.switchScenarios();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Active Scenario Management', () => {
    it('should emit activeScenarioChange when setting different scenario', () => {
      component.activeScenario = 'primary';
      const emitSpy = vi.spyOn(component.activeScenarioChange, 'emit');
      component.setActiveScenario('secondary');
      expect(emitSpy).toHaveBeenCalledWith('secondary');
    });

    it('should not emit when setting same scenario', () => {
      component.activeScenario = 'primary';
      const emitSpy = vi.spyOn(component.activeScenarioChange, 'emit');
      component.setActiveScenario('primary');
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Formatting Functions', () => {
    it('should format currency correctly', () => {
      const formatted = component.formatCurrency(1234.56);
      expect(formatted).toBe('$1,234.56');
    });

    it('should format negative currency correctly', () => {
      const formatted = component.formatCurrency(-1234.56);
      expect(formatted).toBe('-$1,234.56');
    });

    it('should format zero correctly', () => {
      const formatted = component.formatCurrency(0);
      expect(formatted).toBe('$0.00');
    });

    it('should format percentage correctly', () => {
      const formatted = component.formatPercentage(5.5);
      expect(formatted).toBe('5.50%');
    });

    it('should format whole number percentage correctly', () => {
      const formatted = component.formatPercentage(5);
      expect(formatted).toBe('5.00%');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.primaryScenario = mockPrimaryScenario;
      component.secondaryScenario = mockSecondaryScenario;
      fixture.detectChanges();
    });

    it('should render comparison widget container', () => {
      const widget = compiled.query(By.css('.comparison-widget'));
      expect(widget).toBeTruthy();
    });

    it('should render title', () => {
      const title = compiled.query(By.css('.comparison-widget__title'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Loan Comparison');
    });

    it('should render switch button when both scenarios present', () => {
      const switchBtn = compiled.query(By.css('.comparison-widget__switch-btn'));
      expect(switchBtn).toBeTruthy();
    });

    it('should not render switch button when scenarios missing', () => {
      fixture.componentRef.setInput('primaryScenario', undefined);
      fixture.componentRef.setInput('secondaryScenario', undefined);
      fixture.detectChanges();
      const switchBtn = compiled.query(By.css('.comparison-widget__switch-btn'));
      expect(switchBtn).toBeFalsy();
    });

    it('should render primary scenario details', () => {
      const primaryScenario = compiled.query(By.css('.comparison-widget__scenario--primary'));
      expect(primaryScenario).toBeTruthy();
    });

    it('should render secondary scenario details', () => {
      const secondaryScenario = compiled.query(By.css('.comparison-widget__scenario--secondary'));
      expect(secondaryScenario).toBeTruthy();
    });

    it('should render delta section when both scenarios present', () => {
      const delta = compiled.query(By.css('.comparison-widget__delta'));
      expect(delta).toBeTruthy();
    });

    it('should not render delta section when scenarios missing', () => {
      fixture.componentRef.setInput('primaryScenario', undefined);
      fixture.componentRef.setInput('secondaryScenario', undefined);
      fixture.detectChanges();
      const delta = compiled.query(By.css('.comparison-widget__delta'));
      expect(delta).toBeFalsy();
    });

    it('should display active badge on active scenario', () => {
      component.activeScenario = 'primary';
      fixture.detectChanges();
      const primaryBadge = compiled.query(By.css('.comparison-widget__scenario--primary .comparison-widget__active-badge'));
      expect(primaryBadge).toBeTruthy();
    });

    it('should apply active class to active scenario', () => {
      fixture.componentRef.setInput('activeScenario', 'secondary');
      fixture.detectChanges();
      const secondaryScenario = compiled.query(By.css('.comparison-widget__scenario--secondary'));
      expect(secondaryScenario.nativeElement.classList.contains('comparison-widget__scenario--active')).toBe(true);
    });

    it('should display empty state when primary scenario not set', () => {
      fixture.componentRef.setInput('primaryScenario', undefined);
      fixture.detectChanges();
      const empty = compiled.query(By.css('.comparison-widget__scenario--primary .comparison-widget__empty'));
      expect(empty).toBeTruthy();
      expect(empty.nativeElement.textContent.trim()).toBe('No primary scenario set');
    });

    it('should display empty state when secondary scenario not set', () => {
      fixture.componentRef.setInput('secondaryScenario', undefined);
      fixture.detectChanges();
      const empty = compiled.query(By.css('.comparison-widget__scenario--secondary .comparison-widget__empty'));
      expect(empty).toBeTruthy();
      expect(empty.nativeElement.textContent.trim()).toBe('No secondary scenario set');
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.primaryScenario = mockPrimaryScenario;
      component.secondaryScenario = mockSecondaryScenario;
      component.activeScenario = 'primary';
      fixture.detectChanges();
    });

    it('should switch scenarios when switch button clicked', () => {
      const emitSpy = vi.spyOn(component.scenarioSwitch, 'emit');
      const switchBtn = compiled.query(By.css('.comparison-widget__switch-btn'));
      switchBtn.nativeElement.click();
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should set active scenario when primary scenario clicked', () => {
      component.activeScenario = 'secondary';
      fixture.detectChanges();
      const emitSpy = vi.spyOn(component.activeScenarioChange, 'emit');
      const primaryScenario = compiled.query(By.css('.comparison-widget__scenario--primary'));
      primaryScenario.nativeElement.click();
      expect(emitSpy).toHaveBeenCalledWith('primary');
    });

    it('should set active scenario when secondary scenario clicked', () => {
      const emitSpy = vi.spyOn(component.activeScenarioChange, 'emit');
      const secondaryScenario = compiled.query(By.css('.comparison-widget__scenario--secondary'));
      secondaryScenario.nativeElement.click();
      expect(emitSpy).toHaveBeenCalledWith('secondary');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.primaryScenario = mockPrimaryScenario;
      component.secondaryScenario = mockSecondaryScenario;
      fixture.detectChanges();
    });

    it('should have role="button" on scenario cards', () => {
      const scenarios = compiled.queryAll(By.css('.comparison-widget__scenario'));
      scenarios.forEach(scenario => {
        expect(scenario.nativeElement.getAttribute('role')).toBe('button');
      });
    });

    it('should have tabindex on scenario cards', () => {
      const scenarios = compiled.queryAll(By.css('.comparison-widget__scenario'));
      scenarios.forEach(scenario => {
        expect(scenario.nativeElement.getAttribute('tabindex')).toBe('0');
      });
    });

    it('should have aria-pressed on active scenario', () => {
      component.activeScenario = 'primary';
      fixture.detectChanges();
      const primaryScenario = compiled.query(By.css('.comparison-widget__scenario--primary'));
      expect(primaryScenario.nativeElement.getAttribute('aria-pressed')).toBe('true');
    });

    it('should have aria-label on switch button', () => {
      const switchBtn = compiled.query(By.css('.comparison-widget__switch-btn'));
      expect(switchBtn.nativeElement.getAttribute('aria-label')).toBe('Switch primary and secondary scenarios');
    });

    it('should have aria-label on active badge', () => {
      component.activeScenario = 'primary';
      fixture.detectChanges();
      const badge = compiled.query(By.css('.comparison-widget__active-badge'));
      expect(badge.nativeElement.getAttribute('aria-label')).toBe('Active scenario');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large principal amount', () => {
      const largeScenario: LoanScenario = {
        term: 60,
        rate: 5.0,
        principal: 1000000
      };
      const payment = component.calculateMonthlyPayment(largeScenario);
      expect(payment).toBeGreaterThan(0);
      expect(payment).toBeCloseTo(18871.23, 1);
    });

    it('should handle very small principal amount', () => {
      const smallScenario: LoanScenario = {
        term: 60,
        rate: 5.0,
        principal: 100
      };
      const payment = component.calculateMonthlyPayment(smallScenario);
      expect(payment).toBeGreaterThan(0);
      expect(payment).toBeCloseTo(1.89, 1);
    });

    it('should handle very high interest rate', () => {
      const highRateScenario: LoanScenario = {
        term: 60,
        rate: 25.0,
        principal: 30000
      };
      const payment = component.calculateMonthlyPayment(highRateScenario);
      expect(payment).toBeGreaterThan(0);
    });

    it('should handle very low interest rate', () => {
      const lowRateScenario: LoanScenario = {
        term: 60,
        rate: 0.1,
        principal: 30000
      };
      const payment = component.calculateMonthlyPayment(lowRateScenario);
      expect(payment).toBeGreaterThan(0);
    });

    it('should handle short term', () => {
      const shortTermScenario: LoanScenario = {
        term: 12,
        rate: 5.0,
        principal: 30000
      };
      const payment = component.calculateMonthlyPayment(shortTermScenario);
      expect(payment).toBeGreaterThan(0);
    });

    it('should handle long term', () => {
      const longTermScenario: LoanScenario = {
        term: 360,
        rate: 5.0,
        principal: 30000
      };
      const payment = component.calculateMonthlyPayment(longTermScenario);
      expect(payment).toBeGreaterThan(0);
    });
  });
});
