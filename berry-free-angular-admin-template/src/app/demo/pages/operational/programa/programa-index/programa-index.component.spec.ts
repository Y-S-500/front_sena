import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaIndexComponent } from './programa-index.component';

describe('ProgramaIndexComponent', () => {
  let component: ProgramaIndexComponent;
  let fixture: ComponentFixture<ProgramaIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramaIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
