import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterioEvaluacionIndexComponent } from './criterio-evaluacion-index.component';

describe('CriterioEvaluacionIndexComponent', () => {
  let component: CriterioEvaluacionIndexComponent;
  let fixture: ComponentFixture<CriterioEvaluacionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriterioEvaluacionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriterioEvaluacionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
