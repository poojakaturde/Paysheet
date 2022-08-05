import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { projectData } from '../projects/projects.modal';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  formValue!: FormGroup
  projectObject: projectData = new projectData;
  projectData: any;
  tasksSelected: any;
  allTasks: any;
  admins: any;
  managers: any;
  roles: any;
  private changeCallback!: Function;

  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient,private router: Router) { }

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
  }

}
