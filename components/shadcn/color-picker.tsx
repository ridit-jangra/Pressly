import React, { useCallback, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Pipette, Plus } from "lucide-react";
import { RgbaColorPicker } from "react-colorful";
import { debounce } from "lodash";
import { Button } from "./button";
import { Input } from "./input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const DEFAULT_CHILDREN = (
  <Button
    variant={"outline"}
    className="h-8 md:h-[2vw] aspect-square rounded-full flex items-center justify-center"
  >
    <Pipette style={{ width: "18px", height: "auto" }} />
  </Button>
);

type TColorPicker = {
  value: string;
  onChange: (value: string) => void;
  handleAdd?: (value: string) => void;
  children?: React.ReactNode;
};

const ColorPicker: React.FC<TColorPicker> = ({
  value,
  onChange,
  handleAdd,
  children = DEFAULT_CHILDREN,
}) => {
  const [colorHex, setColorHex] = useState<string>(value);
  const color = useMemo(() => {
    const rgba = hexToRgba(value);
    return { hex: value, alpha: rgba ? rgba.a : 1 };
  }, [value]);

  const debouncedOnChange = useMemo(
    () => debounce((newValue: string) => onChange(newValue), 50),
    [onChange]
  );

  const handleChangeAlpha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = parseFloat(e.target.value);
    const rgba = hexToRgba(color.hex);
    if (rgba) {
      const newHex = rgbaToHex(rgba.r, rgba.g, rgba.b, newAlpha);
      onChange(newHex);
    }
  };

  const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor: any = e.target.value;
    onChange(newColor);
  };

  function rgbaToHex(r: number, g: number, b: number, a: number = 1) {
    const toHex = (n: number) => {
      let hex = n.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    const alpha = isNaN(a) ? 255 : Math.round(a * 255);

    return `#${toHex(r)}${toHex(g)}${toHex(b)}${
      alpha === 255 ? "" : toHex(alpha)
    }`;
  }

  function hexToRgba(hex: string) {
    if (!hex) return null;
    hex = hex.replace(/^#/, "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    if (hex.length !== 6 && hex.length !== 8) return null;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

    return { r, g, b, a };
  }

  const handleColorChange = useCallback(
    (newColor: { r: number; g: number; b: number; a: number }) => {
      const { r, g, b, a } = newColor;
      const newHex = rgbaToHex(r, g, b, a);
      debouncedOnChange(newHex);
      setColorHex(newHex);
    },
    [debouncedOnChange]
  );

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex gap-2 items-center">
          <div>{children}</div>
          <Tooltip>
            <TooltipTrigger className={"w-full"}>
              <div
                className={`w-full h-9 rounded-sm`}
                style={{ backgroundColor: colorHex }}
              />
            </TooltipTrigger>
            <TooltipContent>{colorHex}</TooltipContent>
          </Tooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent align="center" side="top" className="w-[18rem] h-100">
        <div className="size-full flex flex-col items-center justify-between">
          <h1 className="font-medium text-xl">Colour Picker</h1>
          <RgbaColorPicker
            color={hexToRgba(color.hex) as any}
            onChange={handleColorChange}
            className="w-full! aspect-square"
          />
          <div className="w-full flex flex-col items-center gap-6 md:gap-[1.5vw] mt-2 md:mt-[0.5vw]">
            <div className="w-full h-10 md:h-[2.5vw] flex items-center justify-center">
              <label className="mr-2 md:mr-[0.5vw]">HEX</label>
              <Input
                className="w-full rounded-r-none! tracking-widest!"
                value={color.hex}
                onChange={handleChangeColor}
              />
              <Input
                type="text"
                min="0"
                max="1"
                step="0.01"
                value={color.alpha.toFixed(2)}
                onChange={handleChangeAlpha}
                className="w-20 md:w-[5vw] pr-0! rounded-l-none! tracking-widest"
              />
            </div>
            {handleAdd && (
              <Button className="w-full gap-0" onClick={() => handleAdd(value)}>
                <Plus className="h-4 md:h-[1.2vw] aspect-square" />
                Add New Colour
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
