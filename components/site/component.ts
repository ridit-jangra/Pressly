export class Component {
  private tag: string = "div";
  private label: string = "component";
  private background: string = "black";
  private foreground: string = "white";
  private code: string = `<${this.tag} class="bg-${this.background} text-${this.foreground}">${this.label}</{${this.tag}>`;
  private classes: string[] = ["cursor-pointer", "p-2"];

  public updateCode(): string {
    let customClasses = "";
    this.classes.forEach((v) => {
      customClasses = `${customClasses} ${v}`;
    });

    this.code = `<${this.tag} class="bg-${this.background} text-${this.foreground} ${customClasses}">${this.label}</${this.tag}>`;
    return this.code;
  }

  public updateLabel(label: string): string {
    this.label = label;
    const code = this.updateCode();

    return code;
  }

  public updateBackground(background: string): string {
    this.background = background;
    const code = this.updateCode();

    return code;
  }

  public updateForeground(foreground: string): string {
    this.foreground = foreground;
    const code = this.updateCode();

    return code;
  }

  public updateTag(tag: string): string {
    this.tag = tag;
    const code = this.updateCode();

    return code;
  }

  public updateAll(
    tag: string,
    label: string,
    background: string,
    foreground: string,
    classes?: string[]
  ): string {
    this.updateTag(tag);
    this.updateLabel(label);
    this.updateBackground(background);
    this.updateForeground(foreground);
    this.updateAllClasses(classes || this.classes);

    const code = this.updateCode();

    return code;
  }

  public updateAllClasses(newClasses: string[]): string {
    this.classes = newClasses;
    const code = this.updateCode();

    return code;
  }

  public addClass(newClass: string): string {
    this.classes.push(newClass);
    const code = this.updateCode();

    return code;
  }

  public removeClass(classToRemove: string): string {
    this.classes = this.classes.filter((c) => c !== classToRemove);
    const code = this.updateCode();

    return code;
  }

  public getCode() {
    return this.code;
  }
}
