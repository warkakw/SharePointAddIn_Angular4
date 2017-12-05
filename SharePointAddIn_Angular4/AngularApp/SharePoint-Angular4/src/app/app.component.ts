import { Component } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'app';
    appNumber: string;
    appHostNumber: string;

    constructor(private http: Http) {

        this.GetData();

    }

    GetData(): void {

        this.getRequest("/web/Lists", false).subscribe(response => {
            this.appNumber = response;
        });

        this.getRequest("/web/Lists", true).subscribe(response => {
            this.appHostNumber = response;
        });

    }

    getRequest(query: string, isCD: boolean): Observable<any> {

        let SPAppWebUrl = decodeURIComponent(this.Get_QueryStringParameter("SPAppWebUrl"));
        let SPHostUrl = decodeURIComponent(this.Get_QueryStringParameter("SPHostUrl"));

        let url: string = "";

        if (isCD == true)
            url = SPAppWebUrl + "/_api/SP.AppContextSite(@target)" + query + "?@target='" + SPHostUrl + "'";
        else
            url = SPAppWebUrl + "/_api" + query;

        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('accept', "application/json;odata=verbose");
        options.headers.append('Content-Type', "application/json;odata=verbose");

        return this.http.get(url, options).map((res: any) => {
            return res.json().d.results.length;
        }).catch((error: any) => Observable.throw(error || 'Server error')).finally(() => { });
    }

    Get_QueryStringParameter(param: string): string {

        try {
            var params = document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == param) {
                    return singleParam[1];
                }
            }
        }
        catch (e) { return null; }
    }

}
