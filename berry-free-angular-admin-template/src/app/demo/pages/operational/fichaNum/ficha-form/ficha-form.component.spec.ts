import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaFormComponent } from './ficha-form.component';

describe('FichaFormComponent', () => {
  let component: FichaFormComponent;
  let fixture: ComponentFixture<FichaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
