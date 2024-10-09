import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadIndexComponent } from './actividad-index.component';

describe('ActividadIndexComponent', () => {
  let component: ActividadIndexComponent;
  let fixture: ComponentFixture<ActividadIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
