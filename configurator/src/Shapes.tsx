export type Vector = {
  x: number;
  y: number;
};

export abstract class Shape {
  protected id: string;

  private static getRandomId() {
    return Math.floor(Math.random() * 1000000);
  }

  constructor(public color: string) {
    this.id = Shape.getRandomId().toString();
    this.color = color;
  }

  abstract render(isSelected: boolean, translate: Vector): JSX.Element;

  abstract get configComponent(): string;

  isInside(translate: Vector, point: Vector) {
    return false;
  }
}

export class Square extends Shape {
  public configComponent = 'square-config';

  constructor(public size: number, color: string) {
    super(color);
  }

  isInside(translate: Vector, point: Vector) {
    return (
      point.x >= translate.x &&
      point.x <= translate.x + this.size &&
      point.y >= translate.y &&
      point.y <= translate.y + this.size
      );
    }

    render(isSelected: boolean, translate: Vector) {
      return (
        <g key={this.id} transform={`translate(${translate.x} ${translate.y})`}>
        {isSelected && <rect width={this.size} height={this.size} className="selected" />}
        <rect width={this.size} height={this.size} fill={this.color} />
      </g>
    );
  }
}

export class Circle extends Shape {
  public configComponent = 'circle-config';

  constructor(public radius: number, color: string) {
    super(color);
  }

  isInside(translate: Vector, point: Vector) {
    const center = { x: translate.x, y: translate.y };
    const distance = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
    return distance <= this.radius;
  }

  render(isSelected: boolean, translate: Vector) {
    return (
      <g key={this.id} transform={`translate(${translate.x - this.radius} ${translate.y - this.radius})`}>
        {isSelected && <circle cx={this.radius} cy={this.radius} r={this.radius} className="selected" />}
        <circle cx={this.radius} cy={this.radius} r={this.radius} fill={this.color} />;
      </g>
    );
  }
}
