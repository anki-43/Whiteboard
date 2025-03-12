"use client";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { Layer, Stage, Circle, Rect, RegularPolygon } from "react-konva";
import { useStoreState } from "../state/commonState";
import { v4 } from "uuid";

interface circle {
  id: string;
  type: string;
  startx: number;
  starty: number;
  radius: number;
  fill: string;
}

interface rectangle {
  id: string;
  type: string;
  startx: number;
  starty: number;
  height: number;
  width: number;
}

interface polygon {
  id: string;
  type: string;
  startx: number;
  starty: number;
  radius: number;
  sides: number;
}

function Canvas() {
  const [circles, setCircles] = useState<circle[]>([]);
  const [rectangles, setRectangles] = useState<rectangle[]>([]);
  const [triangles, setTriangles] = useState<polygon[]>([]);
  const [drawing, setDrawing] = useState<Boolean>(false);
  const [dragging, setDragging] = useState<Boolean>(false);
  const [currentId, setCurrentId] = useState<string>("");
  const { mode, changeMode } = useStoreState();
  const { color, changeColor } = useStoreState();

  function onMouseDown(e: KonvaEventObject<MouseEvent>) {
    if (e.target.name() == "shape") return;
    if (dragging) return;
    const stage = e.target.getStage();

    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      const id = v4();
      if (mode == "circle") {
        setCircles((prev) => {
          return [
            ...prev,
            {
              id,
              type: "circle",
              startx: pointerPosition.x,
              starty: pointerPosition.y,
              fill: "",
              radius: 1,
            },
          ];
        });
      }

      if (mode == "rectangle") {
        setRectangles((prev) => {
          return [
            ...prev,
            {
              id,
              type: "circle",
              startx: pointerPosition.x,
              starty: pointerPosition.y,
              height: 1,
              width: 1,
            },
          ];
        });
      }

      if (mode == "triangle") {
        setTriangles((prev) => {
          return [
            ...prev,
            {
              id,
              type: "circle",
              startx: pointerPosition.x,
              starty: pointerPosition.y,
              radius: 1,
              sides: 3,
            },
          ];
        });
      }
      setCurrentId(id);
    }
    setDrawing(true);
  }

  function onMouseUp(e: KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    setDrawing(false);
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      setCurrentId("");
    }
  }

  function onMouseMove(e: KonvaEventObject<MouseEvent>) {
    if (!drawing || dragging) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    console.log(circles, triangles, rectangles, mode);
    if (mode == "circle") {
      setCircles((prevState: circle[]) => {
        return prevState.map((el) => {
          if (currentId == el.id) {
            return {
              ...el,
              radius:
                ((pointerPosition.x - el.startx) ** 2 +
                  (pointerPosition.y - el.starty) ** 2) **
                0.5,
            };
          }
          return el;
        });
      });
    }

    if (mode == "rectangle") {
      setRectangles((prevState: rectangle[]) => {
        return prevState.map((el) => {
          if (currentId == el.id) {
            return {
              ...el,
              height: pointerPosition.y - el.starty,
              width: pointerPosition.x - el.startx,
            };
          }
          return el;
        });
      });
    }
    if (mode == "triangle") {
      setTriangles((prevState: polygon[]) => {
        return prevState.map((el) => {
          if (currentId == el.id) {
            return {
              ...el,
              radius:
                ((pointerPosition.x - el.startx) ** 2 +
                  (pointerPosition.y - el.starty) ** 2) **
                0.5,
            };
          }
          return el;
        });
      });
    }
  }

  function handleOnClick(e: KonvaEventObject<MouseEvent>) {
    setCircles((prevState: circle[]) => {
      return prevState.map((el) => {
        if (e.target.id() == el.id) {
          return {
            ...el,
            fill: color,
          };
        }
        return el;
      });
    });
  }

  return (
    <div className="h-full flex border">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <Layer>
          {circles.map((el, index) => {
            return (
              <Circle
                key={index}
                id={el.id}
                x={el.startx}
                y={el.starty}
                radius={el.radius}
                fill={el.fill}
                name="shape"
                stroke={"black"}
                strokeWidth={1}
                draggable
                onDragStart={() => {
                  setDragging(true);
                }}
                onDragEnd={(e) => {
                  setDragging(false);
                }}
                onClick={handleOnClick}
              />
            );
          })}
          {rectangles.map((el, index) => {
            return (
              <Rect
                key={index}
                x={el.startx}
                y={el.starty}
                height={el.height}
                width={el.width}
                stroke={"black"}
                name="shape"
                strokeWidth={1}
                draggable
                onDragStart={() => {
                  setDragging(true);
                }}
                onDragEnd={(e) => {
                  setDragging(false);
                }}
              />
            );
          })}
          {triangles.map((el, index) => {
            return (
              <RegularPolygon
                key={index}
                x={el.startx}
                y={el.starty}
                sides={el.sides}
                radius={el.radius}
                stroke={"black"}
                name="shape"
                strokeWidth={1}
                draggable
                onDragStart={() => {
                  setDragging(true);
                }}
                onDragEnd={(e) => {
                  setDragging(false);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;
