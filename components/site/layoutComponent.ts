import { IComponentChildOption, IComponentOption } from "@/lib/types";

export abstract class LayoutComponentBase {
  public id: string = "";
  public rows: number = 1;
  public columns: number = 1;
  public gap: number = 16;
  public padding: number = 16;
  public backgroundColor: string = "#ffffff";
  public borderRadius: number = 8;
  public minHeight: number = 150;
  public state: any = {};

  abstract editOptions: IComponentOption[];
  abstract childOptions: IComponentChildOption[];

  constructor() {
    this.update();
  }

  abstract update(): void;
  abstract getGridAreas(): string[][];

  public applyState(state: any): void {
    this.state = { ...state };
    this.update();
  }
}
