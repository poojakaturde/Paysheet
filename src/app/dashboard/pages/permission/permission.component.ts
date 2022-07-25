import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Data } from 'popper.js';
import { ApiService } from 'src/app/shared/api.service';
import { permissionsData } from './permission.modal';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements OnInit {
  closeResult = '';
  allPermissionData: any;
  formValue!: FormGroup;
  permissionModalObj: permissionsData = new permissionsData();
  editForm: any;
  showAdd: boolean | undefined;
  showbtn: boolean | undefined;
  autoRenew: Boolean | undefined;
  editedToggle: boolean | undefined;

  displayedColumns: string[] = ['name', 'type', 'status','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private api: ApiService,
    // private dialog: MatDialog
  ) {}

  clickAddData(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.formValue.reset();
    this.showAdd = true;
    this.showbtn = false;
  }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      type: [''],
      status: [false],
    });
    this.getAllData();
  }

  get name() {
    return this.formValue.get('name');
  }
  addPermission() {
    this.permissionModalObj.id = this.formValue.value.id;
    this.permissionModalObj.name = this.formValue.value.name;
    this.permissionModalObj.type = this.formValue.value.type;
    this.permissionModalObj.status = this.formValue.value.status;

    this.api.postPermission(this.permissionModalObj).subscribe(
      (res) => {
        alert('Data Added Successfully');
        this.formValue.reset();
        this.getAllData();
      },
      (err) => {
        alert('something is wrong');
      }
    );
  }

  getAllData() {
    this.api.getPermission().subscribe((res) => {
      this.allPermissionData = res;
      // debugger
      this.dataSource = new MatTableDataSource(res);

      this.dataSource.paginator = this.paginator;
      
      this.dataSource.sort = this.sort
    });
  }

  deleteData(data: any) {
    this.api.deletePermission(data.id).subscribe((res) => {
      alert('record delete successfully');
      this.getAllData();
    });
  }

  onShowData(contentView: any, data: any) {
    this.showAdd = false;
    this.showbtn = true;
    this.modalService.open(contentView, {
      ariaLabelledBy: 'modal-basic-title',
    });
    this.permissionModalObj.id = data.id;
    this.formValue.setValue({
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
    });
  }

  onEditData(content: any, data: any) {
    this.showAdd = false;
    this.showbtn = true;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.permissionModalObj.id = data.id;
    this.formValue.setValue({
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
    });
    console.log(data);
  }

  updateData() {
    this.permissionModalObj.id = this.formValue.value.id;
    this.permissionModalObj.name = this.formValue.value.name;
    this.permissionModalObj.type = this.formValue.value.type;
    this.permissionModalObj.status = this.formValue.value.status;

    this.api
      .updatePermission(this.permissionModalObj, this.permissionModalObj.id)
      .subscribe(
        (res) => {
          alert('record update successfully');
          this.formValue.reset();
          this.getAllData();
        },
        (err) => {
          alert('something is wrong');
        }
      );
  }
}
