import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorIndexComponent } from './instructor-index.component';

describe('InstructorIndexComponent', () => {
  let component: InstructorIndexComponent;
  let fixture: ComponentFixture<InstructorIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
