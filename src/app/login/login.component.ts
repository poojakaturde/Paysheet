import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authenticatedUser = [
    { username : 'di-admin@neutrinotechsystems.com', password: 'Nts@1234'}
  ];

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.form.valid && this.form.value.username === 'di-admin@neutrinotechsystems.com' && this.form.value.password === 'Nts@1234') {
      console.log("Routing");
      
      // this.router.navigate(['./wrapper'])
      this.router.navigate(['./wrapper'])
    }
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
