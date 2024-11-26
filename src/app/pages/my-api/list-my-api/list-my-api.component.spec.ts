import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMyApiComponent } from './list-my-api.component';

describe('ListMyApiComponent', () => {
  let component: ListMyApiComponent;
  let fixture: ComponentFixture<ListMyApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMyApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMyApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
