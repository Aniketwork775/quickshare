import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDBackgroundComponent } from './three-dbackground.component';

describe('ThreeDBackgroundComponent', () => {
  let component: ThreeDBackgroundComponent;
  let fixture: ComponentFixture<ThreeDBackgroundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeDBackgroundComponent]
    });
    fixture = TestBed.createComponent(ThreeDBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
