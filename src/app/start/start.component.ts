import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  printUser(event) {
    console.log(event);
  }

  printError(event) {
   console.error(event);
  }

}
