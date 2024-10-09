import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentoEvaluacionIndexComponent } from './instrumento-evaluacion-index.component';

describe('InstrumentoEvaluacionIndexComponent', () => {
  let component: InstrumentoEvaluacionIndexComponent;
  let fixture: ComponentFixture<InstrumentoEvaluacionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentoEvaluacionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentoEvaluacionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
