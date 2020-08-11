import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-positions-modal',
  templateUrl: './positions-modal.component.html',
  styleUrls: ['./positions-modal.component.css']
})
export class PositionsModalComponent implements OnInit {

  @Output() updateSelectedPositions = new EventEmitter();
  user: User;
  positions: any[];
  constructor(public bsModalRef: BsModalRef) {}
  ngOnInit() {
  }

  updatePositions() {
    this.updateSelectedPositions.emit(this.positions);
    this.bsModalRef.hide();
  }

}
