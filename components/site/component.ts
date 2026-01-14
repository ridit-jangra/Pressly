import {
  IComponentChildOption,
  IComponentOption,
  IComponentState,
} from "@/lib/types";

export abstract class Component {
  public tag: string = "";
  public text: string = "";
  public classes: string[] = [];
  public styles: React.CSSProperties = {}; // NEW: Store inline styles
  public code: string = "";

  // Instance-specific state
  public state: IComponentState = {};

  abstract editOptions: IComponentOption[];
  abstract childOptions: IComponentChildOption[];

  constructor() {
    this.update();
  }

  abstract update(): void;

  public updateAll(
    tag: string,
    text: string,
    classes: string[],
    styles: React.CSSProperties = {} // NEW: Accept styles parameter
  ) {
    this.tag = tag;
    this.text = text;
    this.classes = classes;
    this.styles = styles;
    this.updateCode();
  }

  public addClass(className: string) {
    if (!this.classes.includes(className)) {
      this.classes.push(className);
    }
  }

  public removeClass(className: string) {
    this.classes = this.classes.filter((c) => c !== className);
  }

  public setStyle(property: string, value: string | number) {
    (this.styles as any)[property] = value;
  }

  public removeStyle(property: keyof React.CSSProperties) {
    delete this.styles[property];
  }

  public updateCode() {
    const classString = this.classes.join(" ");
    const styleString = Object.entries(this.styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");

    const styleAttr = styleString ? ` style="${styleString}"` : "";
    this.code = `<${this.tag} class="${classString}"${styleAttr}>${this.text}</${this.tag}>`;
  }

  public getCode(): string {
    return this.code;
  }

  // Apply state to component
  public applyState(state: IComponentState) {
    this.state = { ...state };

    // Apply state values to component properties
    Object.keys(state).forEach((key) => {
      const [parentId, label] = key.split("-");
      this.handleStateChange(parentId, label, state[key]);
    });

    this.updateCode();
  }

  // Override this in subclasses to handle state changes
  protected handleStateChange(parentId: string, label: string, value: any) {
    // Default implementation - override in subclasses
  }
}
