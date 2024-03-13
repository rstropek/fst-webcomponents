import { MouseEvent, createElement, useCallback, useRef, useState } from "react";
import "./App.css";
import { Circle, Shape, Square, Vector } from "./Shapes";
import { SquareConfig } from "./decl/square";

function findFirstShapeAtPoint(shapes: Shape[], translations: Vector[], point: Vector) {
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (shapes[i].isInside(translations[i], point)) {
      return shapes[i];
    }
  }
  return null;
}

function localizeMousePosition(x: number, y: number, svg: SVGSVGElement) {
  const rect = svg.getBoundingClientRect();
  return { x: x - rect.left, y: y - rect.top };
}

type DragOperation = {
  shape: Shape;
  distanceFromShapeOrigin: Vector;
};

function App() {
  const [shapes, setShapes] = useState<Shape[]>([new Square(100, "#FF0000"), new Circle(50, "#0000FF")]);
  const [translations, setTranslations] = useState<Vector[]>([
    { x: 50, y: 25 },
    { x: 200, y: 200 },
  ]);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [dragOperation, setDragOperation] = useState<DragOperation | null>(null);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const configDialogRef = useRef<HTMLDialogElement>(null);
  const configRef = useCallback((node: SquareConfig | null) => {
    console.log(selectedShape);
    if (!selectedShape || !(selectedShape instanceof Square)) {
      setIsConfiguring(false);
      return;
    }

    if (node) {
      node.config = {
        size: (selectedShape as Square).size,
        color: (selectedShape as Square).color,
        save: c => {
          const index = shapes.indexOf(selectedShape);
          const newShapes = [...shapes];
          newShapes[index] = new Square(c.size, c.color);
          setShapes(newShapes);
          setSelectedShape(newShapes[index]);
          setIsConfiguring(false);
          configDialogRef.current?.close();
        }
      };
      configDialogRef.current?.showModal();
    }
  }, [selectedShape, shapes]);

  const svgProps = {
    onMouseDown: (e: MouseEvent) => {
      if (!svgRef.current) {
        return;
      }

      const target = findFirstShapeAtPoint(shapes, translations, localizeMousePosition(e.clientX, e.clientY, svgRef.current));

      // Start dragging only if the target is the selected shape
      if (target && target === selectedShape) {
        const index = shapes.indexOf(target);
        const point = localizeMousePosition(e.clientX, e.clientY, svgRef.current);
        setDragOperation({
          shape: target,
          distanceFromShapeOrigin: { x: point.x - translations[index].x, y: point.y - translations[index].y },
        });
      }
    },
    onMouseUp: (e: MouseEvent) => {
      setDragOperation(null);
    },
    onMouseMove: (e: MouseEvent) => {
      if (!svgRef.current || !dragOperation) {
        return;
      }

      const point = localizeMousePosition(e.clientX, e.clientY, svgRef.current);
      const index = shapes.indexOf(dragOperation.shape);
      const newTranslations = [...translations];
      newTranslations[index] = { x: point.x - dragOperation.distanceFromShapeOrigin.x, y: point.y - dragOperation.distanceFromShapeOrigin.y };
      setTranslations(newTranslations);
    },
    onClick: (e: MouseEvent) => {
      if (!svgRef.current) {
        return;
      }
      setSelectedShape(findFirstShapeAtPoint(shapes, translations, localizeMousePosition(e.clientX, e.clientY, svgRef.current)));
    },
  };

  const configureProps = {
    onClick: () => {
      setIsConfiguring(!isConfiguring);
    },
  };

  return (
    <div className="App">
      <h1>Configurator</h1>
      <div className="container">
        <svg ref={svgRef} height="500" {...svgProps}>
          {shapes.map((shape, ix) => shape.render(selectedShape === shape, translations[ix]))}
        </svg>
        <div className="tools">
          <ul>
            <li>Square</li>
            <li>Circle</li>
          </ul>
          {createElement('web-greeting')}
          {selectedShape && <button type="button" {...configureProps}>Configure</button>}
          <dialog ref={configDialogRef}>
            {isConfiguring && selectedShape &&
              createElement(selectedShape.configComponent, { ref: configRef })}
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default App;
