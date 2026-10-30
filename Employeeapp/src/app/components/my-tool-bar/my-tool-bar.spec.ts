import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyToolBar } from './my-tool-bar';

describe('MyToolBar', () => {
  let component: MyToolBar;
  let fixture: ComponentFixture<MyToolBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyToolBar],
    }).compileComponents();

    fixture = TestBed.createComponent(MyToolBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
