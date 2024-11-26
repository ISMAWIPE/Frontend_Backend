import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonModalComponent } from './pokemon-modal.component';

describe('PokemonModalComponent', () => {
  let component: PokemonModalComponent;
  let fixture: ComponentFixture<PokemonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
