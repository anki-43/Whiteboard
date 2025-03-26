"use client";
import { useStoreState } from "../state/commonState";
import {
  Pencil,
  Triangle,
  RectangleHorizontal,
  Circle,
  Eraser,
  Minus,
} from "lucide-react";
function Toolbar() {
  const { color, changeColor } = useStoreState();
  const { mode, changeMode } = useStoreState();
  return (
    <div className="toolBar absolute bottom-0 flex w-full pb-3 ">
      <div className="p-2 bg-white-200 border-gray-400 flex rounded-md m-auto gap-[25px] justify-evenly px-[20px] border-1">
        <Pencil
          className="cursor-pointer my-auto"
          onClick={(e) => {
            changeMode("pencil");
          }}
        />
        <input
          type="color"
          className="rounded-md w-5 h-5 bottom-[0px] cursor-pointer border-2 inline"
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
        <Eraser
          className="cursor-pointer my-auto"
          onClick={(e) => {
            changeMode("eraser");
          }}
        />

        <Minus
          className="cursor-pointer my-auto"
          onClick={(e) => {
            changeMode("line");
          }}
        />
      </div>
    </div>
  );
}

export default Toolbar;
