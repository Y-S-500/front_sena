import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaModalComponent } from './ficha-modal.component';

describe('FichaModalComponent', () => {
  let component: FichaModalComponent;
  let fixture: ComponentFixture<FichaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
