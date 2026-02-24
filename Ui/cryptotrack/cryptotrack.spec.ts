import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cryptotrack } from './cryptotrack';

describe('Cryptotrack', () => {
  let component: Cryptotrack;
  let fixture: ComponentFixture<Cryptotrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cryptotrack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cryptotrack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
