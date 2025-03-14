function getMonthCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0); // Last day of the month

  const weeks = [];
  let week = [];

  // Fill the first week with placeholders (-1) until the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push({
      date: -1,
      day: new Date(1970, 0, i + 4).toLocaleString("en-US", {
        weekday: "long",
      }),
    });
  }

  // Iterate through all dates in the month
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const currentDate = new Date(year, month - 1, date);
    week.push({
      date: currentDate.getDate(),
      day: currentDate.toLocaleString("en-US", { weekday: "long" }),
    });

    // If the day is Saturday (end of the week), finalize the week
    if (currentDate.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
  }

  // Fill the last week with placeholders (-1) until Saturday
  for (let i = week.length; i < 7; i++) {
    week.push({
      date: -1,
      day: new Date(1970, 0, i + 4).toLocaleString("en-US", {
        weekday: "long",
      }),
    });
  }
  if (week.length) weeks.push(week); // Add the last week if it's not empty

  // Filter out weeks that contain only placeholders
  const filteredWeeks = weeks.filter(
    (week) => !week.every((day) => day.date === -1)
  );
  console.log(filteredWeeks);

  return filteredWeeks;
}

function camalCase(str) {
  let charArr = str?.split("");
  charArr[0] = charArr[0].toUpperCase();
  return charArr.join("");
}

function getFormattedDateAndTime() {
  const dateObj = new Date();
  const day = dateObj.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const period = hours >= 12 ? "pm" : "am";

  // Format the time in 12-hour format
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, "0");

  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // 4th to 20th are "th"
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formattedDate = `${day}${ordinalSuffix(day)} ${month}, ${year}`;
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

  return formattedDate;
}

function swapAlphabet(char) {
  if (!char.match(/[a-zA-Z]/)) return char; // Non-alphabet characters remain unchanged

  const isUpperCase = char === char.toUpperCase();
  const alphabet = isUpperCase
    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    : "abcdefghijklmnopqrstuvwxyz";
  const reversedAlphabet = alphabet.split("").reverse().join("");
  const index = alphabet.indexOf(char);

  return reversedAlphabet[index];
}

function processStringEncrypt(str) {
  // Step 1: Swap characters
  const swappedString = str.split("").map(swapAlphabet).join("");

  const lengthOdd = str.length % 2 !== 0;
  const groupSize = lengthOdd ? 3 : 4; // Group of 3 for odd, 4 for even lengths

  // Step 2: Group into smaller groups of `groupSize`
  const groups = [];
  for (let i = 0; i < swappedString.length; i += groupSize) {
    let group = swappedString.slice(i, i + groupSize);
    while (group.length < groupSize) group += "`"; // Add padding
    groups.push(group);
  }

  // Step 3: Group into groups of 3 or 4 groups
  const groupOfGroupsSize = lengthOdd ? 3 : 4;
  const groupedGroups = [];
  for (let i = 0; i < groups.length; i += groupOfGroupsSize) {
    groupedGroups.push(groups.slice(i, i + groupOfGroupsSize));
  }

  // Step 4: Reverse substrings, reverse sub-groups, and reverse the groups
  const processedGroups = groupedGroups
    .map(
      (subGroups) =>
        subGroups
          .map((subString) => subString.split("").reverse().join("")) // Reverse each string
          .reverse() // Reverse sub-groups
    )
    .reverse(); // Reverse main group

  // Step 5: Flatten and join all groups
  return processedGroups.flat().join("");
}

function processStringDecrypt(encryptedStr) {
  const lengthOdd = encryptedStr.replace(/`/g, "").length % 2 !== 0;
  const groupSize = lengthOdd ? 3 : 4;
  const groupOfGroupsSize = lengthOdd ? 3 : 4;

  // Step 1: Reverse the encryption steps
  const groups = [];
  for (let i = 0; i < encryptedStr.length; i += groupSize) {
    groups.push(encryptedStr.slice(i, i + groupSize));
  }

  const groupedGroups = [];
  for (let i = 0; i < groups.length; i += groupOfGroupsSize) {
    groupedGroups.push(groups.slice(i, i + groupOfGroupsSize));
  }

  const reversedGroups = groupedGroups.reverse().map(
    (subGroups) =>
      subGroups
        .reverse() // Reverse sub-groups
        .map((subString) => subString.split("").reverse().join("")) // Reverse each string
  );

  const flattenedString = reversedGroups.flat().join("");

  // Step 2: Remove padding
  const cleanedString = flattenedString.replace(/`/g, "");

  // Step 3: Swap back to original characters
  return cleanedString.split("").map(swapAlphabet).join("");
}

export {
  getMonthCalendar,
  camalCase,
  getFormattedDateAndTime,
  processStringEncrypt,
  processStringDecrypt,
};
