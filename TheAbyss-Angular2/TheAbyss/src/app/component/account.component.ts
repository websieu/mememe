import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HTTPService } from '../service/HTTPService';
import { NgForm } from '@angular/forms';
import * as $ from "jquery";
import { UtilityService } from '../service/UtilityService';
import { ComponentModel } from './ComponentModel';
import '../../assets/static/js/script';
import '../../assets/static/js/ico';
import '../../assets/static/js/profile';

declare var SCRIPT: any;
declare var ICO: any;
declare var PROFILE: any;

@Component({
    // selector: 'signup-form',
    templateUrl: '../html/account.component.html',
    styleUrls: ['../css/account.component.css'],
    providers: [HTTPService]
})

export class AccountComponent extends ComponentModel {


    constructor(
        public httpService: HTTPService,
        private titleService: Title,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(titleService, route);
        var self = this;
        self.isGuest = true;

        self.getData();
    }

    ngOnInit() {
        var self = this;

        //Call libarary javascript/jquery
        SCRIPT.init();
        ICO.init();
        PROFILE.init();
    }
}