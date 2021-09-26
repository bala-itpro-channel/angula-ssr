import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <span>users {{ users | json}}</span>
    <div #content class="renderer"></div>
  `
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('content') content: any;
  users: any;
  constructor(private http: HttpClient, private renderer: Renderer2) {
    this.http.get('https://jsonplaceholder.typicode.com/users')
      .pipe(

      )
      .subscribe(res => {
        console.log(res);
        this.users = res
      });
      console.log('1 constructor');
  }

  ngOnInit() {
    console.log('2 oninit');
  }

  ngAfterViewInit() {
    console.log('3 ngafterview init');
    console.log('After view Init');
    var p = this.renderer.createElement('p');
    var text = this.renderer.createText('This is dynamically added on after view init');
    // Append the text to the new p element
    this.renderer.appendChild(p, text);
    // Add the p element to the root element #content
    this.renderer.appendChild(this.content.nativeElement, p);
  }
}
