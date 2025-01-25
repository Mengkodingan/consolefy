import { Colors, Consolefy } from '../lib';

const consolefy = new Consolefy();

consolefy.log("Just a regular log.");
consolefy.warn("This action cannot be undone.");
consolefy.success("Operation completed successfully.");
consolefy.error("An error occurred while processing your request.");
consolefy.info("Please note that changes will take effect after a restart.");

consolefy.defineLogLevel("verbose", {
    prefix: "VERBOSE",
    theme: (text) => Colors.bgMagenta(Colors.black(text)),
});

consolefy.log("verbose", "This is a verbose message.");
consolefy.log("success", "This is a success message from log method.");

consolefy.group("Testing");
consolefy.info("Starting a new test.");
consolefy.warn("Has one warning.");
consolefy.success("Test Success.");
consolefy.groupEnd();

consolefy.setTag("performance");
consolefy.info("Info message with tag");

consolefy.setFormat("{tag} {prefix} {message}");
consolefy.warn("Tag first before prefix because custom format.");

consolefy.resetFormat()
consolefy.warn("The format has been reset.");

consolefy.resetTag();
consolefy.info("Info message without tag because it has been reset.");

