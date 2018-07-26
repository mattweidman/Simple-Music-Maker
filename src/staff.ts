import { SVGElement, DOMAttr } from "./domelements";

/**
 * Represents and displays all the measures in the piece of music.
 */
export class Staff {

    scale: number; // amount to scale from original size
    measureWidth: number; // length of each measure (post-scaling)
    measureHeight: number; // distance between top of one measure to top of next (post-scaling)
    measures: Measure[];

    constructor() {
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
        // figure out width
        var frame = document.getElementById("musicframe");
        var pixelWidth = frame.clientWidth;
        var innerWidth = pixelWidth / this.scale;
        var minWidth = this.measureWidth * 1.5;
        if (innerWidth < minWidth) {
            innerWidth = minWidth;
            pixelWidth = innerWidth * this.scale;
        }

        // figure out height
        var measureStart = this.measureWidth/2;
        var measuresPerRow = Math.max(Math.floor((innerWidth - measureStart) / this.measureWidth), 1);
        var numRows = Math.ceil(this.measures.length / measuresPerRow);
        var innerHeight = numRows * this.measureHeight;
        var pixelHeight = innerHeight * this.scale;

        // create main SVG element
        var element: SVGElement = new SVGElement("svg", [
            new DOMAttr("width", pixelWidth + ""),
            new DOMAttr("height", pixelHeight + ""),
            new DOMAttr("viewBox", "0 0 " + innerWidth + " " + innerHeight)
        ]);

        var g = new SVGElement("g");
        element.addChild(g);

        // initialize first row
        var rowLen: number = measureStart;
        var rowY: number = 0;
        var row: SVGElement = this.createRow(rowY, rowLen);
        g.addChild(row);

        // add measures, breaking into new rows when needed
        this.measures.forEach(measure => {

            // go to next row when ready
            if (rowLen + this.measureWidth > innerWidth) {
                rowLen = measureStart;
                rowY += this.measureHeight;
                row = this.createRow(rowY, rowLen);
                g.addChild(row);
            }

            // add measure to current row
            row.addChild(measure.getDOMElement(this.measureWidth, rowLen));
            rowLen += this.measureWidth;
        });

        // double bar
        row.addChild(verticalLine(rowLen - 4, 15, 40, 1));
        row.addChild(verticalLine(rowLen - 1, 15, 40, 2));

        return element;
    }

    /**
     * Create the beginning part of a row of measures including the clef.
     * @param ytranslate amount to shift row down by
     * @param width width of row beginning (not including first measure)
     */
    createRow(ytranslate: number, width: number): SVGElement {
        var element: SVGElement = staffLines(0, ytranslate, width);

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