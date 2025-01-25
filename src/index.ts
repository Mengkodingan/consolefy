import { bgBlue, bgGreen, bgRed, bgYellow, black } from "colorette";

type Config = {
  prefixes?: {
    warn?: string;
    success?: string;
    error?: string;
    info?: string;
    [key: string]: string | undefined;
  };
  format?: string;
  theme?: {
    warn?: (text: string) => string;
    success?: (text: string) => string;
    error?: (text: string) => string;
    info?: (text: string) => string;
    [key: string]: ((text: string) => string) | undefined;
  };
};

class Consolefy {
  private config: Config;

  constructor(initialConfig: Config = {}) {
    this.config = {
      prefixes: {
        warn: "WARN",
        success: "SUCCESS",
        error: "ERROR",
        info: "INFO",
        ...initialConfig.prefixes,
      },
      format: initialConfig.format || "{prefix} {message}",
      theme: {
        warn: (text) => bgYellow(black(text)),
        success: (text) => bgGreen(black(text)),
        error: (text) => bgRed(black(text)),
        info: (text) => bgBlue(black(text)),
        ...initialConfig.theme,
      },
    };
  }

  setConfig(newConfig: Config): void {
    this.config = {
      ...this.config,
      ...newConfig,
      prefixes: { ...this.config.prefixes, ...newConfig.prefixes },
      theme: { ...this.config.theme, ...newConfig.theme },
    };
  }

  private formatMessage(type: keyof NonNullable<typeof this.config.prefixes>, message: string): string {
    return this.config.format
        ?.replace(/{prefix}/g, (this.config.theme as any)?.[type]?.(` ${this.config.prefixes?.[type]} `) as string)
        ?.replace(/{message}/g, message) || `${message}`;
  }

  setPrefix(type: keyof NonNullable<typeof this.config.prefixes>, prefix: string): void {
    this.config.prefixes = { ...this.config.prefixes, [type]: prefix };
  }

  setTheme(type: keyof NonNullable<typeof this.config.theme>, theme: (text: string) => string): void {
    this.config.theme = { ...this.config.theme, [type]: theme };
  }

  setFormat(format: string): void {
    this.config.format = format;
  }

  warn(...messages: any[]): void {
    console.log(`\n${this.formatMessage("warn", messages.join(" "))}`);
  }

  success(...messages: any[]): void {
    console.log(`\n${this.formatMessage("success", messages.join(" "))}`);
  }

  error(...messages: any[]): void {
    console.log(`\n${this.formatMessage("error", messages.join(" "))}`);
  }

  info(...messages: any[]): void {
    console.log(`\n${this.formatMessage("info", messages.join(" "))}`);
  }
}

export default Consolefy;
