"use client";
import { KonvaEventObject } from "konva/lib/Node";
import React, { useState, useEffect, useRef } from "react";
import {
  Layer,
  Stage,
  Circle,
  Rect,
  RegularPolygon,
  Line,
  FastLayer,
} from "react-konva";
import { useStoreState } from "../state/commonState";
import { v4 } from "uuid";
import io from "socket.io-client";
import Konva from "konva";

const socket = io("http://localhost:5000");

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
  fill: string;
}

interface polygon {
  id: string;
  type: string;
  startx: number;
  starty: number;
  radius: number;
  sides: number;
  fill: string;
}

interface line {
  id: string;
  type: string;
  points: Array<number>;
  stroke: string;
  strokeWidth: number;
}

const Canvas = React.memo(() => {
  const [circles, setCircles] = useState<circle[]>([]);
  const [rectangles, setRectangles] = useState<rectangle[]>([]);
  const [triangles, setTriangles] = useState<polygon[]>([]);
  const [lines, setLines] = useState<line[]>([]);
  const [drawing, setDrawing] = useState<Boolean>(false);
  const [dragging, setDragging] = useState<Boolean>(false);
  const [currentId, setCurrentId] = useState<string>("");
  const { mode, changeMode } = useStoreState();
  const { color, changeColor } = useStoreState();

  const layerRef = useRef<Konva.Layer | null>(null);

  useEffect(() => {
    socket.on("draw", (stroke) => {
      setLines((prevLines) => [...prevLines, stroke]);
    });

    socket.on("load-drawing", (drawingData) => {
      console.log("drawn");
      setLines(drawingData);
    });

    return () => {
      socket.off("draw");
      socket.off("load-drawing");
    };
  }, []);

  function onMouseDown(e: KonvaEventObject<MouseEvent>) {
    if (["circle", "triangle", "rect", "line"].includes(e.target.name()))
      return;
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
              type: "rectangle",
              startx: pointerPosition.x,
              starty: pointerPosition.y,
              height: 1,
              width: 1,
              fill: "",
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
              type: "triangle",
              startx: pointerPosition.x,
              starty: pointerPosition.y,
              radius: 1,
              sides: 3,
              fill: "",
            },
          ];
        });
      }

      if (mode == "line" || mode == "pencil") {
        let lastLine = {
          id,
          type: mode,
          points: [pointerPosition.x, pointerPosition.y],
          stroke: color,
          strokeWidth: 1,
        };
        setLines((prev) => {
          return [...prev, lastLine];
        });
      }

      if (mode == "eraser") {
        setLines((prev) => {
          return [
            ...prev,
            {
              id,
              type: "eraser",
              points: [pointerPosition.x, pointerPosition.y],
              stroke: "white",
              strokeWidth: 10,
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
    if (!pointerPosition) return;

    if (mode == "pencil") {
      lines.forEach((el) => {
        if (currentId == el.id) {
          socket.emit("draw", el);
        }
      });
    }

    if (mode == "line") {
      lines.forEach((el) => {
        if (currentId == el.id) {
          socket.emit("draw", el);
        }
      });
    }

    layerRef?.current!.batchDraw();

    if (pointerPosition) {
      setCurrentId("");
    }
  }

  function onMouseMove(e: KonvaEventObject<MouseEvent>) {
    requestAnimationFrame(() => {
      if (!drawing || dragging) return;
      console.log("q");
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

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

      if (mode == "line") {
        let lastLine = {};
        setLines((prevState: line[]) => {
          return prevState.map((el) => {
            if (currentId == el.id) {
              lastLine = {
                ...el,
                points: [
                  el.points[0],
                  el.points[1],
                  pointerPosition.x,
                  pointerPosition.y,
                ],
              };
            }

            // socket.emit("draw", lastLine);
            return lastLine as line;
          });
        });
      }

      if (mode == "pencil") {
        let lastLine = {};
        setLines((prevState: line[]) => {
          return prevState.map((el) => {
            if (currentId == el.id) {
              lastLine = {
                ...el,
                points: [...el.points, pointerPosition.x, pointerPosition.y],
              };

              // socket.emit("draw", lastLine);
              return lastLine as line;
            }
            return el;
          });
        });

        layerRef?.current!.batchDraw();
      }

      if (mode == "eraser") {
        setLines((prevState: line[]) => {
          return prevState.map((el) => {
            if (currentId == el.id) {
              return {
                ...el,
                points: [...el.points, pointerPosition.x, pointerPosition.y],
              };
            }
            return el;
          });
        });
      }
    });
  }

  function handleOnClick(e: KonvaEventObject<MouseEvent>) {
    if (e.target.name() == "circle") {
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

    if (e.target.name() == "rect") {
      setRectangles((prevState: rectangle[]) => {
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

    if (e.target.name() == "triangle") {
      setTriangles((prevState: polygon[]) => {
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
  }

  return (
    <div className="flex w-full">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="w-full"
      >
        <Layer ref={layerRef}>
          {circles.map((el, index) => {
            return (
              <Circle
                key={index}
                x={el.startx}
                y={el.starty}
                radius={el.radius}
                id={el.id}
                fill={el.fill}
                name="circle"
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
                globalCompositeOperation={"source-over"}
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
                id={el.id}
                fill={el.fill}
                stroke={"black"}
                name="rect"
                strokeWidth={1}
                draggable
                onDragStart={() => {
                  setDragging(true);
                }}
                onDragEnd={(e) => {
                  setDragging(false);
                }}
                onClick={handleOnClick}
                globalCompositeOperation={"source-over"}
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
                id={el.id}
                fill={el.fill}
                stroke={"black"}
                name="triangle"
                strokeWidth={1}
                draggable
                onDragStart={() => {
                  setDragging(true);
                }}
                onDragEnd={(e) => {
                  setDragging(false);
                }}
                onClick={handleOnClick}
                globalCompositeOperation={"source-over"}
              />
            );
          })}
          {lines.map((el, index) => {
            return (
              <Line
                key={index}
                points={el.points}
                stroke={el.stroke}
                strokeWidth={el.strokeWidth}
                name="line"
                globalCompositeOperation={"source-over"}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

export default Canvas;
