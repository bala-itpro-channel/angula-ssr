import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, APP_ID, Component, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import {makeStateKey, TransferState} from '@angular/platform-browser';

const USERS_KEY = makeStateKey('users');

@Component({
  selector: 'app-test',
  template: `
    <span>users {{ this.users | json}}</span>
    <br>
    <button (click)="clientScript()">Alert</button>
    <br>
    <div #content class="renderer"></div>
  `
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('content') content: any;
  users: any;
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private state: TransferState
  ) {
    if (isPlatformServer(this.platformId)) {
      console.log('1 constructor - isPlatformServer server')
    }
    if (isPlatformBrowser(this.platformId)) {
      console.log('1 constructor - client');
    } else {
      console.log('1 constructor - server');
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const users: any = this.state.get(USERS_KEY, null);
      if (users) {
        console.log('2 - oninit client');
        this.users = users;
      }
    } else {
      console.log('2 - oninit server');
      this.http.get('https://jsonplaceholder.typicode.com/users')
      .pipe()
      .subscribe(res => {
        // console.log(res);
        console.log('2 - oninit API response read and set it in state - server');
        this.users = res
        this.state.set(USERS_KEY, res as any);
      });
    }
    console.log('2 oninit common code');
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('3 ngafterview init- client');
      var p = this.renderer.createElement('p');
      var text = this.renderer.createText('This is dynamically added on after view init');
      // Append the text to the new p element
      this.renderer.appendChild(p, text);
      // Add the p element to the root element #content
      this.renderer.appendChild(this.content.nativeElement, p);
    } else {
      console.log('3 ngafterview init- server');
    }
  }

  clientScript() {
    alert('Client click');
  }
}
