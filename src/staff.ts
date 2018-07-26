import { SVGElement, DOMAttr } from "./domelements";

/**
 * Represents and displays all the measures in the piece of music.
 */
export class Staff {

    pixelHeight: number; // height of staff in pixels
    pixelWidth: number; // width of staff in pixels
    scale: number; // amount to scale entire staff from its original size
    measureWidth: number; // length of each measure (post-scaling)
    measureHeight: number; // distance between top of one measure to top of next (post-scaling)
    measures: Measure[];

    constructor() {

        // basic values
        var frame = document.getElementById("musicframe");
        var width = frame.clientWidth;
        var height = frame.clientHeight;
        
        this.pixelHeight = height;
        this.pixelWidth = width;

        this.scale = 2;
        this.measureWidth = 100;
        this.measureHeight = 100;

        this.measures = [new Measure(), new Measure()];
    }

    /**
     * Display staff on screen.
     */
    display() {
        var staffDiv: HTMLElement = document.getElementById("staffdiv");
        var jsElem: Element = this.getDOMElement().getJSElement();
        staffDiv.replaceChild(jsElem, staffDiv.childNodes[0]);
    }

    getDOMElement(): SVGElement {
        var element: SVGElement = new SVGElement("svg", [
            new DOMAttr("width", this.pixelWidth + ""),
            new DOMAttr("height", this.pixelHeight + ""),
            new DOMAttr("viewBox", "0 0 " + (this.pixelWidth / this.scale) + " " + (this.pixelHeight / this.scale))
        ]);

        var g = new SVGElement("g");
        element.addChild(g);

        // rows
        var row1: SVGElement = this.createRow(0);
        var rowLen: number = 0;
        this.measures.forEach((measure, index) => {
            row1.addChild(measure.getDOMElement(this.measureWidth, this.measureWidth * (index + 0.5)));
            rowLen = this.measureWidth * (index + 1.5);
        });

        // double bar
        row1.addChild(verticalLine(rowLen - 4, 15, 40, 1));
        row1.addChild(verticalLine(rowLen - 1, 15, 40, 2));
        
        g.addChild(row1);

        return element;
    }

    createRow(ytranslate: number): SVGElement {
        var element = staffLines(0, ytranslate, this.measureWidth/2);

        // clef
        element.addChild(new SVGElement("use", [
            new DOMAttr("href", "./images/trebleclef.svg#svg1938"),
            new DOMAttr("x", "0"),
            new DOMAttr("y", "0")
        ]));

        // line on the left
        element.addChild(verticalLine(0.5, 15, 40));

        return element;
    }

    addMeasure() {
        this.measures.push(new Measure());
    }
}

/**
 * A musical measure.
 */
class Measure {

    getDOMElement(measureWidth: number, xtranslate: number): SVGElement {
        var element: SVGElement = staffLines(xtranslate, 0, measureWidth);

        // line on the right
        element.addChild(verticalLine(measureWidth - 0.5, 15, 40));

        return element;
    }
}

/**
 * Returns a vertical line SVG line element.
 * @param x x coordinate of vertical line
 * @param y top y coordinate
 * @param length length of line
 * @param strokeWidth width of line
 */
function verticalLine(x: number, y: number, length: number, strokeWidth?: number): SVGElement {
    var element: SVGElement = new SVGElement("line", [
        new DOMAttr("x1", x + ""),
        new DOMAttr("y1", y + ""),
        new DOMAttr("x2", x + ""),
        new DOMAttr("y2", (y + length) + "")
    ]);

    if (strokeWidth !== undefined) {
        element.addAttributes(
            new DOMAttr("style", "stroke-width: " + strokeWidth + "px;")
        );
    }

    return element;
}

/**
 * Returns a horizontal line SVG line element.
 * @param x left x coordinate
 * @param y y coordinate
 * @param length length of line
 * @param strokeWidth width of line
 */
function horizontalLine(x: number, y: number, length: number, strokeWidth?: number): SVGElement {
    var element: SVGElement = new SVGElement("line", [
        new DOMAttr("x1", x + ""),
        new DOMAttr("y1", y + ""),
        new DOMAttr("x2", (x + length) + ""),
        new DOMAttr("y2", y + "")
    ]);

    if (strokeWidth !== undefined) {
        element.addAttributes(
            new DOMAttr("style", "stroke-width: " + strokeWidth + "px;")
        );
    }

    return element;
}

/**
 * Creates 5 staff lines at position (x, y).
 * @param x x-coordinate
 * @param y y-coordinate
 * @param length length of staff lines
 */
function staffLines(x: number, y: number, length: number): SVGElement {
    var element: SVGElement = new SVGElement("g", [
        new DOMAttr("transform", "translate(" + x + " " + y + ")")
    ]);

    for (var i=0; i<5; i++) {
        var y: number = 15 + i * 10;
        element.addChild(horizontalLine(0, y, length));
    }

    return element;
}