import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HTTPService } from '../service/HTTPService';
import { UtilityService } from '../service/UtilityService';
import { User } from '../model/User';

export class ComponentModel {
    public user: User;
    public dataInit: any;

    protected httpService: HTTPService;
    protected isGuest: boolean;

    constructor(
        titleService: Title,
        route: ActivatedRoute) {

        var self = this;

        //Initial page with default has isGuest is true
        self.user = new User();        

        //Set title
        titleService.setTitle(route.snapshot.data['title']);
    }

    async getData() {
        var self = this;

        self.dataInit = await self.httpService.getDataInit();
        console.log(self.dataInit);

        //Check ajax success
        if (UtilityService.checkSuccess(self.dataInit)) {
            self.user = self.dataInit.user;
            self.isGuest = self.dataInit.isGuest;
        }
    }
}