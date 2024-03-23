import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndErrorComponent } from './search-and-error.component';

describe('SearchAndErrorComponent', () => {
  let component: SearchAndErrorComponent;
  let fixture: ComponentFixture<SearchAndErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAndErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchAndErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
