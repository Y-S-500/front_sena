import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenciaIndexComponent } from './competencia-index.component';

describe('CompetenciaIndexComponent', () => {
  let component: CompetenciaIndexComponent;
  let fixture: ComponentFixture<CompetenciaIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenciaIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetenciaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
