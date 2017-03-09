import * as angular from 'angular';
import { BanEntry } from '../../../../model/BanEntry';
import { IPRBanService } from '../../service/PRBan/PRBanService';

angular
    .module('PRBan')
    .component('detailEntry', {
        templateUrl: './component/detailEntry/detailEntry.html',

        controller: function ($scope: angular.IScope, $stateParams, PRBanService: IPRBanService) {
            let ctrl = this;

            if (!$stateParams.hash || $stateParams.hash == "new") {
                ctrl.Edit = ctrl.NewEntry = true;
                let newEntry: BanEntry = {
                    Hash: [],
                    Username: [],
                    IPs: [],
                    URL: "",
                    Reasons: [],
                    Servers: []
                };
                ctrl.Entry = newEntry;


            } else {
                ctrl.Edit = ctrl.NewEntry = false;

                PRBanService.getBanEntry($stateParams.hash).then((entry) => {
                    ctrl.Entry = entry;
                });
            }

            ctrl.Reasons = PRBanService.getBanReasons();

            ctrl.back = function () {
                window.history.back();
            }


            ctrl.onEditClickButton = function () {
                if (ctrl.Edit) {
                    // TODO: Validate values
                    ctrl.Entry.Hash = ctrl.EntryHash[0];
                    PRBanService.saveBanEntry(ctrl.Entry).then(
                        (entry) => {
                            console.error("Entry saved.");
                        },
                        (error) => {
                            console.error(error)
                        });
                }

                ctrl.Edit = !ctrl.Edit;

            }
        }
    })