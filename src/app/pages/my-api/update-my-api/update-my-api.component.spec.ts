import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMyApiComponent } from './update-my-api.component';

describe('UpdateMyApiComponent', () => {
  let component: UpdateMyApiComponent;
  let fixture: ComponentFixture<UpdateMyApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMyApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMyApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
