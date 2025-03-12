"use client";
import { useStoreState } from "../state/commonState";
import { Pencil, Triangle, RectangleHorizontal, Circle } from "lucide-react";
function Toolbar() {
  const { color, changeColor } = useStoreState();
  const { mode, changeMode } = useStoreState();
  return (
    <div className="toolBar absolute bottom-10 flex justify-center w-full">
      <div className="p-2 bg-green-200 flex rounded-md gap-[20px] justify-evenly px-[20px]">
        <Pencil
          className="cursor-pointer my-auto"
          onClick={(e) => {
            changeMode("pencil");
          }}
        />
        <input
          type="color"
          className="rounded w-10 h-10 bottom-[0px] cursor-pointer"
          value={color}
          onChange={(e) => {
            changeColor(e.target.value);
          }}
        />
        <RectangleHorizontal
          className="cursor-pointer my-auto"
          onClick={(e) => {
            changeMode("rectangle");
          }}
        />
        <Triangle
          className="cursor-pointer my-auto"
          onClick={(e) => {
            changeMode("triangle");
          }}
        />
        <Circle
          className="cursor-pointer my-auto"
          onClick={(e) => {
            changeMode("circle");
          }}
        />
      </div>
    </div>
  );
}

export default Toolbar;
