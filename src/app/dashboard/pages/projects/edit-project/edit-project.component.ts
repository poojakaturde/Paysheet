import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApiService } from 'src/app/shared/api.service';
import { projectData } from '../projects/projects.modal';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  updateDataObject: any;
  formValue!: FormGroup;
  tasksSelected: any = [];
  projectObject: projectData = new projectData;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedRoles: any = [];
  selectedProjectInfo: any = [];
  allTasks: any;
  admins: any;
  managers: any;
  roles: any;
  role: String[] = ['Manager', 'Developer', 'Tester', 'Admin'];
  userList: string[] = ['pooja.katurde@neutrinotechlabs.com', 'shrinivas.chidrawar@@neutrinotechlabs.com', 'akshay.kumar@neutrinotechlabs.com']
  private changeCallback!: Function;

  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  constructor(private shared: ApiService, private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {

    this.formValue = this.formBuilder.group({
      name: [''],
      status: false,
      admin: [''],
      manager: [''],
      role: [''],
      tasks: [''],
      sdate: [''],
      edate: ['']
    })

    this.updateDataObject = this.shared.getUpdateData();
    console.log(this.updateDataObject)
    this.showData();
    this.getTaskData();
    this.getAdminData();
    this.getManagersData();

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value)
    if (value) {
      this.tasksSelected.push(value);
    }
  }

  remove(task: string): void {
    const index = this.tasksSelected.indexOf(task);
    if (index >= 0) {
      this.tasksSelected.splice(index, 1);
    }
  }

  getTaskData() {
    this.http.get("http://localhost:3000/profile").subscribe((res) => {
      this.allTasks = res;
    })
  }

  getAdminData() {
    this.http.get("http://localhost:3000/admin").subscribe((res) => {
      this.admins = res;
    })
  }

  getManagersData() {
    this.http.get("http://localhost:3000/manager").subscribe((res) => {
      this.managers = res;
    })
  }

  optionClicked(event: Event, item: any) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(task: any) {
    task.selected = !task.selected;
    if (task.selected) {
      this.tasksSelected.push(task);
      this.changeCallback(this.tasksSelected);
    } else {
      const i = this.tasksSelected.findIndex((value: any) => value === task);
      this.tasksSelected.splice(i, 1);
      this.changeCallback(this.tasksSelected);
    }
  }

  showData() {

    this.projectObject.id = this.updateDataObject.id;
    this.formValue.controls['name'].setValue(this.updateDataObject.name);
    this.formValue.controls['status'].setValue(this.updateDataObject.status);
    this.formValue.controls['admin'].setValue(this.updateDataObject.admin);
    this.formValue.controls['manager'].setValue(this.updateDataObject.manager);
    this.selectedProjectInfo = this.updateDataObject.role;
    this.tasksSelected = this.updateDataObject.tasks;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    this.formValue.controls['sdate'].setValue(this.updateDataObject.sdate);
    this.formValue.controls['edate'].setValue(this.updateDataObject.edate);
  }

  updateData() {

    this.projectObject.id = this.projectObject.id;
    this.projectObject.name = this.formValue.value.name;
    this.projectObject.status = this.formValue.value.status;
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.selectedProjectInfo;
    this.projectObject.tasks = this.tasksSelected;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;

    this.http.put("http://localhost:3000/posts/" + this.projectObject.id, this.projectObject).subscribe((res) => {
      alert("Project Information Updated Successfully !!!");
    })

  }

  addRole(roleName: any) {
    this.selectedRoles.push(roleName);
    console.log(this.selectedRoles)
    this.selectedProjectInfo.push({
      isEnabled: true,
      role: roleName,
      status: "enabled",
      users: []
    })
    console.log(this.selectedProjectInfo)
  }

  removeRole(roleIndex: number, removeUser: string) {
    if (this.selectedProjectInfo[roleIndex].isEnabled) {
      this.selectedProjectInfo[roleIndex].users = this.selectedProjectInfo[roleIndex].users.filter((user: any) => user !== removeUser)
    } else {
      alert("Role is Disabled");
    }
  }

  openUserListDP(userListDP:any, roleIndex:any) {
    if (this.selectedProjectInfo[roleIndex].isEnabled) {
      userListDP.open();
    } else {
      alert("Role is Disabled");
    }
  }


}
