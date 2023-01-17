import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardLoadingComponent } from './project-card-loading.component';

describe('ProjectCardLoadingComponent', () => {
  let component: ProjectCardLoadingComponent;
  let fixture: ComponentFixture<ProjectCardLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectCardLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
