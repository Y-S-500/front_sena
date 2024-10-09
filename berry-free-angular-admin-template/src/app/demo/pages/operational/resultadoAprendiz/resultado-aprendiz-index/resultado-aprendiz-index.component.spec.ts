import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoAprendizIndexComponent } from './resultado-aprendiz-index.component';

describe('ResultadoAprendizIndexComponent', () => {
  let component: ResultadoAprendizIndexComponent;
  let fixture: ComponentFixture<ResultadoAprendizIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoAprendizIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoAprendizIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
