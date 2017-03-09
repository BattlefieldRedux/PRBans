import * as angular from 'angular';
import * as route from 'angular-ui-router';
import 'angular-ui-router';
import 'angular-material';
import 'angular-animate';
import { IAuthService } from './service/AuthService/AuthService';

angular
    .module('PRBan', ['ui.router', 'ngMaterial'])
    .config(function ($stateProvider: route.StateProvider, $urlRouterProvider, $httpProvider) {


        $stateProvider.state({      // State to list all ban entries
            name: 'listEntries',
            url: '/',
            component: 'listEntries',
            data: { requireLogin: true },

        }).state({                  // State to view the details of a ban entry
            name: 'detailEntry',
            url: '/entry/{hash}',
            component: 'detailEntry',
            data: { requireLogin: true },

        }).state('login', {         // State to Login
            name: 'login',
            url: '/login',
            component: 'login',
        });

        $urlRouterProvider.otherwise("/");

        // Register the Basic Authorization interceptor 
        $httpProvider.interceptors.push(function (Credentials) {
            return {
                'request': function (config) {

                    if (Credentials.Username && Credentials.Password) {
                        var auth = window.btoa(`${Credentials.Username}:${Credentials.Password}`);

                        if (!config.headers)
                            config.headers = {};
                        config.headers["Authorization"] = "Basic " + auth;
                        console.log("Basic " + auth);
                    }

                    return config;
                },
            };
        });
    })
    .run(['$transitions', 'AuthService', function ($transitions, AuthService: IAuthService) {

        $transitions.onStart({ to: (state) => { return state.data && state.data.requireLogin } }, function (trans: route.Transition, state: route.State) {

            if (!AuthService.isAuthenticated()) {
                // User isn't authenticated. Redirect to login state
                return trans.router.stateService.target('login');
            }
        });

    }]);


