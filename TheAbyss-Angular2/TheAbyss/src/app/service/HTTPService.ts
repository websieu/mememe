import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { DataInit } from '../model/DataInit';
var url = 'http://localhost:3333';
var dataInit: any;

var httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'my-auth-token'
    }),
    withCredentials: true
};

var httpOptionsGet = {
    withCredentials: true
};

@Injectable()
export class HTTPService {
    errorMessage: any;

    constructor(private http: HttpClient) { }

    //Post order buy to server api
    postRegister(data): Promise<any> {
        var self = this;
        console.log('loading register to server api ...');
        return new Promise<any>(resolve => {
            self.http.post(url + '/user/register', data, httpOptions)
                .subscribe(
                    data => resolve(data),
                    error => resolve(error)
                );
        });
    };

    //Post order buy to server api
    postLogin(data): Promise<any> {
        var self = this;
        console.log('loading login to server api ...');
        return new Promise<any>(resolve => {
            self.http.post(url + '/user/login', data, httpOptions)
                .subscribe(
                    data => resolve(data),
                    error => resolve(error)
                );
        });
    };


    getDataInit(): Promise<any> {
        var self = this;
        if (!dataInit) {
            console.log('loading dataInit from server api ...');
            dataInit = new Promise<any>(resolve => self.http.get(url + '/user/data-init', httpOptionsGet)
                .subscribe(
                    data => resolve(dataInit = data),
                    error => resolve(error)
                ));
            return dataInit;
        } else
            return dataInit;
    };

    // getListReview(page = 1): Promise<any> {
    //     var self = this;
    //     console.log('loading list review from server api ...');
    //     return new Promise<any>(resolve => {
    //         self.http.get(url + '/web-api/list-review?page=' + page).subscribe(
    //             data => resolve(data),
    //             error => resolve(error)
    //         );
    //     });
    // };

    // getReviewCheck(ref): Promise<any> {
    //     var self = this;
    //     console.log('loading review check from server api ...');
    //     return new Promise<any>(resolve => {
    //         self.http.get(url + '/review/check/' + ref).subscribe(
    //             data => resolve(data),
    //             error => resolve(error)
    //         );
    //     });
    // };

    // getOrderInfo(ref): Promise<any> {
    //     var self = this;
    //     console.log('loading order info from server api ...');
    //     return new Promise<any>(resolve => {
    //         self.http.get(url + '/web-api/histories/' + ref).subscribe(
    //             data => resolve(data),
    //             error => resolve(error)
    //         );
    //     });
    // };

    // getNews(seoUrl): Promise<any> {
    //     var self = this;
    //     console.log('loading news from server api ...');
    //     return new Promise<any>(resolve => {
    //         self.http.get(url + '/web-api/news/' + seoUrl).subscribe(
    //             data => resolve(data),
    //             error => resolve(error)
    //         );
    //     });
    // };

    // getCats(seoUrl): Promise<any> {
    //     var self = this;
    //     console.log('loading cats from server api ...');
    //     return new Promise<any>(resolve => {
    //         self.http.get(url + '/web-api/cat/' + seoUrl).subscribe(
    //             data => resolve(data),
    //             error => resolve(error)
    //         );
    //     });
    // };

    // getBankAccount(account_name): Promise<any> {
    //     var self = this;
    //     console.log('loading bank account name from server api ...');
    //     return new Promise<any>(resolve => {
    //         self.http.get(url + '/web-api/bank_accounts?bank=' + account_name + '&bankname=vcb')
    //             .subscribe(
    //                 data => resolve(data),
    //                 error => resolve(error)
    //             );
    //     });
    // };

    //post order sell to server api
    // postSellOrder(dataSell): Promise<any> {
    //     var self = this;
    //     console.log('loading post order sell to server api ...');
    //     return new Promise<any>(resolve => {
    //         self.http.post(url + '/web-api/sell_orders', dataSell, httpOptions)
    //             .subscribe(
    //                 data => resolve(data),
    //                 error => resolve(error)
    //             );
    //     });
    // };    
}