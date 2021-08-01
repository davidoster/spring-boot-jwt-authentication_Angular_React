import {Component}  from '@angular/core';
import { AppDataService } from '../service/appdata.service';

@Component({
  selector: 'chat',
  templateUrl: '../template/chat.component.html',
  styleUrls: ['../style/chat.component.css']
})
export class ChatComponent {

  loggedInUser: String;

  constructor(private appDataService: AppDataService) {
    this.loggedInUser = appDataService.userName;
  }

  private doLogout() {

  }

}