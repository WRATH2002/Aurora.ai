export function formatDate() {
  const now = new Date();

  let day = now.getDate();
  let month = now.getMonth() + 1; // Months are zero-based
  let year = now.getFullYear();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Adjust 0 to 12 for midnight/noon

  // Add leading zeros to day, month, minutes
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day}/${month}/${year}/${hours}/${minutes}/${seconds}/${amOrPm}`;
}

export function getDurationFromPresent(dateStr) {
  // Parse the input string "dd/mm/yyyy/hour/minute/sec/am or pm"
  const [day, month, year, hour, minute, second, period] = dateStr?.split("/");

  // Convert the 12-hour format to 24-hour format
  let hour24 = parseInt(hour);
  if (period === "PM" && hour24 !== 12) {
    hour24 += 12;
  } else if (period === "AM" && hour24 === 12) {
    hour24 = 0;
  }

  // Create the Date object from the parsed values
  const parsedDate = new Date(
    year, // Year
    parseInt(month) - 1, // Month (0-indexed in JS Date)
    day, // Day
    hour24, // Hour (24-hour format)
    minute, // Minute
    second // Second
  );

  // Get the current date and calculate the difference in milliseconds
  const now = new Date();
  const diffMs = now - parsedDate;

  // Convert the difference into various time units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30.44); // Approximate
  const diffYears = Math.floor(diffMonths / 12);

  // Determine the duration based on the rules
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`; // Less than 1 hour -> show in minutes
  } else if (diffHours < 24) {
    return `${diffHours}h ago`; // Greater than 1 hour and less than 24 hours
  } else if (diffDays < 7) {
    return `${diffDays}d ago`; // Greater than 1 day and less than 7 days
  } else if (diffWeeks < 4) {
    return `${diffWeeks} weeks ago`; // Greater than 7 days and less than 4 weeks
  } else if (diffMonths < 12) {
    return `${diffMonths} months ago`; // Greater than 4 weeks and less than 12 months
  } else {
    return `${diffYears} years ago`; // Greater than 12 months
  }
}

export function checkAndRemoveWelcomeFile(arr) {
  return arr?.filter((data) => data != "Welcome to Obsidian");
}

// export function checkAndAddWelcomeFile(arr){
//   let tempArr = arr;

// }

export function checkAndAddFiles(
  arr,
  fileName,
  setSelected,
  fileStackedWithInfo,
  setFileStackedWithInfo
) {
  let flag = 0;
  let ind = 0;
  let tempArr = [];
  let tempArrWithInfo = [];

  arr?.forEach((element, index) => {
    if (element == fileName) {
      flag = 1;
      ind = index;
    }
    if (element !== "Welcome to Obsidian") {
      tempArr.push(element);
    }
  });

  // fileStackedWithInfo?.forEach((data) => {
  //   tempArrWithInfo?.push(data);
  // });

  if (flag == 0) {
    setSelected(tempArr.length);
    // tempArrWithInfo?.push({
    //   Title: fileName,
    //   Content: "",
    //   LastSaved: "",
    // });

    tempArr.push(fileName);
  } else {
    setSelected(ind);
  }

  // setFileStackedWithInfo(["sgf", "SDF"]);

  return tempArr;
}
