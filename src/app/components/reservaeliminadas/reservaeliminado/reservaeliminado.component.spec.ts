import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaeliminadoComponent } from './reservaeliminado.component';

describe('ReservaeliminadoComponent', () => {
  let component: ReservaeliminadoComponent;
  let fixture: ComponentFixture<ReservaeliminadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaeliminadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaeliminadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
