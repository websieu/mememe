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

declare var SCRIPT: any;
declare var ICO: any;

@Component({
	selector: 'signup-form',
	templateUrl: '../html/de.component.html',
	styleUrls: ['../css/de.component.css'],
	providers: [HTTPService]
})

export class DeComponent extends ComponentModel {
	register: Register;
	login: Login;
	

	constructor(
		public httpService: HTTPService,
		private titleService: Title,
        private router: Router,
        private route: ActivatedRoute
	) {
		super(titleService, route);
		var self = this;
		self.register = new Register(httpService);
		self.login = new Login(httpService);
		self.isGuest = true;
		
		self.getData();
	}

	ngOnInit() {
		var self = this;

		//Call libarary javascript/jquery
		SCRIPT.init();
		ICO.init();
	}
}

class Login {
	email: string;
	password: string;
	rememberMe: boolean;
	recaptcha: string;

	constructor(private httpService: HTTPService) {
		this.email = '';
		this.password = '';
		this.rememberMe = false;
		this.recaptcha = '';
	}

	get dataLogin() {
		return {
			email: this.email,
			password: this.password,
			rememberMe: this.rememberMe,
			recaptcha: this.recaptcha
		}
	}

	async submitLogin() {
		var data = await this.httpService.postLogin(this.dataLogin);
		if (UtilityService.checkSuccess(data)) {
			alert('Login success');
			(<any>window).location.reload();
		} else {
			alert('Logig fail ' + data.message);
		}
	}
}

class Register {
	email: string;
	password: string;
	passwordConfirm: string;
	recaptcha: string;

	constructor(private httpService: HTTPService) {
		this.email = '';
		this.password = '';
		this.passwordConfirm = '';
		this.recaptcha = '';
	}

	get dataRegister() {
		return {
			email: this.email,
			password: this.password,
			passwordConfirm: this.passwordConfirm,
			recaptcha: this.recaptcha
		}
	}

	async submitRegister() {
		var data = await this.httpService.postRegister(this.dataRegister);
		if (UtilityService.checkSuccess(data)) {
			alert('Register success. Please check email to active.');
		} else {
			alert('Register fail. ' + data.message);
		}
	}
}