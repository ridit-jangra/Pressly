import {
  IComponentChildOption,
  IComponentOption,
  IComponentState,
} from "@/lib/types";

export abstract class Component {
  public tag: string = "div";
  public text: string = "";
  public classes: string[] = [];
  public styles: React.CSSProperties = {};
  public code: string = "";
  public state: IComponentState = {};

  abstract editOptions: IComponentOption[];
  abstract childOptions: IComponentChildOption[];

  constructor() {}

  abstract update(): void;

  public updateAll(
    tag: string,
    text: string,
    classes: string[] = [],
    styles: React.CSSProperties = {}
  ): void {
    this.tag = tag || this.tag;
    this.text = text;
    this.classes = classes;
    this.styles = styles;

    this.updateCode();

    console.log("updating tag", tag);
  }

  public applyState(state: IComponentState): void {
    this.state = { ...this.state, ...state };

    Object.entries(state).forEach(([key, value]) => {
      const [parentId, label] = key.split("-");
      if (parentId && label) {
        this.handleStateChange(parentId, label, value);
      }
    });
  }

  protected handleStateChange(
    parentId: string,
    label: string,
    value: any
  ): void {
    this.state[`${parentId}-${label}`] = value;

    this.update();
  }

  public addClass(className: string): void {
    if (!this.classes.includes(className)) {
      this.classes.push(className);
      this.updateCode();
    }
  }

  public removeClass(className: string): void {
    this.classes = this.classes.filter((c) => c !== className);
    this.updateCode();
  }

  public setStyle(
    property: keyof React.CSSProperties,
    value: string | number
  ): void {
    this.styles[property] = value as any;
    this.updateCode();
  }

  public removeStyle(property: keyof React.CSSProperties): void {
    delete this.styles[property];
    this.updateCode();
  }

  public getCode(): string {
    return this.code;
  }

  private updateCode(): void {
    const classString = this.classes.join(" ").trim();
    const styleString = this.formatStyles(this.styles);

    const classAttr = classString ? ` class="${classString}"` : "";
    const styleAttr = styleString ? ` style="${styleString}"` : "";

    const isVoidElement = ["img", "br", "hr", "input", "meta", "link"].includes(
      this.tag
    );
    this.code = isVoidElement
      ? `<${this.tag}${classAttr}${styleAttr} />`
      : `<${this.tag}${classAttr}${styleAttr}>${this.escapeHtml(this.text)}</${
          this.tag
        }>`;

    console.log("generated code", this.code);
  }

  private formatStyles(styles: React.CSSProperties): string {
    return Object.entries(styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const cssValue = typeof value === "number" ? `${value}px` : value;
        return `${cssKey}: ${cssValue}`;
      })
      .join("; ");
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  public getState(): IComponentState {
    return { ...this.state };
  }

  public reset(): void {
    this.state = {};
    this.update();
  }

  public validateState(): string[] {
    const errors: string[] = [];

    this.editOptions.forEach((option) => {
      this.childOptions
        .filter((child) => child.parentId === option.id)
        .forEach((child) => {
          child.options.forEach((opt) => {
            const key = `${option.id}-${opt.label}`;
            if (!this.state[key] && opt.default === undefined) {
              errors.push(`Missing default value for ${key}`);
            }
          });
        });
    });

    return errors;
  }
}
