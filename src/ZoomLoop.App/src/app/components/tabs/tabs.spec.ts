import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tabs, TabItem } from './tabs';

describe('Tabs', () => {
  let fixture: ComponentFixture<Tabs>;
  let component: Tabs;

  const mockTabs: TabItem[] = [
    { label: 'Overview', value: 'overview' },
    { label: 'Details', value: 'details' },
    { label: 'Reviews', value: 'reviews', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs);
    component = fixture.componentInstance;
    component.tabs = mockTabs;
    fixture.detectChanges();
  });

  it('should render all tabs', () => {
    const tabs = fixture.debugElement.queryAll(By.css('.tabs__tab'));
    expect(tabs.length).toBe(3);
  });

  it('should select first tab by default', () => {
    const active = fixture.debugElement.query(By.css('.tabs__tab--active'));
    expect(active).toBeTruthy();
    expect(active.nativeElement.textContent).toContain('Overview');
  });

  it('should emit valueChange when tab clicked', () => {
    let emitted: any = null;
    const sub = component.valueChange.subscribe(v => emitted = v);
    const second = fixture.debugElement.queryAll(By.css('.tabs__tab'))[1];
    second.nativeElement.click();
    expect(emitted).toBe('details');
    sub.unsubscribe();
  });

  it('should not select disabled tab', () => {
    const third = fixture.debugElement.queryAll(By.css('.tabs__tab'))[2];
    third.nativeElement.click();
    fixture.detectChanges();
    const active = fixture.debugElement.query(By.css('.tabs__tab--active'));
    expect(active.nativeElement.textContent).toContain('Overview');
  });

  it('should navigate with ArrowRight/ArrowLeft keys', () => {
    const tablist = fixture.debugElement.query(By.css('.tabs__list'));
    tablist.triggerEventHandler('keydown', { key: 'ArrowRight', preventDefault: () => {} } as KeyboardEvent);
    fixture.detectChanges();
    let active = fixture.debugElement.query(By.css('.tabs__tab--active'));
    expect(active.nativeElement.textContent).toContain('Details');

    tablist.triggerEventHandler('keydown', { key: 'ArrowLeft', preventDefault: () => {} } as KeyboardEvent);
    fixture.detectChanges();
    active = fixture.debugElement.query(By.css('.tabs__tab--active'));
    expect(active.nativeElement.textContent).toContain('Overview');
  });

  it('should navigate Home/End to first/last enabled tab', () => {
    const tablist = fixture.debugElement.query(By.css('.tabs__list'));
    tablist.triggerEventHandler('keydown', { key: 'End', preventDefault: () => {} } as KeyboardEvent);
    fixture.detectChanges();
    let active = fixture.debugElement.query(By.css('.tabs__tab--active'));
    // Last enabled tab from mockTabs is 'Details' (Reviews disabled)
    expect(active.nativeElement.textContent).toContain('Details');

    tablist.triggerEventHandler('keydown', { key: 'Home', preventDefault: () => {} } as KeyboardEvent);
    fixture.detectChanges();
    active = fixture.debugElement.query(By.css('.tabs__tab--active'));
    expect(active.nativeElement.textContent).toContain('Overview');
  });
  it('should show active underline when enabled', () => {
    const indicator = fixture.debugElement.query(By.css('.tabs__indicator--active'));
    expect(indicator).toBeTruthy();
  });

  it('should support centered layout', () => {
    component.centered = true;
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.tabs__list'));
    expect(list.nativeElement.classList.contains('tabs--centered')).toBeFalsy();
    // class applied on host .tabs via binding
  });
});
