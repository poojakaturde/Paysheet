import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { projectData } from './projects.modal';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  formValue!: FormGroup
  projectObject: projectData = new projectData;
  projectData: any;
  showAdd: boolean | undefined;
  showbtn: boolean | undefined;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tasksSelected: any;
  allTasks: any;
  admins: any;
  managers: any;
  roles: any;
  autoRenew: Boolean | undefined;
  editedToggle: boolean | undefined;
  displayedColumns: string[] = ['name', 'status', 'admin', 'manager', 'tasks', 'sdate', 'edate', 'role', 'action'];

  private changeCallback!: Function;
  dataSource!: MatTableDataSource<any>;

  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private shared: ApiService) { }

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id: [''],
      name: [''],
      status: false,
      admin: [''],
      manager: [''],
      role: [''],
      tasks: [''],
      sdate: [''],
      edate: ['']
    })
    this.getProjectData();
    this.getTaskData();
    this.getAdminData();
    this.getManagersData();
    this.getRoleData();
  }

  getProjectData() {
    this.http.get("http://localhost:3000/posts").subscribe((res) => {
      this.projectData = res;
      this.dataSource = new MatTableDataSource(this.projectData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

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

  getRoleData() {
    this.http.get("http://localhost:3000/roles").subscribe((res) => {
      this.roles = res;
    })
  }

  getManagersData() {
    this.http.get("http://localhost:3000/manager").subscribe((res) => {
      this.managers = res;
    })
  }

  deleteProject(data: any) {
    this.http.delete("http://localhost:3000/posts/" + data.id).subscribe((res) => {
      alert("Project Deleted Successfully !!")
      this.getProjectData();
    })
  }

  editData(data: any) {
    this.shared.sendUpdateData(data);
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

}
