const prideReg = new RegExp(/(penis)|(sex)|(gay)|(xD)|(:3)|(pls)|(mamma)|(porno)|(jÃ¦vla)|(dritt)|(tinder)|(date)|(pÃ¸lse)/ig);
export function doesThisMessageNeedAnEivindPride(content: string, polseCounter: number) {
	let needsToBePrided = false;
	if (Math.random() < 0.10)
		needsToBePrided = true;
	if (polseCounter > 0)
		needsToBePrided = true;
	if (prideReg.test(content))
		needsToBePrided = true
	return needsToBePrided;
}


export function findLetterEmoji(sentLetter: string, isSecond?: boolean, spaceCounter?: number) {
	let letter = "";
	switch (sentLetter.toUpperCase()) {
		case "A":
			letter = isSecond ? "ð°" : "ð¦";
			break;
		case "B":
			letter = isSecond ? "ð±" : "ð§";
			break;
		case "C":
			letter = isSecond ? "Â©ï¸" : "ð¨";
			break;
		case "D":
			letter = "ð©";
			break;
		case "E":
			letter = "ðª";
			break;
		case "F":
			letter = "ð«";
			break;
		case "G":
			letter = "ð¬";
			break;
		case "H":
			letter = "ð­";
			break;
		case "I":
			letter = isSecond ? "â¹" : "ð®";
			break;
		case "J":
			letter = "ð¯";
			break;
		case "K":
			letter = "ð°";
			break;
		case "L":
			letter = "ð±";
			break;
		case "M":
			letter = isSecond ? "âï¸" : "ð²";
			break;
		case "N":
			letter = "ð³";
			break;
		case "O":
			letter = isSecond ? "ð¾" : "ð´";
			break;
		case "P":
			letter = isSecond ? "ð¿ï¸" : "ðµ";
			break;
		case "Q":
			letter = "ð¶";
			break;
		case "R":
			letter = isSecond ? "Â®ï¸" : "ð·";
			break;
		case "S":
			letter = isSecond ? "ð²" : "ð¸";
			break;
		case "T":
			letter = isSecond ? "âï¸" : "ð¹";
			break;
		case "U":
			letter = "ðº";
			break;
		case "V":
			letter = isSecond ? "âï¸" : "ð»";
			break;
		case "W":
			letter = "ð¼";
			break;
		case "X":
			letter = isSecond ? "â" : "ð½";
			break;
		case "Y":
			letter = "ð¾";
			break;
		case "Z":
			letter = "ð¿";
			break;
		case "Ã":
			letter = "ð·ï¸";
			break;
		case "Ã":
			letter = "ð«";
			break;
		case " ":
			letter = "â¬"
			if (spaceCounter == 1)
				letter = "ð¦";
			if (spaceCounter == 2)
				letter = "ðª"
			if (spaceCounter == 3)
				letter = "ð¥"
			if (spaceCounter == 4)
				letter = "â¬"
			if (spaceCounter == 5)
				letter = "ð«"
			if (spaceCounter == 6)
				letter = "ð©"

			break;

		case "0":
			letter = "0ï¸â£";
			break;
		case "1":
			letter = "1ï¸â£";
			break;
		case "2":
			letter = "2ï¸â£";
			break;
		case "3":
			letter = "3ï¸â£";
			break;
		case "4":
			letter = "4ï¸â£";
			break;
		case "5":
			letter = "5ï¸â£";
			break;
		case "6":
			letter = "6ï¸â£";
			break;
		case "7":
			letter = "7ï¸â£";
			break;
		case "8":
			letter = "8ï¸â£";
			break;
		case "9":
			letter = "9ï¸â£";
			break;
		case "!":
			letter = isSecond ? "â" : "â";
			break;
		case "?":
			letter = isSecond ? "â" : "â";
			break;
		case "$":
			letter = "ð²";
			break;

		default:
			letter = "âï¸";
			break;
	}

	return letter;
}