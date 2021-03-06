import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-display/data.service';
import { TotalCases } from '../shared/death-recoveries.model';
import { PatientStatus } from '../shared/patient-status.model';

import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-total-cases',
  templateUrl: './total-cases.component.html',
  styleUrls: ['./total-cases.component.css']
})
export class TotalCasesComponent implements OnInit {

  ResultArray: TotalCases[] = [];
  Recovered = 0;
  Deceased = 0;
  TotalCases = 0;
  ActiveCases = 0;
  TotalRawData = [];

  constructor(private dataService: DataService, private loading: LoadingBarService) { }

  ngOnInit() {
    this.loading.start();
    this.dataService.getDeathRecoveredData().subscribe((result: TotalCases[]) => {
      let data;
      for (const [key, value] of Object.entries(result)) {
        data = value;
        this.ResultArray = data;
      }
      for (const index in this.ResultArray) {
        if (this.ResultArray[index].patientstatus === PatientStatus.Recovered) {
          this.Recovered++;
        } else if (this.ResultArray[index].patientstatus === PatientStatus.Deceased) {
          this.Deceased++;
        }
      }
    }, error => console.log(error));


    this.dataService.getRawData().subscribe(resultData => {
      if (resultData) {
        let RawData;
        for (const [key, value] of Object.entries(resultData)) {
          RawData = value;
        }
        this.TotalRawData = RawData;
        this.TotalCases = RawData.length;
        this.ActiveCases = this.TotalCases - (this.Recovered + this.Deceased);
      }
      this.loading.stop();
    }, error => console.log(error));
  }

}
