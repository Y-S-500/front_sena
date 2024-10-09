import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInstrumentoEvaluacionIndexComponent } from './detalle-instrumento-evaluacion-index.component';

describe('DetalleInstrumentoEvaluacionIndexComponent', () => {
  let component: DetalleInstrumentoEvaluacionIndexComponent;
  let fixture: ComponentFixture<DetalleInstrumentoEvaluacionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleInstrumentoEvaluacionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleInstrumentoEvaluacionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
