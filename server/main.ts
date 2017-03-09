
import * as restify from 'restify';
import { PRBanDatabase } from './Database';




class PRBanServer {
  private mServer: restify.Server;

  constructor() {
    this.mServer = restify.createServer({
      name: 'PRBans'
    });

    this.mServer.use(restify.fullResponse());
    this.mServer.use(restify.CORS());
    this.mServer.use(restify.authorizationParser());
    this.mServer.use(restify.bodyParser());
    this.mServer.use(restify.queryParser());

    restify.CORS.ALLOW_HEADERS.push('authorization');

    this.mServer.get('v1/entries', PRBanServer.authenticate, PRBanServer.getEntries);            // Get Entries Collection
    this.mServer.get('v1/entries/:hash', PRBanServer.authenticate, PRBanServer.getEntry);        // Get Specific Entry
    this.mServer.get('v1/entries/count', PRBanServer.authenticate, PRBanServer.getEntryCount);   // Get count of all entries
    this.mServer.post('v1/entries', PRBanServer.authenticate, PRBanServer.addEntry);             // Adds an entry to the collection
    this.mServer.put('v1/entries/:hash', PRBanServer.authenticate, PRBanServer.updateEntry);     // Updates specific entry
    this.mServer.del('v1/entries/:hash', PRBanServer.authenticate, PRBanServer.deleteEntry);     // Deletes specific entry

    this.mServer.listen(8080);
    console.log("Server up and running in port 8080");
  }


  public static authenticate(req: restify.Request, res: restify.Response, next: restify.Next): any {
    console.log("authenticating...");
    if (!req.authorization || !req.authorization.basic) {
      next(new restify.UnauthorizedError());
      return;
    }

    PRBanDatabase
      .userExists(req.authorization.basic.username, req.authorization.basic.password)
      .then((exists) => {
        if (exists)
          next();
        else
          next(new restify.UnauthorizedError("Unknown user with given username/password"));

      }, (error) => {
        next(new Error());
      });
  }

  public static getEntries(req: restify.Request, res: restify.Response, next: restify.Next): any {
    PRBanDatabase
      .getBanEntries()
      .then((entries) => {
        res.json(entries);
        next();
      }, (error) => {
        next(new Error(error));
      });
  }
  public static getEntry(req: restify.Request, res: restify.Response, next: restify.Next): any {

  }

  public static getEntryCount(req: restify.Request, res: restify.Response, next: restify.Next): any {

  }

  public static addEntry(req: restify.Request, res: restify.Response, next: restify.Next): any {
    console.log("[Server]: PUT /entries");

    // Validate Body
    let banEntry = req.body;
    if (!PRBanServer.IsBanEntryValid(banEntry)) {
      next(new Error("Invalid Arguments"));
      return;
    }
    let token = "";
    PRBanDatabase.addBanEntry(banEntry).then((entries) => {
      console.log("[Server]: Entry saved");
      res.json(entries);
      next();
    }, (error) => {
      next(new Error(error));
    });
  }

  public static updateEntry(req: restify.Request, res: restify.Response, next: restify.Next): any {


  }

  public static deleteEntry(req: restify.Request, res: restify.Response, next: restify.Next): any {


  }

  private static IsBanEntryValid(entry) {
    return entry != undefined;
  }
}


new PRBanServer();

//PRBanDatabase.addUser("UTurista", "123456", "Awessome Server");
