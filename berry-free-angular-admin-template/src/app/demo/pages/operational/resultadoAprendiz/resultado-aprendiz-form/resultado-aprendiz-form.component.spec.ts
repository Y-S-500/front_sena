import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoAprendizFormComponent } from './resultado-aprendiz-form.component';

describe('ResultadoAprendizFormComponent', () => {
  let component: ResultadoAprendizFormComponent;
  let fixture: ComponentFixture<ResultadoAprendizFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoAprendizFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoAprendizFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
