import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  constructor(
    private event: FormBuilder,
  ) {
  }

  ngOnInit() {
  }

  createEvent() {
  }
}
