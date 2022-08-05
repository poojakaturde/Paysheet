import { OnInit } from '@angular/core';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { projectData } from './projects.modal';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = ['name', 'status', 'admin', 'manager', 'role', 'tasks', 'sdate', 'edate', 'action'];

  private changeCallback!: Function;
  dataSource!: MatTableDataSource<any>;

  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private http: HttpClient,private router: Router) { }

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

  clickAddData(content: any) {
    
    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    // this.formValue.reset();
    // this.showAdd = true;
    // this.showbtn = false;
    // if (this.showAdd) {
    //   this.getTaskData();
    //   this.tasksSelected = [];
    // }

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
      console.log(res);
      this.getProjectData();
    })
  }

  addProject() {
    this.projectObject.id = this.formValue.value.id;
    this.projectObject.name = this.formValue.value.name;
    this.projectObject.status = this.formValue.value.status;
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.formValue.value.role;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    this.projectObject.tasks = this.formValue.value.tasks;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;

    this.http.post<any>("http://localhost:3000/posts", this.projectObject).subscribe((res) => {
      console.log(res);
      this.getProjectData();
    })

  }

  onShowData(contentView: any, data: any) {
    this.showAdd = false;
    this.showbtn = true;
    this.modalService.open(contentView, {
      ariaLabelledBy: 'modal-basic-title',
    });
    this.projectObject.id = data.id;
    this.formValue.controls['id'].setValue(data.id);
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['status'].setValue(data.status);
    this.formValue.controls['admin'].setValue(data.admin);
    this.formValue.controls['manager'].setValue(data.manager);
    this.formValue.controls['role'].setValue(data.role);
    this.tasksSelected = data.tasks;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    this.formValue.controls['sdate'].setValue(data.sdate);
    this.formValue.controls['edate'].setValue(data.edate);
  }

  onEditData(content: any, data: any) {
    this.showAdd = false;
    this.showbtn = true;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.projectObject.id = data.id;
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['status'].setValue(data.status);
    this.formValue.controls['admin'].setValue(data.admin);
    this.formValue.controls['manager'].setValue(data.manager);
    this.formValue.controls['role'].setValue(data.role);
    this.tasksSelected = data.tasks;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    this.formValue.controls['sdate'].setValue(data.sdate);
    this.formValue.controls['edate'].setValue(data.edate);
  }

  updateData() {

    this.projectObject.id = this.projectObject.id;
    this.projectObject.name = this.formValue.value.name;
    this.projectObject.status = this.formValue.value.status;
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.formValue.value.role;
    this.projectObject.tasks = this.tasksSelected;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;
    console.log(this.projectObject.id);
    this.http.put("http://localhost:3000/posts/" + this.projectObject.id, this.projectObject).subscribe((res) => {
      console.log(res);
      this.getProjectData();
    })
    this.formValue.reset();
    this.tasksSelected = [];
    this.modalService.dismissAll();
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
