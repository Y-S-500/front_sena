import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInstrumentoEvaluacionFormComponent } from './detalle-instrumento-evaluacion-form.component';

describe('DetalleInstrumentoEvaluacionFormComponent', () => {
  let component: DetalleInstrumentoEvaluacionFormComponent;
  let fixture: ComponentFixture<DetalleInstrumentoEvaluacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleInstrumentoEvaluacionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleInstrumentoEvaluacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
