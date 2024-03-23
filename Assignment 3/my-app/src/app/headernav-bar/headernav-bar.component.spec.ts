import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadernavBarComponent } from './headernav-bar.component';

describe('HeadernavBarComponent', () => {
  let component: HeadernavBarComponent;
  let fixture: ComponentFixture<HeadernavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadernavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadernavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
