

export interface BanEntry{
    Username: string[];                        // Player's known username
    Hash: string[];                            // Player's known hashes
    IPs: string[];                             // Player's known IPs
    URL: string;                               // An URL for the acusation
    Reasons: string[];                      
    Servers: string[];
}


export enum BanReason{
    Hacking = 0,
    Greifing = 1,
}