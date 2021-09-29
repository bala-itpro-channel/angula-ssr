import { isPlatformBrowser } from '@angular/common';
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
    console.log('1 constructor');
  }

  ngOnInit() {
    const users: any = this.state.get(USERS_KEY, null);
    // if (isPlatformBrowser(this.platformId)) {
    if (users) {
      console.log('oninit client');
      this.users = users;
    } else {
      console.log('oninit server');
      this.http.get('https://jsonplaceholder.typicode.com/users')
      .pipe()
      .subscribe(res => {
        // console.log(res);
        this.users = res
        this.state.set(USERS_KEY, res as any);
      });
    }
    console.log('2 oninit');
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('3 ngafterview init');
      console.log('After view Init - client');
      var p = this.renderer.createElement('p');
      var text = this.renderer.createText('This is dynamically added on after view init');
      // Append the text to the new p element
      this.renderer.appendChild(p, text);
      // Add the p element to the root element #content
      this.renderer.appendChild(this.content.nativeElement, p);
    } else {
      console.log('ngAfterViewInit From server')
    }
  }

  clientScript() {
    alert('Client click');
  }
}
