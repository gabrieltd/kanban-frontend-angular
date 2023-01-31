import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPreviewComponent } from './board-preview.component';

describe('BoardPreviewComponent', () => {
  let component: BoardPreviewComponent;
  let fixture: ComponentFixture<BoardPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
