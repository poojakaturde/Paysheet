import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {
  isExpanded: boolean = false;

  
  logout(){
    this.router.navigate(['./login'])
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  

}
