import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryCard } from './summary-card';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SummaryCard', () => {
  let component: SummaryCard;
  let fixture: ComponentFixture<SummaryCard>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCard);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Initialization', () => {
    it('should create the summary card component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.monthlyPayment).toBe(0);
      expect(component.totalPaid).toBe(0);
      expect(component.totalInterest).toBe(0);
      expect(component.financedPrincipal).toBe(0);
      expect(component.term).toBe(0);
      expect(component.apr).toBe(0);
      expect(component.taxesAndFees).toBe(0);
      expect(component.sticky).toBe(true);
    });

    it('should accept monthlyPayment input', () => {
      component.monthlyPayment = 500;
      fixture.detectChanges();
      expect(component.monthlyPayment).toBe(500);
    });

    it('should accept totalPaid input', () => {
      component.totalPaid = 30000;
      fixture.detectChanges();
      expect(component.totalPaid).toBe(30000);
    });

    it('should accept totalInterest input', () => {
      component.totalInterest = 5000;
      fixture.detectChanges();
      expect(component.totalInterest).toBe(5000);
    });

    it('should accept financedPrincipal input', () => {
      component.financedPrincipal = 25000;
      fixture.detectChanges();
      expect(component.financedPrincipal).toBe(25000);
    });

    it('should accept term input', () => {
      component.term = 60;
      fixture.detectChanges();
      expect(component.term).toBe(60);
    });

    it('should accept apr input', () => {
      component.apr = 4.5;
      fixture.detectChanges();
      expect(component.apr).toBe(4.5);
    });

    it('should accept taxesAndFees input', () => {
      component.taxesAndFees = 1500;
      fixture.detectChanges();
      expect(component.taxesAndFees).toBe(1500);
    });

    it('should accept sticky input', () => {
      component.sticky = false;
      fixture.detectChanges();
      expect(component.sticky).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.monthlyPayment = 450.50;
      component.totalPaid = 27030;
      component.totalInterest = 2030;
      component.financedPrincipal = 25000;
      component.term = 60;
      component.apr = 4.5;
      component.taxesAndFees = 1500;
      fixture.detectChanges();
    });

    it('should render summary card container', () => {
      const card = compiled.query(By.css('.summary-card'));
      expect(card).toBeTruthy();
    });

    it('should have role attribute on card', () => {
      const card = compiled.query(By.css('.summary-card'));
      expect(card.nativeElement.getAttribute('role')).toBe('article');
    });

    it('should have aria-label attribute on card', () => {
      const card = compiled.query(By.css('.summary-card'));
      expect(card.nativeElement.getAttribute('aria-label')).toBe('Loan Summary');
    });

    it('should render header', () => {
      const header = compiled.query(By.css('.summary-card__header'));
      expect(header).toBeTruthy();
    });

    it('should render title', () => {
      const title = compiled.query(By.css('.summary-card__title'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Loan Summary');
    });

    it('should render content area', () => {
      const content = compiled.query(By.css('.summary-card__content'));
      expect(content).toBeTruthy();
    });

    it('should render primary section with monthly payment', () => {
      const primary = compiled.query(By.css('.summary-card__primary'));
      expect(primary).toBeTruthy();
    });

    it('should render monthly payment label', () => {
      const labels = compiled.queryAll(By.css('.summary-card__label'));
      const monthlyPaymentLabel = labels.find(
        label => label.nativeElement.textContent.trim() === 'Monthly Payment'
      );
      expect(monthlyPaymentLabel).toBeTruthy();
    });

    it('should render monthly payment value', () => {
      const value = compiled.query(By.css('.summary-card__value--large'));
      expect(value).toBeTruthy();
      expect(value.nativeElement.textContent.trim()).toContain('450.50');
    });

    it('should render metrics section', () => {
      const metrics = compiled.query(By.css('.summary-card__metrics'));
      expect(metrics).toBeTruthy();
    });

    it('should render three metrics', () => {
      const metricElements = compiled.queryAll(By.css('.summary-card__metric'));
      expect(metricElements.length).toBe(3);
    });

    it('should render total paid metric', () => {
      const metrics = compiled.queryAll(By.css('.summary-card__metric'));
      const totalPaidMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Paid')
      );
      expect(totalPaidMetric).toBeTruthy();
      expect(totalPaidMetric?.nativeElement.textContent).toContain('27,030');
    });

    it('should render total interest metric', () => {
      const metrics = compiled.queryAll(By.css('.summary-card__metric'));
      const totalInterestMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Interest')
      );
      expect(totalInterestMetric).toBeTruthy();
      expect(totalInterestMetric?.nativeElement.textContent).toContain('2,030');
    });

    it('should render financed principal metric', () => {
      const metrics = compiled.queryAll(By.css('.summary-card__metric'));
      const financedPrincipalMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Financed Principal')
      );
      expect(financedPrincipalMetric).toBeTruthy();
      expect(financedPrincipalMetric?.nativeElement.textContent).toContain('25,000');
    });

    it('should render assumptions section', () => {
      const assumptions = compiled.query(By.css('.summary-card__assumptions'));
      expect(assumptions).toBeTruthy();
    });

    it('should render assumptions title', () => {
      const assumptionsTitle = compiled.query(By.css('.summary-card__assumptions-title'));
      expect(assumptionsTitle).toBeTruthy();
      expect(assumptionsTitle.nativeElement.textContent.trim()).toBe('Key Assumptions');
    });

    it('should render assumptions grid', () => {
      const assumptionsGrid = compiled.query(By.css('.summary-card__assumptions-grid'));
      expect(assumptionsGrid).toBeTruthy();
    });

    it('should render three assumptions', () => {
      const assumptionElements = compiled.queryAll(By.css('.summary-card__assumption'));
      expect(assumptionElements.length).toBe(3);
    });

    it('should render term assumption', () => {
      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const termAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('Term:')
      );
      expect(termAssumption).toBeTruthy();
      expect(termAssumption?.nativeElement.textContent).toContain('60 months');
    });

    it('should render APR assumption', () => {
      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const aprAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('APR:')
      );
      expect(aprAssumption).toBeTruthy();
      expect(aprAssumption?.nativeElement.textContent).toContain('4.50%');
    });

    it('should render taxes and fees assumption', () => {
      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const taxesAndFeesAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('Taxes/Fees:')
      );
      expect(taxesAndFeesAssumption).toBeTruthy();
      expect(taxesAndFeesAssumption?.nativeElement.textContent).toContain('1,500');
    });

    it('should render dividers', () => {
      const dividers = compiled.queryAll(By.css('.summary-card__divider'));
      expect(dividers.length).toBe(2);
    });
  });

  describe('Sticky Behavior', () => {
    it('should add sticky class when sticky is true', () => {
      component.sticky = true;
      fixture.detectChanges();
      const card = compiled.query(By.css('.summary-card'));
      expect(card.nativeElement.classList.contains('summary-card--sticky')).toBe(true);
    });

    it('should not add sticky class when sticky is false', () => {
      component.sticky = false;
      fixture.detectChanges();
      const card = compiled.query(By.css('.summary-card'));
      expect(card.nativeElement.classList.contains('summary-card--sticky')).toBe(false);
    });

    it('should toggle sticky class dynamically', () => {
      fixture.componentRef.setInput('sticky', true);
      fixture.detectChanges();
      let card = compiled.query(By.css('.summary-card'));
      expect(card.nativeElement.classList.contains('summary-card--sticky')).toBe(true);

      fixture.componentRef.setInput('sticky', false);
      fixture.detectChanges();
      card = compiled.query(By.css('.summary-card'));
      expect(card.nativeElement.classList.contains('summary-card--sticky')).toBe(false);
    });
  });

  describe('Currency Formatting', () => {
    beforeEach(() => {
      component.monthlyPayment = 1234.56;
      component.totalPaid = 98765.43;
      component.totalInterest = 12345.67;
      component.financedPrincipal = 86419.76;
      component.taxesAndFees = 2500.00;
      fixture.detectChanges();
    });

    it('should format monthly payment as currency', () => {
      const value = compiled.query(By.css('.summary-card__value--large'));
      const text = value.nativeElement.textContent.trim();
      expect(text).toContain('1,234.56');
      expect(text).toContain('$');
    });

    it('should format total paid as currency', () => {
      const metrics = compiled.queryAll(By.css('.summary-card__metric'));
      const totalPaidMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Paid')
      );
      const text = totalPaidMetric?.nativeElement.textContent.trim() || '';
      expect(text).toContain('98,765.43');
      expect(text).toContain('$');
    });

    it('should format total interest as currency', () => {
      const metrics = compiled.queryAll(By.css('.summary-card__metric'));
      const totalInterestMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Interest')
      );
      const text = totalInterestMetric?.nativeElement.textContent.trim() || '';
      expect(text).toContain('12,345.67');
      expect(text).toContain('$');
    });

    it('should format financed principal as currency', () => {
      const metrics = compiled.queryAll(By.css('.summary-card__metric'));
      const financedPrincipalMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Financed Principal')
      );
      const text = financedPrincipalMetric?.nativeElement.textContent.trim() || '';
      expect(text).toContain('86,419.76');
      expect(text).toContain('$');
    });

    it('should format taxes and fees as currency', () => {
      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const taxesAndFeesAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('Taxes/Fees:')
      );
      const text = taxesAndFeesAssumption?.nativeElement.textContent.trim() || '';
      expect(text).toContain('2,500');
      expect(text).toContain('$');
    });
  });

  describe('APR Formatting', () => {
    it('should format APR with two decimal places', () => {
      component.apr = 4.5;
      fixture.detectChanges();
      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const aprAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('APR:')
      );
      expect(aprAssumption?.nativeElement.textContent).toContain('4.50%');
    });

    it('should format whole number APR with decimal places', () => {
      component.apr = 5;
      fixture.detectChanges();
      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const aprAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('APR:')
      );
      expect(aprAssumption?.nativeElement.textContent).toContain('5.00%');
    });

    it('should format APR with many decimals correctly', () => {
      component.apr = 4.567890;
      fixture.detectChanges();
      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const aprAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('APR:')
      );
      expect(aprAssumption?.nativeElement.textContent).toContain('4.57%');
    });
  });

  describe('Dynamic Updates', () => {
    it('should update monthly payment dynamically', () => {
      fixture.componentRef.setInput('monthlyPayment', 500);
      fixture.detectChanges();
      let value = compiled.query(By.css('.summary-card__value--large'));
      expect(value.nativeElement.textContent.trim()).toContain('500');

      fixture.componentRef.setInput('monthlyPayment', 750);
      fixture.detectChanges();
      value = compiled.query(By.css('.summary-card__value--large'));
      expect(value.nativeElement.textContent.trim()).toContain('750');
    });

    it('should update total paid dynamically', () => {
      fixture.componentRef.setInput('totalPaid', 30000);
      fixture.detectChanges();
      let metrics = compiled.queryAll(By.css('.summary-card__metric'));
      let totalPaidMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Paid')
      );
      expect(totalPaidMetric?.nativeElement.textContent).toContain('30,000');

      fixture.componentRef.setInput('totalPaid', 45000);
      fixture.detectChanges();
      metrics = compiled.queryAll(By.css('.summary-card__metric'));
      totalPaidMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Paid')
      );
      expect(totalPaidMetric?.nativeElement.textContent).toContain('45,000');
    });

    it('should update total interest dynamically', () => {
      fixture.componentRef.setInput('totalInterest', 5000);
      fixture.detectChanges();
      let metrics = compiled.queryAll(By.css('.summary-card__metric'));
      let totalInterestMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Interest')
      );
      expect(totalInterestMetric?.nativeElement.textContent).toContain('5,000');

      fixture.componentRef.setInput('totalInterest', 7500);
      fixture.detectChanges();
      metrics = compiled.queryAll(By.css('.summary-card__metric'));
      totalInterestMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Total Interest')
      );
      expect(totalInterestMetric?.nativeElement.textContent).toContain('7,500');
    });

    it('should update financed principal dynamically', () => {
      fixture.componentRef.setInput('financedPrincipal', 25000);
      fixture.detectChanges();
      let metrics = compiled.queryAll(By.css('.summary-card__metric'));
      let financedPrincipalMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Financed Principal')
      );
      expect(financedPrincipalMetric?.nativeElement.textContent).toContain('25,000');

      fixture.componentRef.setInput('financedPrincipal', 37500);
      fixture.detectChanges();
      metrics = compiled.queryAll(By.css('.summary-card__metric'));
      financedPrincipalMetric = metrics.find(metric =>
        metric.nativeElement.textContent.includes('Financed Principal')
      );
      expect(financedPrincipalMetric?.nativeElement.textContent).toContain('37,500');
    });

    it('should update term dynamically', () => {
      fixture.componentRef.setInput('term', 48);
      fixture.detectChanges();
      let assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      let termAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('Term:')
      );
      expect(termAssumption?.nativeElement.textContent).toContain('48 months');

      fixture.componentRef.setInput('term', 72);
      fixture.detectChanges();
      assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      termAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('Term:')
      );
      expect(termAssumption?.nativeElement.textContent).toContain('72 months');
    });

    it('should update APR dynamically', () => {
      fixture.componentRef.setInput('apr', 3.5);
      fixture.detectChanges();
      let assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      let aprAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('APR:')
      );
      expect(aprAssumption?.nativeElement.textContent).toContain('3.50%');

      fixture.componentRef.setInput('apr', 5.75);
      fixture.detectChanges();
      assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      aprAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('APR:')
      );
      expect(aprAssumption?.nativeElement.textContent).toContain('5.75%');
    });

    it('should update taxes and fees dynamically', () => {
      fixture.componentRef.setInput('taxesAndFees', 1000);
      fixture.detectChanges();
      let assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      let taxesAndFeesAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('Taxes/Fees:')
      );
      expect(taxesAndFeesAssumption?.nativeElement.textContent).toContain('1,000');

      fixture.componentRef.setInput('taxesAndFees', 2500);
      fixture.detectChanges();
      assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      taxesAndFeesAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('Taxes/Fees:')
      );
      expect(taxesAndFeesAssumption?.nativeElement.textContent).toContain('2,500');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      component.monthlyPayment = 0;
      component.totalPaid = 0;
      component.totalInterest = 0;
      component.financedPrincipal = 0;
      component.term = 0;
      component.apr = 0;
      component.taxesAndFees = 0;
      fixture.detectChanges();

      const card = compiled.query(By.css('.summary-card'));
      expect(card).toBeTruthy();
    });

    it('should handle very large numbers', () => {
      component.monthlyPayment = 999999.99;
      component.totalPaid = 9999999.99;
      fixture.detectChanges();

      const value = compiled.query(By.css('.summary-card__value--large'));
      expect(value.nativeElement.textContent).toContain('999,999.99');
    });

    it('should handle decimal values correctly', () => {
      component.monthlyPayment = 123.45;
      component.apr = 4.567;
      fixture.detectChanges();

      const value = compiled.query(By.css('.summary-card__value--large'));
      expect(value.nativeElement.textContent).toContain('123.45');

      const assumptions = compiled.queryAll(By.css('.summary-card__assumption'));
      const aprAssumption = assumptions.find(assumption =>
        assumption.nativeElement.textContent.includes('APR:')
      );
      expect(aprAssumption?.nativeElement.textContent).toContain('4.57%');
    });

    it('should handle negative values', () => {
      component.monthlyPayment = -100;
      fixture.detectChanges();

      const value = compiled.query(By.css('.summary-card__value--large'));
      expect(value.nativeElement.textContent).toContain('-');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.monthlyPayment = 450;
      component.totalPaid = 27000;
      component.totalInterest = 2000;
      component.financedPrincipal = 25000;
      component.term = 60;
      component.apr = 4.5;
      component.taxesAndFees = 1500;
      fixture.detectChanges();
    });

    it('should have proper ARIA attributes', () => {
      const card = compiled.query(By.css('.summary-card'));
      expect(card.nativeElement.getAttribute('role')).toBe('article');
      expect(card.nativeElement.getAttribute('aria-label')).toBe('Loan Summary');
    });

    it('should have semantic heading structure', () => {
      const heading = compiled.query(By.css('.summary-card__title'));
      expect(heading.nativeElement.tagName.toLowerCase()).toBe('h2');
    });
  });

  describe('Responsive Design', () => {
    it('should render all responsive containers', () => {
      const content = compiled.query(By.css('.summary-card__content'));
      expect(content).toBeTruthy();
    });

    it('should render metrics in a column layout', () => {
      const metrics = compiled.query(By.css('.summary-card__metrics'));
      expect(metrics).toBeTruthy();
    });

    it('should render assumptions grid', () => {
      const assumptionsGrid = compiled.query(By.css('.summary-card__assumptions-grid'));
      expect(assumptionsGrid).toBeTruthy();
    });
  });
});
