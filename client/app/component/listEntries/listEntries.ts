import * as angular from 'angular';
import { IPRBanService } from '../../service/PRBan/PRBanService';

angular
    .module('PRBan')
    .component('listEntries', {
        templateUrl: './component/listEntries/listEntries.html',

        controller: function (PRBanService: IPRBanService) {
            let ctrl = this;

            PRBanService.getBanEntries().then((data) => {
                ctrl.Entries = data;
            });

            ctrl.Reasons = PRBanService.getBanReasons();
            ctrl.SelectedItem = "";
            ctrl.Search = {
                Reasons: [],
                Hash: undefined,
                Username: undefined,
            }

            ctrl.filterEntries = function (value, index, array) {
                if (ctrl.Search.Hash && value.Hash.indexOf(ctrl.Search.Hash) < 0)
                    return false;

                if (ctrl.Search.Reasons && ctrl.Search.Reasons.length > 0) {
                    var matchesReason = false;
                    for (var j in ctrl.Search.Reasons) {
                        for (var i in value.Reasons) {
                            if (value.Reasons[i] == ctrl.Search.Reasons[j]) {
                                matchesReason = true;
                                break;
                            }

                        }
                        if (matchesReason) {
                            break;
                        }
                    }
                    if (matchesReason)
                        return true;
                    return false;
                } else {
                    return true;
                }
            }
        }
    })

