import { MessageHelper } from "./messageHelper";
import * as cleanTextUtils from 'clean-text-utils';
import { escapeString } from "../utils/textUtils";


//https://openbase.com/js/node-json-db
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
const db = new JsonDB(new Config("myDataBase", true, true, '/'));
const folderPrefix = "/users";
import emojiStrip from 'emoji-strip';
import { write } from "fs";
import { exception } from "console";

//const db = new Database()
/**
 * Denne kan senere utvides. Bruker for å passe på at alle verdier som skal inn i databasen samsvarer
 */
export interface userValPair {
	key: string,
	value: string,
	opt?: any,
}

export interface dbObject {
	name: string,

}

export type dbPrefix = "spin" | "birthday" | "stock" | "mygling" | "week" | "counterSpin" | "ATHspin" | "sCounterWeeklySpin" | "warningCounter" | "dogeCoin" | "test";

export class DatabaseHelper {

	/**
	 * @param prefix - Databaseprefix. Må være av type dbprefix. Nye prefixer MÅ legges til i typen på toppen av databaseHelper.
	 * @param key - Nøkkel: Her bruker du vanligvis brukernavn (message.author.username)
	 * @param value - Verdi som settes i databasen
	 */
	static setValue(prefix: dbPrefix, key: string, value: string) {

		db.push(`${folderPrefix}/${key}/${prefix}`, `${value}`)

	}

	/*
}
/**
* @param prefix - Databaseprefix. Må være av type dbprefix. Nye prefixer MÅ legges til i typen på toppen av databaseHelper.
* @param key - Nøkkel: Her bruker du vanligvis brukernavn (message.author.username)
*/
	static getValue(prefix: dbPrefix, key: string) {
		try {
			const data = db.getData(`${folderPrefix}/${key}/${prefix}`)
			return data;
		} catch (error) {
			db.push(`${folderPrefix}/${key}/${prefix}`, `0`)
			return "0";
		}

	};

	static async getAllUsers() {
		db.getData("users");
	};


	static deleteSpecificPrefixValues(prefix: dbPrefix) {
		const users = db.getData(`${folderPrefix}`);
		Object.keys(users).forEach((el) => {
			db.delete(`${folderPrefix}/${el}/${prefix}`)
		})
	}





	/**
	 * Ser gjennom alle brukere og sammenligner 1 med 2. Hvis 2 er større, setter funksjonen 1 = 2;
	 * Unnskyld fremtidige mennesker som ska prøva å tyda dette her. 
	 * @param prefix1 Compare
	 * @param prefix2 Compare
	 */
	static compareAndUpdateValue(prefix1: dbPrefix, prefix2: dbPrefix) {
		const users = db.getData(`${folderPrefix}`);
		Object.keys(users).forEach((el) => {
			Object.keys(users[el]).forEach((el2) => {
				if (el2 == prefix1) {
					Object.keys(users[el]).forEach((el4) => {
						if (el4 == prefix2) {
							if (users[el][el2] < users[el][el4]) {
								DatabaseHelper.setValue(prefix1, el, users[el][el4])
							}
						}
					})
				}
			})
		})
	}

	static getAllValuesFromPrefix(prefix: dbPrefix) {
		const users = db.getData(`${folderPrefix}`);
		const valueList: ValuePair[] = [];
		Object.keys(users).forEach((el) => {
			Object.keys(users[el]).forEach((el2) => {
				if (el2 == prefix)
					valueList.push({ key: el, val: users[el][el2] })
			})
		})
		return valueList;
	}
	static async nukeDatabase() {
		/*await db.empty().then(() => {
			console.log("Database slettet. Alle verdier er fjernet.")
		})*/
	}

	static stripPrefixFromString(text: string, prefix: dbPrefix) {
		return text.replace(prefix + "-", "");
	}
}
export interface ValuePair {
	key: string;
	val: string;
}
export interface ValuePair {
	key: string;
	val: string;
}
export interface prefixVal {
	anyName: string;
}












