const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.stdoutMuted = true;

const consoleSuccess = "\x1b[32m";
const consoleError = "\x1b[31m";
const consoleClear = "\x1b[0m";

readline.question(
  "What should we call your first database table? \n The database table name can only contain letters[Aa] and numbers[123]\n",
  (projectname) => {
    if (!projectname.match(/^[a-zA-Z0-9_-\s]*$/)) {
      console.log(
        consoleError,
        "The project name can only contain letters and numbers",
        consoleClear,
        `${projectname}`
      );
      console.log(consoleClear, ""); //Reset colors
      process.exit(1);
    }
    console.log(consoleSuccess, "didnt fail");
    console.log(consoleClear, ""); //Reset colors
    process.exit(1);
  }
);
