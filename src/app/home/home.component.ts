import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  toggle = true;
  status = 'Enable';

  constructor(private router: Router,
  ) {
  }

  enableDisableRule(job) {
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
  }

  createEvent() {
    this.router.navigateByUrl('/event');

  }


}
