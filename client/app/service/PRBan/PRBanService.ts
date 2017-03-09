import * as angular from 'angular';
import { BanEntry } from '../../../../model/BanEntry';

angular
    .module("PRBan")
    .service("PRBanService", function ($http: angular.IHttpService, $q: angular.IQService): IPRBanService {
        function getBanEntries(): angular.IPromise<BanEntry[]> {
            return $q(function (resolve, reject) {
                setTimeout(() => {
                    resolve(DATA);
                }, 5000);
            });
        }

        function getBanEntry(hash: string): angular.IPromise<BanEntry> {
            return $q(function (resolve, reject) {
                for (var k in DATA) {
                    if (DATA[k].Hash.indexOf(hash) != -1)
                        resolve(DATA[k]);
                }
                reject();
            });
        }

        function saveBanEntry(entry: BanEntry): angular.IPromise<BanEntry> {
            return $q(function (resolve, reject) {
                setTimeout(() => {
                    DATA.push(entry);
                    resolve(entry);
                }, 5000);
            });
        }

        function getBanReasons() {
            return ["Hacking", "Other", "Acusation", "Griefing", "Personal"]
        }

        function getServers() {
            return ["Hacking", "Other", "Acusation", "Griefing", "Personal"]
        }

        return {
            getBanEntries: getBanEntries,
            saveBanEntry: saveBanEntry,
            getBanEntry: getBanEntry,
            getBanReasons: getBanReasons,
            getServers: getServers
        }

    });


export interface IPRBanService {
    getBanEntries(): angular.IPromise<BanEntry[]>;
    saveBanEntry(entry: BanEntry): angular.IPromise<BanEntry>;
    getBanEntry(hash: string): angular.IPromise<BanEntry>;
    getServers(): string[];
    getBanReasons(): string[];
}


var DATA: BanEntry[] = [{
    "Hash": [
        "1a3sd21f65ert4s69dr8t7sdf316vg8rsd",
        "aes165r3c1a3se8x2ae386rxa6e8r7eara",
        "a5er4xa62ex47r6a8e7ra1x26e4r1ax6e4",
    ],
    "Username": [
        "Username 1",
        "Username 2",
        "Username 3",
        "Username 4"
    ],
    "IPs": [
        "192.168.1.1",
    ],
    "URL": "http://www.google.com",
    "Reasons": [
        "Griefing"
    ],
    "Servers": []
},
{
    "Hash": [
        "321a3c21asr6e85t7ser6t18scer7tfc"
    ],
    "Username": [
        "Username A",
        "Username B",
    ],
    "IPs": [
        "10.10.1.1",
        "10.10.2"
    ],
    "URL": "http://www.google.com",
    "Reasons": [
        "Hacking"
    ],
    "Servers": [
        "Server A",
        "Server B"
    ]
}
];