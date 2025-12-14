import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmortizationSchedule } from './amortization-schedule';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AmortizationSchedule', () => {
  let component: AmortizationSchedule;
  let fixture: ComponentFixture<AmortizationSchedule>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortizationSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(AmortizationSchedule);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.loanAmount).toBe(0);
      expect(component.interestRate).toBe(0);
      expect(component.loanTermMonths).toBe(0);
      expect(component.monthlyPayment).toBe(0);
      expect(component.isExpanded()).toBe(false);
      expect(component.schedule()).toEqual([]);
    });

    it('should render toggle button', () => {
      const toggleButton = compiled.query(By.css('.schedule-toggle'));
      expect(toggleButton).toBeTruthy();
    });
  });

  describe('Schedule Calculation', () => {
    it('should calculate amortization schedule correctly', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();

      const schedule = component.schedule();
      expect(schedule.length).toBe(12);
      expect(schedule[0].paymentNumber).toBe(1);
      expect(schedule[11].paymentNumber).toBe(12);
    });

    it('should have decreasing balance over time', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();

      const schedule = component.schedule();
      for (let i = 1; i < schedule.length; i++) {
        expect(schedule[i].remainingBalance).toBeLessThan(schedule[i - 1].remainingBalance);
      }
    });

    it('should have final balance near zero', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();

      const schedule = component.schedule();
      const finalBalance = schedule[schedule.length - 1].remainingBalance;
      expect(finalBalance).toBeCloseTo(0, 0);
    });

    it('should calculate total principal and interest', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();

      expect(component.totalPrincipal()).toBeCloseTo(10000, 0);
      expect(component.totalInterest()).toBeGreaterThan(0);
    });

    it('should handle zero interest rate', () => {
      fixture.componentRef.setInput('loanAmount', 12000);
      fixture.componentRef.setInput('interestRate', 0);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();

      const schedule = component.schedule();
      expect(schedule.length).toBe(12);
      expect(schedule[0].principal).toBeCloseTo(1000, 0);
      expect(schedule[0].interest).toBe(0);
    });

    it('should use provided monthly payment if given', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.componentRef.setInput('monthlyPayment', 900);
      fixture.detectChanges();

      const schedule = component.schedule();
      expect(schedule[0].totalPayment).toBe(900);
    });

    it('should handle large loan amounts', () => {
      fixture.componentRef.setInput('loanAmount', 500000);
      fixture.componentRef.setInput('interestRate', 3.5);
      fixture.componentRef.setInput('loanTermMonths', 360);
      fixture.detectChanges();

      const schedule = component.schedule();
      expect(schedule.length).toBe(360);
      expect(component.totalPrincipal()).toBeCloseTo(500000, 0);
    });
  });

  describe('Toggle Functionality', () => {
    it('should toggle expanded state', () => {
      expect(component.isExpanded()).toBe(false);
      
      component.toggleExpanded();
      expect(component.isExpanded()).toBe(true);
      
      component.toggleExpanded();
      expect(component.isExpanded()).toBe(false);
    });

    it('should toggle on button click', () => {
      const toggleButton = compiled.query(By.css('.schedule-toggle'));
      
      expect(component.isExpanded()).toBe(false);
      toggleButton.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.isExpanded()).toBe(true);
    });

    it('should update aria-expanded attribute', () => {
      const toggleButton = compiled.query(By.css('.schedule-toggle'));
      
      expect(toggleButton.nativeElement.getAttribute('aria-expanded')).toBe('false');
      
      toggleButton.nativeElement.click();
      fixture.detectChanges();
      
      expect(toggleButton.nativeElement.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();
    });

    it('should not show schedule content when collapsed', () => {
      const scheduleContent = compiled.query(By.css('.schedule-content'));
      expect(scheduleContent).toBeFalsy();
    });

    it('should show schedule content when expanded', () => {
      component.toggleExpanded();
      fixture.detectChanges();
      
      const scheduleContent = compiled.query(By.css('.schedule-content'));
      expect(scheduleContent).toBeTruthy();
    });

    it('should display toggle summary when collapsed', () => {
      const toggleSummary = compiled.query(By.css('.toggle-summary'));
      expect(toggleSummary).toBeTruthy();
      expect(toggleSummary.nativeElement.textContent).toContain('12 payments');
    });

    it('should render schedule table when expanded', () => {
      component.toggleExpanded();
      fixture.detectChanges();
      
      const table = compiled.query(By.css('.schedule-table'));
      expect(table).toBeTruthy();
    });

    it('should render correct number of payment rows', () => {
      component.toggleExpanded();
      fixture.detectChanges();
      
      const rows = compiled.queryAll(By.css('.schedule-table tbody tr'));
      expect(rows.length).toBe(12);
    });

    it('should display totals section', () => {
      component.toggleExpanded();
      fixture.detectChanges();
      
      const totals = compiled.query(By.css('.schedule-totals'));
      expect(totals).toBeTruthy();
    });

    it('should display total principal', () => {
      component.toggleExpanded();
      fixture.detectChanges();
      
      const totalsText = compiled.query(By.css('.schedule-totals')).nativeElement.textContent;
      expect(totalsText).toContain('Total Principal');
    });

    it('should display total interest', () => {
      component.toggleExpanded();
      fixture.detectChanges();
      
      const totalsText = compiled.query(By.css('.schedule-totals')).nativeElement.textContent;
      expect(totalsText).toContain('Total Interest');
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      expect(component.formatCurrency(1000)).toBe('$1,000.00');
      expect(component.formatCurrency(1234.56)).toBe('$1,234.56');
      expect(component.formatCurrency(0)).toBe('$0.00');
    });

    it('should format negative values', () => {
      expect(component.formatCurrency(-100)).toBe('-$100.00');
    });

    it('should format large numbers', () => {
      expect(component.formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero loan amount', () => {
      fixture.componentRef.setInput('loanAmount', 0);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();

      expect(component.schedule()).toEqual([]);
    });

    it('should handle zero term', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 0);
      fixture.detectChanges();

      expect(component.schedule()).toEqual([]);
    });

    it('should show empty message when no schedule', () => {
      component.toggleExpanded();
      fixture.detectChanges();
      
      const emptyMessage = compiled.query(By.css('.schedule-empty'));
      expect(emptyMessage).toBeTruthy();
    });

    it('should recalculate on input changes', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      fixture.detectChanges();

      const firstSchedule = component.schedule();
      
      fixture.componentRef.setInput('loanAmount', 20000);
      fixture.detectChanges();

      const secondSchedule = component.schedule();
      expect(secondSchedule[0].totalPayment).not.toBe(firstSchedule[0].totalPayment);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-controls on toggle button', () => {
      const toggleButton = compiled.query(By.css('.schedule-toggle'));
      expect(toggleButton.nativeElement.getAttribute('aria-controls')).toBe('schedule-content');
    });

    it('should have table role on table', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      component.toggleExpanded();
      fixture.detectChanges();
      
      const table = compiled.query(By.css('.schedule-table'));
      expect(table.nativeElement.getAttribute('role')).toBe('table');
    });

    it('should have proper scope on table headers', () => {
      fixture.componentRef.setInput('loanAmount', 10000);
      fixture.componentRef.setInput('interestRate', 5);
      fixture.componentRef.setInput('loanTermMonths', 12);
      component.toggleExpanded();
      fixture.detectChanges();
      
      const headers = compiled.queryAll(By.css('.schedule-table th'));
      headers.forEach(header => {
        expect(header.nativeElement.getAttribute('scope')).toBe('col');
      });
    });
  });

  describe('Performance', () => {
    it('should handle calculation of 360 month schedule efficiently', () => {
      const startTime = performance.now();
      
      fixture.componentRef.setInput('loanAmount', 300000);
      fixture.componentRef.setInput('interestRate', 4);
      fixture.componentRef.setInput('loanTermMonths', 360);
      fixture.detectChanges();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(component.schedule().length).toBe(360);
      expect(duration).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should use lazy rendering with collapsed state', () => {
      fixture.componentRef.setInput('loanAmount', 300000);
      fixture.componentRef.setInput('interestRate', 4);
      fixture.componentRef.setInput('loanTermMonths', 360);
      fixture.detectChanges();
      
      // When collapsed, the table should not be rendered
      const table = compiled.query(By.css('.schedule-table'));
      expect(table).toBeFalsy();
    });
  });

  describe('Integration', () => {
    it('should work with typical car loan values', () => {
      fixture.componentRef.setInput('loanAmount', 25000);
      fixture.componentRef.setInput('interestRate', 3.9);
      fixture.componentRef.setInput('loanTermMonths', 60);
      fixture.detectChanges();

      const schedule = component.schedule();
      expect(schedule.length).toBe(60);
      expect(component.totalPrincipal()).toBeCloseTo(25000, 0);
      expect(schedule[59].remainingBalance).toBeCloseTo(0, 0);
    });

    it('should work with typical mortgage values', () => {
      fixture.componentRef.setInput('loanAmount', 400000);
      fixture.componentRef.setInput('interestRate', 3.5);
      fixture.componentRef.setInput('loanTermMonths', 360);
      fixture.detectChanges();

      const schedule = component.schedule();
      expect(schedule.length).toBe(360);
      expect(component.totalPrincipal()).toBeCloseTo(400000, 0);
      expect(schedule[359].remainingBalance).toBeCloseTo(0, 0);
    });
  });
});
