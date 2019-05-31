import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { NgbdModalResourceAddComponent } from './ngbd-modal-resource-add.component';
import { CustomNgMaterialModule } from '../../../../../common/custom-ng-material.module';

import { UserDictionary } from '../../../../service/user-dictionary/user-dictionary.interface';

describe('NgbdModalResourceAddComponent', () => {
  let component: NgbdModalResourceAddComponent;
  let fixture: ComponentFixture<NgbdModalResourceAddComponent>;

  let addcomponent: NgbdModalResourceAddComponent;
  let addfixture: ComponentFixture<NgbdModalResourceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdModalResourceAddComponent ],
      providers: [
        NgbActiveModal
      ],
      imports: [
        CustomNgMaterialModule,
        NgbModule.forRoot(),
        FormsModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdModalResourceAddComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resourceAddComponent addDictionary should add a new dictionary', () => {
    addfixture = TestBed.createComponent(NgbdModalResourceAddComponent);
    addcomponent = addfixture.componentInstance;

    let getResultDict: UserDictionary;
    getResultDict = {
      id: '1',
      name: 'test',
      items: [],
    };

    addcomponent.dictContent = 'key1,key2,key3';
    addcomponent.name = 'test';
    addcomponent.separator = ',';
    addcomponent.addDictionary();

    expect(getResultDict.id).toEqual('1');
    expect(getResultDict.name).toEqual('test');
    expect(getResultDict.items).toEqual([]);
  });
});
