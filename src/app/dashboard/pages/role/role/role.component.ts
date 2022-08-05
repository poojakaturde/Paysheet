import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Data } from 'popper.js';
import { ApiService } from 'src/app/shared/api.service';
import { rolesData } from './roles.modal';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  closeResult = '';
  allRoleData: any;
  allPermissions: any;
  roleForm!: FormGroup;
  roleModalObj: rolesData = new rolesData();
  editForm: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  permissionsSelected: any;
  showAdd: boolean | undefined;
  showbtn: boolean | undefined;
  autoRenew: Boolean | undefined;
  editedToggle: boolean | undefined;
  private changeCallback!: Function;

  displayedColumns: string[] = ['name', 'status', 'permissions', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('permissionInput') permissionInput!: ElementRef<HTMLInputElement>;


  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private http: HttpClient) { }

  clickAddData(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.roleForm.reset();
    this.showAdd = true;
    this.showbtn = false;

    if(this.showAdd){
      this.getPermissionData();
      this.permissionsSelected=[];
    }
  }

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      status: [false],
      permissions: []
    });
    this.getAllRoleData();
    this.getPermissionData();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value)
    if (value) {
      this.permissionsSelected.push(value);
    }
    
  }

  remove(permission: string): void {
    const index = this.permissionsSelected.indexOf(permission);

    if (index >= 0) {
      this.permissionsSelected.splice(index, 1);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllRoleData() {
    this.http.get("http://localhost:3000/comments").subscribe((res) => {
      this.allRoleData = res;
      this.dataSource = new MatTableDataSource(this.allRoleData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  getPermissionData() {
    this.http.get("http://localhost:3000/profile1").subscribe((res) => {
      this.allPermissions = res;
      console.log(this.allPermissions)
    })

  }

  addRole() {
    this.roleModalObj.id = this.roleForm.value.id;
    this.roleModalObj.name = this.roleForm.value.name;
    this.roleModalObj.status = this.roleForm.value.status;
    this.roleForm.controls['permissions'].setValue(this.permissionsSelected);
    console.log(this.roleForm.value)
    this.roleModalObj.permissions = this.roleForm.value.permissions;

    this.http.post<any>("http://localhost:3000/comments", this.roleModalObj).subscribe((res) => {
      console.log(res);
      this.getAllRoleData();
    })
    this.roleForm.reset();
    this.modalService.dismissAll();
    this.permissionsSelected=[];
  }

  deleteData(data: any) {
    this.http.delete("http://localhost:3000/comments/" + data.id).subscribe((res) => {
      alert('Record Deleted Successfully');
      this.getAllRoleData();
    })
  }

  onShowData(contentView: any, data: any) {
    this.showAdd = false;
    this.showbtn = true;
    this.modalService.open(contentView, {
      ariaLabelledBy: 'modal-basic-title',
    });
    this.roleModalObj.id = data.id;
    this.roleForm.setValue({
      id: data.id,
      name: data.name,
      status: data.status,
      permissions: data.permissions
    });
  }

  onEditData(content: any, data: any) {
    this.showAdd = false;
    this.showbtn = true;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.roleModalObj.id = data.id;
    this.permissionsSelected=data.permissions;
    this.roleForm.setValue({
      id: data.id,
      name: data.name,
      status: data.status,
      permissions: data.permissions
    });
    console.log(data);
  }

  updateData() {
    this.roleModalObj.id = this.roleModalObj.id;
    this.roleModalObj.name = this.roleForm.value.name;
    this.roleModalObj.status = this.roleForm.value.status;
    this.roleModalObj.permissions = this.roleForm.value.permissions;
    console.log(this.roleModalObj);
    this.http.put("http://localhost:3000/comments/"+this.roleModalObj.id,this.roleModalObj).subscribe((res) => {
      alert('Record Updated Successfully');
      this.getAllRoleData();
    })
    this.roleForm.reset();
    this.modalService.dismissAll();
    this.permissionsSelected=[];
  }

  optionClicked(event: Event, item:any) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(permission:any) {
    permission.selected = !permission.selected;
    if (permission.selected) {
      this.permissionsSelected.push(permission);
      this.changeCallback(this.permissionsSelected);
    } else {
      const i = this.permissionsSelected.findIndex((value:any) => value === permission);
      this.permissionsSelected.splice(i, 1);
      this.changeCallback(this.permissionsSelected);
    }
  }
}
