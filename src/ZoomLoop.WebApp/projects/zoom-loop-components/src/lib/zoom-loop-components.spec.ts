import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomLoopComponents } from './zoom-loop-components';

describe('ZoomLoopComponents', () => {
  let component: ZoomLoopComponents;
  let fixture: ComponentFixture<ZoomLoopComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoomLoopComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomLoopComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
