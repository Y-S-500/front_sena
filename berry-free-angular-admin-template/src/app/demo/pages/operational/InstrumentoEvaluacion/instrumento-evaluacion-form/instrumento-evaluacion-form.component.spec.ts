import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentoEvaluacionFormComponent } from './instrumento-evaluacion-form.component';

describe('InstrumentoEvaluacionFormComponent', () => {
  let component: InstrumentoEvaluacionFormComponent;
  let fixture: ComponentFixture<InstrumentoEvaluacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentoEvaluacionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentoEvaluacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
