import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxEditorModule } from 'ngx-editor';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxEditorModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Wed_dientu';
}
