import * as mongo from 'mongodb';
import { BanEntry, BanReason } from '../model/BanEntry';
import { User } from '../model/User';
import * as crypto from 'crypto';

// Connection URL 
var url = 'mongodb://localhost:27017/test';



export class PRBanDatabase {
    private static BAN_ENTRIES: string = "BAN_ENTRIES";
    private static USER_ENTRIES: string = "USER_ENTRIES";
    private static DB: mongo.Db;



    private static db(): Promise<mongo.Db> {
        return new Promise((resolve, reject) => {
            if (PRBanDatabase.DB)
                resolve(PRBanDatabase.DB);
            else {
                mongo.MongoClient.connect(url, (error, db) => {

                    if (error) {

                        reject(error);

                    } else {

                        PRBanDatabase.DB = db;
                        resolve(PRBanDatabase.DB);
                    }
                });
            }


        });
    }


    private getBanEntryByHash(hash: string): Promise<BanEntry> {
        return undefined;
    }
    private getBanEntryByUsername(username: string): Promise<BanEntry> {
        return undefined;
    }
    private getBanEntryByIP(ip: string): Promise<BanEntry> {
        return undefined;
    }


    public static userExists(username: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            PRBanDatabase.db().then((db) => {

                // Get the documents collection 
                var collection = db.collection(PRBanDatabase.USER_ENTRIES);

                // Get the user entry
                collection
                    .findOne({ Username: username })
                    .then((user: User) => {
                        if (user != null) {

                            let salt = user.Salt;
                            let storedPassword = user.Password;

                            let hash = crypto
                                .createHash('sha256')
                                .update(password)
                                .update(salt)
                                .digest('hex');

                            if (storedPassword == hash) {
                                resolve(true);
                                return;
                            }
                        }
                        resolve(false);
                    }, (error) => {
                        reject(error);
                    });
            }, (error) => reject(error));
        });
    }

    public static addUser(username: string, password: string, server: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            PRBanDatabase.db().then((db) => {

                // Do all crypt stuff
                let salt = crypto.randomBytes(256).toString("hex");
                let hashedPassword = crypto
                    .createHash('sha256')
                    .update(password)
                    .update(salt)
                    .digest('hex');

                // Create User
                let user: User = {
                    Username: username,
                    Password: hashedPassword,
                    Salt: salt,
                    Server: server
                };

                // Get the documents collection 
                var collection = db.collection(PRBanDatabase.USER_ENTRIES);

                // Add the user to collection
                collection
                    .insertOne(user)
                    .then((result: mongo.InsertOneWriteOpResult) => {
                        if (result && result.insertedCount > 0) {
                            resolve(true);
                        }
                        resolve(false);
                    }, (error) => {
                        reject(error);
                    });
            }, (error) => reject(error));
        });
    }

    public static getBanEntries(): Promise<BanEntry[]> {
        return new Promise((resolve, reject) => {
            PRBanDatabase.db().then((db) => {
                // Get the documents collection 
                var collection = db.collection(PRBanDatabase.BAN_ENTRIES);

                // Find all ban entries
                collection.find({}).toArray(function (err, docs) {
                    resolve(docs);
                });
            }, (error) => reject(error));
        });
    }


    public staticgetBanEntry(): PRBanEntryOptions {
        return {
            byHash: this.getBanEntryByHash,
            byUsername: this.getBanEntryByUsername,
            byIP: this.getBanEntryByIP
        }
    }

    public static addBanEntry(entry: BanEntry): Promise<BanEntry> {
        return new Promise((resolve, reject) => {
            PRBanDatabase.db().then((db) => {

                // Get the documents collection 
                var collection = db.collection(PRBanDatabase.BAN_ENTRIES);


                // Insert some documents 
                collection.insertOne(entry, function (err: mongo.MongoError, result: mongo.InsertOneWriteOpResult) {
                    resolve(result.ops[0]);

                });
            }, (error) => reject(error));
        });
    }

    public updateBanEntry(entry: BanEntry): Promise<BanEntry> {
        return new Promise((resolve, reject) => {
            PRBanDatabase.db().then((db) => {

                // Get the documents collection 
                var collection = db.collection(PRBanDatabase.BAN_ENTRIES);

                // Update document where a is 2, set b equal to 1 
                collection.updateOne({ a: 2 }
                    , { $set: { b: 1 } }, function (err, result) {

                        resolve(result);
                    });
            }, (error) => reject(error));


        });
    }
}





export interface PRBanEntryOptions {
    byHash(hash: string): Promise<BanEntry>
    byUsername(username: string): Promise<BanEntry>
    byIP(ip: string): Promise<BanEntry>
}