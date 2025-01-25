import { Colors, Consolefy } from '../lib';

const consolefy = new Consolefy();

consolefy.warn("This action cannot be undone.");
consolefy.success("Operation completed successfully.");
consolefy.error("An error occurred while processing your request.");
consolefy.info("Please note that changes will take effect after a restart.");

consolefy.defineLogLevel("verbose", {
    prefix: "VERBOSE",
    theme: (text) => Colors.bgMagenta(Colors.black(text)),
});

consolefy.log("verbose", "This is a verbose message.");

consolefy.group("Testing");
consolefy.info("This is a test message.");
consolefy.warn("This is a test warning.");
consolefy.groupEnd();

consolefy.success("Test Success")
