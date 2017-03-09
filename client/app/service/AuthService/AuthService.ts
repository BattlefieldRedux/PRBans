import * as angular from 'angular';
import { BanEntry } from '../../../../model/BanEntry';

angular
    .module("PRBan")
    .value("Credentials", {})
    .service("AuthService", function ($http: angular.IHttpService, $q: angular.IQService, Credentials): IAuthService {
        let that = this;
        let mIsAuthenticated = false;

        function isAuthenticated(): boolean {
            return that.mIsAuthenticated;
        }
        function authenticate(username: string, password: string): angular.IPromise<boolean> {
            return $q(function (resolve, reject) {
                Credentials.Username = username;
                Credentials.Password = password;


                $http
                    .get("http://localhost:8080/v1/entries")
                    .then((data) => {
                        that.mIsAuthenticated = true;
                        resolve(that.mIsAuthenticated);

                    }, (error) => {
                        console.error(error);
                        that.mIsAuthenticated = false;
                        resolve(that.mIsAuthenticated);
                    })
            });
        }


        return {
            isAuthenticated: isAuthenticated,
            authenticate: authenticate,        }
    });


export interface IAuthService {
    isAuthenticated(): boolean;
    authenticate(username: string, password: string): angular.IPromise<boolean>;
}