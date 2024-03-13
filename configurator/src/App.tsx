import "./App.css";
import { MouseEvent, createElement, useCallback, useRef, useState } from "react";
import { Circle, Shape, Square, Vector, findFirstShapeAtPoint } from "./Shapes";
import { SquareConfig } from "./decl/square";
import { CircleConfigProps, CircleConfigWC } from "./decl/circle/circle-config";

/**
 * Represents a drag operation in progress.
 */
type DragOperation = {
  /**
   * The shape being dragged.
   */
  shape: Shape;

  /**
   * The distance from the shape's origin to the mouse position.
   */
  distanceFromShapeOrigin: Vector;
};

function App() {
  // The shapes to render.
  const [shapes, setShapes] = useState<Shape[]>([new Square(100, "#FF0000"), new Circle(50, "#0000FF")]);

  // The translation of each shape. Must be kept in sync with `shapes`.
  const [translations, setTranslations] = useState<Vector[]>([
    { x: 50, y: 25 },
    { x: 200, y: 200 },
  ]);

  // The currently selected shape.
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  // The drag operation in progress, if any.
  const [dragOperation, setDragOperation] = useState<DragOperation | null>(null);

  // Whether the configuration dialog is open.
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

  // Reference to the SVG element used to draw the shapes.
  const svgRef = useRef<SVGSVGElement>(null);

  // Reference to the configuration dialog.
  const configDialogRef = useRef<HTMLDialogElement>(null);

  /**
   * Convert global mouse position to position relative to the given SVG element.
   */
  function localizeMousePosition(x: number, y: number) {
    if (!svgRef.current) {
      return { x, y };
    }

    const rect = svgRef.current.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  }

  // Helper method to replace a shape in the list of shapes.
  const replaceShape = useCallback(
    (oldShape: Shape, newShape: Shape) => {
      const index = shapes.indexOf(oldShape);
      const newShapes = [...shapes];
      newShapes[index] = newShape;
      setShapes(newShapes);
      setSelectedShape(newShape);
    },
    [shapes]
  );

  // Callback that is activated when the square configuration component is mounted.
  // It sets the configuration of the selected shape and opens the configuration dialog.
  const squareConfigRef = useCallback(
    (node: SquareConfig | null) => {
      if (!node || !selectedShape || !(selectedShape instanceof Square)) {
        // This should never happen, but just in case...
        setIsConfiguring(false);
        return;
      }

      node.config = {
        size: (selectedShape as Square).size,
        color: (selectedShape as Square).color,
        save: (c) => {
          // Called by the configuration component when the user saves the configuration.
          replaceShape(selectedShape, new Square(c.size, c.color));
          setIsConfiguring(false);
          configDialogRef.current?.close();
        },
      };

      configDialogRef.current?.showModal();
    },
    [selectedShape, replaceShape]
  );
  const circleConfigRef = useCallback(
    (node: CircleConfigWC | null) => {
      if (!node || !selectedShape || !(selectedShape instanceof Circle)) {
        // This should never happen, but just in case...
        setIsConfiguring(false);
        return;
      }

      // Note that the implementation of circleConfigRef and
      // squareConfigRef is almost identical. This is just the case
      // for this simple PoC. In a real-world application, the
      // configuration components might be very different from each
      // other.

      node.config = {
        radius: (selectedShape as Circle).radius,
        color: (selectedShape as Circle).color,
        save: (c: CircleConfigProps) => {
          // Called by the configuration component when the user saves the configuration.
          replaceShape(selectedShape, new Circle(c.radius, c.color));
          setIsConfiguring(false);
          configDialogRef.current?.close();
        },
      };

      configDialogRef.current?.showModal();
    },
    [selectedShape, replaceShape]
  );

  // Drag & drop logic
  const svgProps = {
    onMouseDown: (e: MouseEvent) => {
      if (!svgRef.current) {
        return;
      }

      const target = findFirstShapeAtPoint(shapes, translations, localizeMousePosition(e.clientX, e.clientY));

      // Start dragging only if the target is the selected shape
      if (target && target === selectedShape) {
        const index = shapes.indexOf(target);
        const point = localizeMousePosition(e.clientX, e.clientY);
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

      const point = localizeMousePosition(e.clientX, e.clientY);
      const index = shapes.indexOf(dragOperation.shape);
      const newTranslations = [...translations];
      newTranslations[index] = { x: point.x - dragOperation.distanceFromShapeOrigin.x, y: point.y - dragOperation.distanceFromShapeOrigin.y };
      setTranslations(newTranslations);
    },
    onClick: (e: MouseEvent) => {
      if (!svgRef.current) {
        return;
      }
      setSelectedShape(findFirstShapeAtPoint(shapes, translations, localizeMousePosition(e.clientX, e.clientY)));
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
          {selectedShape && (
            <button type="button" {...configureProps}>
              Configure
            </button>
          )}
          <dialog ref={configDialogRef}>
            {isConfiguring && selectedShape instanceof Square && createElement('square-config', { ref: squareConfigRef })}
            {isConfiguring && selectedShape instanceof Circle && createElement('circle-config', { ref: circleConfigRef })}
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default App;
