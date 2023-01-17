import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardLoadingComponent } from './board-loading.component';

describe('BoardLoadingComponent', () => {
  let component: BoardLoadingComponent;
  let fixture: ComponentFixture<BoardLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
