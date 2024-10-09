import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterioEvaluacionFormComponent } from './criterio-evaluacion-form.component';

describe('CriterioEvaluacionFormComponent', () => {
  let component: CriterioEvaluacionFormComponent;
  let fixture: ComponentFixture<CriterioEvaluacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriterioEvaluacionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriterioEvaluacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
