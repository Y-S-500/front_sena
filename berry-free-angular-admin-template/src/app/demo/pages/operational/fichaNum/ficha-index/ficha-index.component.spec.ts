import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaIndexComponent } from './ficha-index.component';

describe('FichaIndexComponent', () => {
  let component: FichaIndexComponent;
  let fixture: ComponentFixture<FichaIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
