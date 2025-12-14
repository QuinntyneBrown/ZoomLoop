import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCardComponent } from './dashboard-card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DashboardCardComponent', () => {
  let component: DashboardCardComponent;
  let fixture: ComponentFixture<DashboardCardComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Initialization', () => {
    it('should create the dashboard card component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.title).toBe('');
      expect(component.description).toBe('');
      expect(component.iconColor).toBe('#ef4444');
      expect(component.showArrow).toBe(true);
      expect(component.clickable).toBe(true);
    });

    it('should set title from input', () => {
      component.title = 'Personal info';
      fixture.detectChanges();
      expect(component.title).toBe('Personal info');
    });

    it('should set description from input', () => {
      component.description = 'Edit your personal details and contact info';
      fixture.detectChanges();
      expect(component.description).toBe('Edit your personal details and contact info');
    });

    it('should set iconColor from input', () => {
      component.iconColor = '#0066cc';
      fixture.detectChanges();
      expect(component.iconColor).toBe('#0066cc');
    });

    it('should set showArrow from input', () => {
      component.showArrow = false;
      fixture.detectChanges();
      expect(component.showArrow).toBe(false);
    });

    it('should set clickable from input', () => {
      component.clickable = false;
      fixture.detectChanges();
      expect(component.clickable).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.title = 'Personal info';
      component.description = 'Edit your personal details and contact info';
      fixture.detectChanges();
    });

    it('should render dashboard card container', () => {
      const card = compiled.query(By.css('.dashboard-card'));
      expect(card).toBeTruthy();
    });

    it('should render title when provided', () => {
      const title = compiled.query(By.css('.dashboard-card__title'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Personal info');
    });

    it('should not render title when not provided', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.title = '';
      newFixture.detectChanges();
      const newCompiled = newFixture.debugElement;
      const title = newCompiled.query(By.css('.dashboard-card__title'));
      expect(title).toBeFalsy();
    });

    it('should render description when provided', () => {
      const description = compiled.query(By.css('.dashboard-card__description'));
      expect(description).toBeTruthy();
      expect(description.nativeElement.textContent.trim()).toBe(
        'Edit your personal details and contact info'
      );
    });

    it('should not render description when not provided', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.description = '';
      newFixture.detectChanges();
      const newCompiled = newFixture.debugElement;
      const description = newCompiled.query(By.css('.dashboard-card__description'));
      expect(description).toBeFalsy();
    });

    it('should render icon wrapper', () => {
      const iconWrapper = compiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper).toBeTruthy();
    });

    it('should apply icon color to icon wrapper', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.iconColor = '#0066cc';
      newFixture.detectChanges();
      const newCompiled = newFixture.debugElement;
      const iconWrapper = newCompiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper.nativeElement.style.color).toBe('rgb(0, 102, 204)');
    });

    it('should render arrow when showArrow is true', () => {
      component.showArrow = true;
      fixture.detectChanges();
      const arrow = compiled.query(By.css('.dashboard-card__arrow'));
      expect(arrow).toBeTruthy();
    });

    it('should not render arrow when showArrow is false', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.showArrow = false;
      newFixture.detectChanges();
      const newCompiled = newFixture.debugElement;
      const arrow = newCompiled.query(By.css('.dashboard-card__arrow'));
      expect(arrow).toBeFalsy();
    });

    it('should render arrow SVG', () => {
      component.showArrow = true;
      fixture.detectChanges();
      const svg = compiled.query(By.css('.dashboard-card__arrow svg'));
      expect(svg).toBeTruthy();
    });
  });

  describe('Clickable Behavior', () => {
    beforeEach(() => {
      component.title = 'Personal info';
      component.description = 'Edit your personal details and contact info';
      fixture.detectChanges();
    });

    it('should add clickable class when clickable is true', () => {
      component.clickable = true;
      fixture.detectChanges();
      const card = compiled.query(By.css('.dashboard-card'));
      expect(card.nativeElement.classList.contains('dashboard-card--clickable')).toBe(true);
    });

    it('should not add clickable class when clickable is false', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.clickable = false;
      newFixture.detectChanges();
      const newCompiled = newFixture.debugElement;
      const card = newCompiled.query(By.css('.dashboard-card'));
      expect(card.nativeElement.classList.contains('dashboard-card--clickable')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.title = 'Personal info';
      component.description = 'Edit your personal details and contact info';
      fixture.detectChanges();
    });

    it('should have role attribute on card', () => {
      const card = compiled.query(By.css('.dashboard-card'));
      expect(card.nativeElement.getAttribute('role')).toBe('article');
    });
  });

  describe('Responsive Design', () => {
    it('should render content wrapper', () => {
      const content = compiled.query(By.css('.dashboard-card__content'));
      expect(content).toBeTruthy();
    });

    it('should render text wrapper', () => {
      const text = compiled.query(By.css('.dashboard-card__text'));
      expect(text).toBeTruthy();
    });
  });

  describe('Content Projection', () => {
    it('should have icon wrapper for content projection', () => {
      const iconWrapper = compiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper).toBeTruthy();
    });
  });

  describe('Dynamic Updates', () => {
    it('should update title dynamically', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.title = 'Initial Title';
      newFixture.detectChanges();
      let newCompiled = newFixture.debugElement;
      let title = newCompiled.query(By.css('.dashboard-card__title'));
      expect(title.nativeElement.textContent.trim()).toBe('Initial Title');

      // Create a fresh component for testing dynamic update
      const updatedFixture = TestBed.createComponent(DashboardCardComponent);
      const updatedComponent = updatedFixture.componentInstance;
      updatedComponent.title = 'Updated Title';
      updatedFixture.detectChanges();
      const updatedCompiled = updatedFixture.debugElement;
      title = updatedCompiled.query(By.css('.dashboard-card__title'));
      expect(title.nativeElement.textContent.trim()).toBe('Updated Title');
    });

    it('should update description dynamically', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.description = 'Initial description';
      newFixture.detectChanges();
      let newCompiled = newFixture.debugElement;
      let description = newCompiled.query(By.css('.dashboard-card__description'));
      expect(description.nativeElement.textContent.trim()).toBe('Initial description');

      // Create a fresh component for testing dynamic update
      const updatedFixture = TestBed.createComponent(DashboardCardComponent);
      const updatedComponent = updatedFixture.componentInstance;
      updatedComponent.description = 'Updated description';
      updatedFixture.detectChanges();
      const updatedCompiled = updatedFixture.debugElement;
      description = updatedCompiled.query(By.css('.dashboard-card__description'));
      expect(description.nativeElement.textContent.trim()).toBe('Updated description');
    });

    it('should update icon color dynamically', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.iconColor = '#ff0000';
      newFixture.detectChanges();
      let newCompiled = newFixture.debugElement;
      let iconWrapper = newCompiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper.nativeElement.style.color).toBe('rgb(255, 0, 0)');

      // Create a fresh component for testing dynamic update
      const updatedFixture = TestBed.createComponent(DashboardCardComponent);
      const updatedComponent = updatedFixture.componentInstance;
      updatedComponent.iconColor = '#00ff00';
      updatedFixture.detectChanges();
      const updatedCompiled = updatedFixture.debugElement;
      iconWrapper = updatedCompiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper.nativeElement.style.color).toBe('rgb(0, 255, 0)');
    });

    it('should toggle arrow visibility dynamically', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.showArrow = true;
      newFixture.detectChanges();
      let newCompiled = newFixture.debugElement;
      let arrow = newCompiled.query(By.css('.dashboard-card__arrow'));
      expect(arrow).toBeTruthy();

      // Create a fresh component for testing dynamic update
      const updatedFixture = TestBed.createComponent(DashboardCardComponent);
      const updatedComponent = updatedFixture.componentInstance;
      updatedComponent.showArrow = false;
      updatedFixture.detectChanges();
      const updatedCompiled = updatedFixture.debugElement;
      arrow = updatedCompiled.query(By.css('.dashboard-card__arrow'));
      expect(arrow).toBeFalsy();
    });

    it('should toggle clickable class dynamically', () => {
      const newFixture = TestBed.createComponent(DashboardCardComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.clickable = true;
      newFixture.detectChanges();
      let newCompiled = newFixture.debugElement;
      let card = newCompiled.query(By.css('.dashboard-card'));
      expect(card.nativeElement.classList.contains('dashboard-card--clickable')).toBe(true);

      // Create a fresh component for testing dynamic update
      const updatedFixture = TestBed.createComponent(DashboardCardComponent);
      const updatedComponent = updatedFixture.componentInstance;
      updatedComponent.clickable = false;
      updatedFixture.detectChanges();
      const updatedCompiled = updatedFixture.debugElement;
      card = updatedCompiled.query(By.css('.dashboard-card'));
      expect(card.nativeElement.classList.contains('dashboard-card--clickable')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title and description', () => {
      component.title = '';
      component.description = '';
      fixture.detectChanges();
      const title = compiled.query(By.css('.dashboard-card__title'));
      const description = compiled.query(By.css('.dashboard-card__description'));
      expect(title).toBeFalsy();
      expect(description).toBeFalsy();
    });

    it('should handle very long title', () => {
      component.title = 'This is a very long title that might wrap to multiple lines and should be handled gracefully by the component';
      fixture.detectChanges();
      const title = compiled.query(By.css('.dashboard-card__title'));
      expect(title.nativeElement.textContent.trim()).toBe(component.title);
    });

    it('should handle very long description', () => {
      component.description = 'This is a very long description that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or causing overflow issues';
      fixture.detectChanges();
      const description = compiled.query(By.css('.dashboard-card__description'));
      expect(description.nativeElement.textContent.trim()).toBe(component.description);
    });

    it('should handle special characters in title', () => {
      component.title = 'Special <> & " \' characters';
      fixture.detectChanges();
      const title = compiled.query(By.css('.dashboard-card__title'));
      expect(title.nativeElement.textContent.trim()).toContain('Special');
    });

    it('should handle special characters in description', () => {
      component.description = 'Description with <> & " \' characters';
      fixture.detectChanges();
      const description = compiled.query(By.css('.dashboard-card__description'));
      expect(description.nativeElement.textContent.trim()).toContain('Description');
    });
  });

  describe('Custom Icon Colors', () => {
    it('should handle hex color codes', () => {
      component.iconColor = '#ff6b35';
      fixture.detectChanges();
      const iconWrapper = compiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper.nativeElement.style.color).toBe('rgb(255, 107, 53)');
    });

    it('should handle rgb color values', () => {
      component.iconColor = 'rgb(100, 200, 50)';
      fixture.detectChanges();
      const iconWrapper = compiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper.nativeElement.style.color).toBe('rgb(100, 200, 50)');
    });

    it('should handle named colors', () => {
      component.iconColor = 'blue';
      fixture.detectChanges();
      const iconWrapper = compiled.query(By.css('.dashboard-card__icon-wrapper'));
      expect(iconWrapper.nativeElement.style.color).toBe('blue');
    });
  });
});
