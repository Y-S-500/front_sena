import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoIndexComponent } from './proyecto-index.component';

describe('ProyectoIndexComponent', () => {
  let component: ProyectoIndexComponent;
  let fixture: ComponentFixture<ProyectoIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
