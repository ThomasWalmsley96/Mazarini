
import { Message } from "discord.js";
import { parse } from "dotenv/types";
import { discordSecret, lfKey } from "../client-env";
import { DatabaseHelper } from "../helpers/databaseHelper";
import { MessageHelper } from "../helpers/messageHelper";
import { replaceLast } from "../utils/textUtils";
import { ICommandElement } from "./commands";
const fetch = require("node-fetch");
export type musicCommand = "top";

export type topMethods = "songs" | "artist" | "album" | "tags";

export type commandTypes = "topp";
interface musicMethod {
    description: string;
    title: string;
    command: commandTypes;
}

export const methods: musicMethod[] = [
    { title: "Topp", description: "Hent ut en toppliste (Artist, album, sanger eller tags)", command: "topp" },

]

interface fetchData {
    user: string;
    method: {
        cmd: string,
        desc: string,
    };
    limit: string;
    includeStats: boolean;
}

export class Music {
    static readonly baseUrl = "http://ws.audioscrobbler.com/2.0/";
    static findCommand(message: Message, content: string, args: string[]) {

        if (!args[0]) {
            message.reply("Feilformattert. Mangler du f.eks 'topp'?")
            return
        }

        /** CHECKS at alt eksistere */
        const method = methods.filter(e => e.command == args[0])[0];
        if (args[0] != "user") {
            if (!method) {
                message.reply("Kommandoen eksisterer ikke. Bruk 'topp'")
                return;
            }
            const username = Music.getLastFMUsernameByDiscordUsername(message.author.username, message)
            if (!username) {
                message.reply("Du har ikke registrert brukernavnet ditt. Bruk '!mz musikk user <discordnavn> <last.fm navn>")
                return;
            }
            const cmd = Music.getCommand(method.command, args[1])
            if (!cmd) {
                message.reply("kommandoen mangler 'artist', 'songs' eller 'album' bak topp")
                return;
            }

            /** CHECKS END */

            const data: fetchData = {
                user: username,
                method: { cmd: cmd, desc: method.title },
                limit: args[2] ?? "10",
                includeStats: !!args[3]

            }
            this.findLastFmData(message, data);
        } else {
            if (args[1] && args[2]) {
                if (args[1] !== message.author.username) {
                    message.reply("du kan kun knytte ditt eget brukernavn")
                    return;
                }
                Music.connectLastFmUsernameToUser(args[1], args[2], message)
                message.reply("Knyttet bruker " + args[1] + " til Last.fm brukernavnet " + args[2]);
            } else {
                message.reply("formattering skal v??re '!mz music user DISCORDNAVN LAST.FMNAVN")
            }
        }
    }
    static getCommand(c: commandTypes, s: string) {
        switch (c) {
            case "topp":
                if (s as topMethods)
                    return this.findTopMethod(s);
        }
    }
    static findTopMethod(m: string) {
        const base = "user."
        switch (m) {
            case "album":
                return base + "gettopalbums";
            case "artist":
                return base + "gettopartists"
            case "songs":
                return base + "gettoptracks";
            case "tags":
                return base + "gettoptags";
            default:
                return undefined;
        }
    }
    /*
Docs: https://www.last.fm/api/show/user.getInfo
    */

    static async findLastFmData(message: Message, dataParam: fetchData) {
        if (parseInt(dataParam.limit) > 30) {
            message.reply("Litt for h??y limit, deranes")
            return;
        } else if (!parseInt(dataParam.limit)) {
            dataParam.limit = "10";
            dataParam.includeStats = true;
        }
        const msg = await MessageHelper.sendMessage(message, "Laster data...")
        const apiKey = lfKey;

        let artistString = dataParam.method.desc + " " + dataParam.limit;
        Promise.all([
            fetch(Music.baseUrl + `?method=${dataParam.method.cmd}&user=${dataParam.user}&api_key=${apiKey}&format=json&limit=${dataParam.limit}`, {
                method: "GET",
            }),
            fetch(Music.baseUrl + `?method=user.getinfo&user=${dataParam.user}&api_key=${apiKey}&format=json`)
        ])
            .then(([resTop, resInfo]) => {
                Promise.all([
                    resTop.json(),
                    resInfo.json()
                ])
                    .then(([topData, info]) => {
                        const totalPlaycount = info["user"].playcount ?? "1";
                        let prop;
                        const strippedMethod = dataParam.method.cmd.replace("user.get", "");
                        const methodWithoutGet = replaceLast(strippedMethod.replace("top", ""), "s", "");
                        artistString += " " + methodWithoutGet + "s";
                        prop = topData[strippedMethod][methodWithoutGet] as { name: string, playcount: string, artist?: { name: string } }[];
                        let numPlaysInTopX = 0;
                        if (prop) {

                            prop.forEach((element: { name: string, playcount: string, artist?: { name: string } }) => {
                                numPlaysInTopX += (parseInt(element.playcount));
                                artistString += `\n${element.artist ? element.artist.name + " - " : ""}${element.name} (${element.playcount} plays) ${dataParam.includeStats ? ((parseInt(element.playcount) / parseInt(totalPlaycount)) * 100).toFixed(1) + "%" : ""} `
                            });
                            artistString += `\n*Totalt ${topData[strippedMethod]["@attr"].total} ${methodWithoutGet}s i biblioteket`
                        }
                        else
                            message.reply("Fant ingen data. Kanskje feilformattert?")

                        artistString += `, ${totalPlaycount} totale avspillinger.  ${dataParam.includeStats ? (numPlaysInTopX / parseInt(totalPlaycount) * 100).toFixed(1) + "% av avspillingene er fra dine topp " + dataParam.limit + "." : ""}* `

                        if (msg)
                            msg.edit(artistString)
                        else
                            MessageHelper.sendMessage(message, artistString);
                    });
            }).catch((error: any) => console.log(error));

    }

    static getLastFMUsernameByDiscordUsername(username: string, rawMessage: Message) {
        return DatabaseHelper.getValue("lastFmUsername", username, rawMessage, true);
    }
    static connectLastFmUsernameToUser(username: string, lfUsername: string, rawMessage: Message) {
        return DatabaseHelper.setValue("lastFmUsername", username, lfUsername)
    }



    static readonly musicCommands: ICommandElement = {
        commandName: "musikk",
        description: "Bruk '!mz musikk <topp> <songs|albums|artist> <limit?>(valgfri)",
        hideFromListing: true,
        isAdmin: true,
        command: (rawMessage: Message, messageContent: string, args: string[]) => {
            Music.findCommand(rawMessage, messageContent, args);
        }
    }
}