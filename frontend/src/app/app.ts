import { Component, OnInit, signal } from '@angular/core';
import { ColumnDto } from '../services/api-client/models/column-dto';
import { HttpClient } from '@angular/common/http';
import { Api } from '../services/api-client/api';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Toast,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  columns: ColumnDto[] = [];

  constructor(private httpClient: HttpClient, private api: Api) {
  }

  ngOnInit() {

  }
}
