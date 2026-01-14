import { Component } from "../component";

export class primaryButton extends Component {
  constructor() {
    super();
  }

  public update() {
    this.updateAll(
      "button",
      "Primary Button",
      "primary",
      "primary-foreground",
      [
        "px-3",
        "py-2",
        "hover:bg-primary/80",
        "transition-colors",
        "cursor-pointer",
        "rounded-lg",
      ]
    );
  }
}

export class secondaryButton extends Component {
  constructor() {
    super();
  }

  public update() {
    this.updateAll(
      "button",
      "Secondary Button",
      "secondary",
      "secondary-foreground",
      [
        "px-3",
        "py-2",
        "hover:bg-secondary/80",
        "transition-colors",
        "cursor-pointer",
        "rounded-lg",
      ]
    );
  }
}
