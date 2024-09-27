import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SwUpdate} from "@angular/service-worker";
 interface City {
  id?: number;
  name?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'service-worker';

  controllerUrl = `http://localhost:3000/cities`;

  cities : City[] = []

  constructor(private httpClient : HttpClient, private swUpdate : SwUpdate) {
    this.getAll().subscribe((data)=> {
      this.cities = data
    })
  }

  getAll(): Observable<City[]> {
    return this.httpClient.get<City[]>(this.controllerUrl);
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      console.log(this.swUpdate.isEnabled,'this.swUpdate.isEnabled')
    }
    this.swUpdate.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          window.location.reload()
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    });
  }

}
