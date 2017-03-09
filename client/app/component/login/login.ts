import * as angular from 'angular';
import { IAuthService } from '../../service/AuthService/AuthService';
import { StateService } from 'angular-ui-router';
angular
    .module('PRBan')
    .component('login', {
        templateUrl: './component/login/login.html',

        controller: function ($state: StateService, AuthService: IAuthService) {
            let ctrl = this;
            ctrl.Logging = false;

            ctrl.doLogin = function (username: string, password: string) {
                ctrl.Logging = true;
                ctrl.LoginError = "";
                AuthService
                    .authenticate(username, password)
                    .then((sucess) => {
                        ctrl.Logging = false;
                        if (sucess)
                            $state.transitionTo("listEntries");
                        else
                            ctrl.LoginError = "Unknown user/password!";
                    }, (error) => {
                        ctrl.Logging = false;
                        // display error
                    });

            };
        }
    })

