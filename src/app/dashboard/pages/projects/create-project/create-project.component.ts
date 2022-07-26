import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { projectData } from '../projects/projects.modal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  formValue!: FormGroup
  projectObject: projectData = new projectData;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  projectData: any;
  tasksSelected: any = [];
  selectedRoles: any = [];
  selectedProjectInfo: any = [];
  allTasks: any;
  admins: any;
  managers: any;
  role: String[] = ['Manager', 'Developer', 'Tester', 'Admin'];
  userList: string[] = ['pooja.katurde@neutrinotechlabs.com', 'shrinivas.chidrawar@@neutrinotechlabs.com', 'akshay.kumar@neutrinotechlabs.com']
  createBtn = true;
  updateBtn = false;
  updateDataObject: any;
  result:any;
  private changeCallback!: Function;

  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

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

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: ['', Validators.required],
      status: [false, Validators.required],
      admin: ['', Validators.required],
      manager: ['', Validators.required],
      role: [''],
      tasks: ['', Validators.required],
      sdate: ['', Validators.required],
      edate: ['', Validators.required]
    })
    this.getTaskData();
    this.getAdminData();
    this.getManagersData();

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

  // getRoleData() {
  //   this.http.get("http://localhost:3000/roles").subscribe((res) => {
  //     let roles =Object.keys(res).map(([type, value]) => ({type, value}))
  //     console.log(roles)
  //   })
  // }

  getManagersData() {
    this.http.get("http://localhost:3000/manager").subscribe((res) => {
      this.managers = res;
    })
  }

  createProject() {
    console.log(this.formValue)
    this.projectObject.name = this.formValue.value.name;
    this.projectObject.status = this.formValue.value.status;
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.selectedProjectInfo;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    this.projectObject.tasks = this.formValue.value.tasks;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;

    if (this.formValue.valid) {
      this.http.post<any>("http://localhost:3000/posts", this.projectObject).subscribe((res) => {
        alert("Project Created Successfully !!!");
        console.log(res)
        this.result=res;
        this.router.navigate(['/wrapper/projects']);
      })
    }

    if (this.formValue.invalid) {
      alert("Please fill all the fields");
    }

  }

  optionClicked(event: Event, item: any) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(task: any) {
    task.selected = !task.selected;
    if (task.selected) {
      this.tasksSelected.push(task);
      console.log(this.tasksSelected)
      this.changeCallback(this.tasksSelected);
    } else {
      const i = this.tasksSelected.findIndex((value: any) => value === task);
      this.tasksSelected.splice(i, 1);
      this.changeCallback(this.tasksSelected);
    }
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
