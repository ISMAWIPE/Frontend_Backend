import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMyApiComponent } from './create-my-api.component';

describe('CreateMyApiComponent', () => {
  let component: CreateMyApiComponent;
  let fixture: ComponentFixture<CreateMyApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMyApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMyApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
