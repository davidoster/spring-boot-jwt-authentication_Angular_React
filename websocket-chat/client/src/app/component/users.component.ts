import {Component}        from '@angular/core';
import {HostListener}     from '@angular/core';
import {AppService}       from '../service/app.service';
import {User}             from '../data/user';
import {WebSocketService} from '../service/websocket.service';
import {AppDataService}   from '../service/appdata.service';
import {Message}          from '../data/message';

@Component({
  selector: 'users',
  templateUrl: '../template/users.component.html',
  styleUrls: ['../style/user.component.css']
})
export class UsersComponent {

  users: User[] = new Array();
  websocket: WebSocket;

  constructor(private appService: AppService,
              private appDataService: AppDataService,
              private websocketService: WebSocketService) {
    this.websocket = this.websocketService.createNew();
    this.websocket.onopen = (event: MessageEvent) => {
      let message: Message = {
        type: 'JOINED',
        from: this.appDataService.userId,
        fromUserName: this.appDataService.userName,
        message: null
      }
      this.websocket.send(JSON.stringify(message));
    }
    this.initUserList();
    this.startListening();
  }

  startListening() {
    this.websocket.onmessage = (event: MessageEvent) => {
      let message: Message = JSON.parse(event.data);
      if (message.type == 'JOINED') {
        this.setUserStatus(message.from, true);
      } else if (message.type == 'LEFT') {
        this.setUserStatus(message.from, false);
      }
    }
  }

  initUserList() {
    this.appService.listUser().subscribe(response => {
      this.users = response;
      this.setEachUserOnlineOffline();
    });
  }

  setEachUserOnlineOffline() {
    this.users.forEach(user => user.isOnline = false);
  }

  setUserStatus(userId: Number, isOnline: boolean) {
    let user: User = this.users.find(u => u.id == userId);
    user.isOnline = isOnline;
  }

  @HostListener('window:beforeunload')
  close() {
    let message: Message = {
      type: 'LEFT',
      from: this.appDataService.userId,
      fromUserName: this.appDataService.userName,
      message: null
    }
    this.websocket.send(JSON.stringify(message));
  }

}