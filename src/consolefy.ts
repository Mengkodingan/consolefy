import { bgBlue, bgGreen, bgRed, bgYellow, black, gray, white } from "colorette";

type Config = {
  prefixes?: {
    warn?: string;
    success?: string;
    error?: string;
    info?: string;
    [key: string]: string | undefined;
  };
  format?: string;
  silent?: boolean;
  tag?: string;
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
  private isGrouping: boolean = false;
  private groupName: string = "";

  constructor(initialConfig: Config = {}) {
    this.config = {
      prefixes: {
        warn: "WARN",
        success: "SUCCESS",
        error: "ERROR",
        info: "INFO",
        ...initialConfig.prefixes,
      },
      format: initialConfig.format || "{prefix}{tag} {message}",
      silent: initialConfig.silent || false,
      tag: initialConfig.tag || undefined,
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
    let str = this.config.format
        ?.replace(/{prefix}/g, (this.config.theme?.[type]?.(` ${this.config.prefixes?.[type] ?? ''} `) ?? type as any))
        ?.replace(/{tag}/g, this.config.tag ? ` ${gray(`[${this.config.tag}]`)}` : "")
        ?.replace(/{message}/g, message) || `${message}`;

    return str.replace(/^\s+|\s+$/gm,'');
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

  resetFormat(): void {
    this.config.format = "{prefix}{tag} {message}";
  }

  setTag(tag: string): void {
    this.config.tag = tag;
  }

  resetTag(): void {
    this.config.tag = "";
  }

  silent(state: boolean): void {
    this.config.silent = state;
  }

  defineLogLevel(level: string, options: { prefix: string; theme?: (text: string) => string }): void {
    this.config.prefixes![level] = options.prefix;
    if (options.theme) {
      this.config.theme![level] = options.theme;
    }
  }

  group(name: string): void {
    this.isGrouping = true;
    this.groupName = name;
    console.log(`\n${gray('┌')} ${bgBlue(black(` GROUP: ${name} `))}\n${gray('│')}`);
  }

  groupEnd(): void {
    this.isGrouping = false;
    console.log(`${gray('└')} ${bgBlue(black(` END GROUP: ${this.groupName} `))}`);
    this.groupName = "";
  }

  log(level: string, ...messages: any[]): void {
    if(this.config.silent) return;
    
    if (this.isGrouping) {
      console.log(`${gray('│')} ${this.formatMessage(level, messages.join(" "))}\n${gray('│')}`);
      return;
    }

    console.log(`\n${this.formatMessage(level, messages.join(" "))}`);
  }

  warn(...messages: any[]): void {
    this.log("warn", messages.join(" "));
  }

  success(...messages: any[]): void {
    this.log("success", messages.join(" "));
  }

  error(...messages: any[]): void {
    this.log("error", messages.join(" "));
  }

  info(...messages: any[]): void {
    this.log("info", messages.join(" "));
  }
}

export default Consolefy;
