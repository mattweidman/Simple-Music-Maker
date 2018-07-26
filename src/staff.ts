import { SVGElement, DOMAttr } from "./domelements";
import { Tool, getSelectedTool } from "./tool";

/**
 * Represents and displays all the measures in the piece of music.
 */
export class Staff {

    scale: number; // amount to scale from original size
    measureWidth: number; // length of each measure (post-scaling)
    measureHeight: number; // distance between top of one measure to top of next (post-scaling)

    measures: Measure[]; // list of measures

    selection: Selection; // currently selected elements on the staff

    constructor() {
        this.scale = 2;
        this.measureWidth = 100;
        this.measureHeight = 100;

        this.selection = new Selection();

        this.measures = [new Measure(this)];
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

        // background
        element.addChild(this.background(innerWidth, innerHeight));

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
            new DOMAttr("href", "./images/trebleclef.svg#svg1938")
        ]));

        // line on the left
        element.addChild(verticalLine(0.5, 15, 40));

        return element;
    }

    /**
     * Create transparent background that unselects everything when clicked.
     * @param width width of background
     * @param height height of background
     */
    background(width: number, height: number): SVGElement {
        var element: SVGElement = new SVGElement("rect", [
            new DOMAttr("width", width + ""),
            new DOMAttr("height", height + ""),
            new DOMAttr("style", "opacity:0;")
        ]);

        element.setOnClick((event: MouseEvent) => {
            if (!event.ctrlKey) {
                this.selection.clear();
                this.display();
            }
        });

        return element;
    }

    /**
     * Add new measure to end.
     */
    addMeasure() {
        this.measures.push(new Measure(this));
    }
}

/**
 * A pointer to whatever is currently selected.
 */
class Selection {
    selected: Selectable[];

    constructor() {
        this.selected = [];
    }

    /**
     * Remove all from selection.
     */
    clear() {
        this.selected = [];
    }

    /**
     * Add an object to selection without removing others.
     * @param obj selectable object
     */
    add(obj: Selectable) {
        if (this.selected.indexOf(obj) === -1) {
            this.selected.push(obj);
        }
    }

    /**
     * Unselect an object.
     * @param obj selectable object
     */
    remove(obj: Selectable) {
        var index: number = this.selected.indexOf(obj);
        if (index >= 0) {
            this.selected.splice(index, 1);
        }
    }

    /**
     * Clears selection and selects one object.
     * @param obj selectable object
     */
    setSelection(obj: Selectable) {
        this.selected = [obj];
    }

    /**
     * Returns whether an object is selected.
     * @param obj selectable object
     */
    isSelected(obj: Selectable): boolean {
        return this.selected.indexOf(obj) > -1;
    }
}

/**
 * Something that can be selected by clicking.
 */
interface Selectable {}

/**
 * A musical measure.
 */
class Measure implements Selectable {
    staff: Staff;

    constructor(staff: Staff) {
        this.staff = staff;
    }

    getDOMElement(measureWidth: number, xtranslate: number): SVGElement {
        var staffTop = 15;
        var staffHeight = 40;

        var element: SVGElement = staffLines(xtranslate, 0, measureWidth);

        // line on the right
        element.addChild(verticalLine(measureWidth - 0.5, staffTop, staffHeight));

        // on click, mark selected
        element.setOnClick((event: MouseEvent) => {
            if (getSelectedTool() === Tool.Selector) {
                if (event.ctrlKey) {
                    if (this.staff.selection.isSelected(this)) {
                        this.staff.selection.remove(this);
                    }
                    else {
                        this.staff.selection.add(this);
                    }
                }
                else {
                    this.staff.selection.setSelection(this);
                }
                this.staff.display();
            }
        });

        // if selected, display box around measure
        if (this.staff.selection.isSelected(this)) {
            var horiMargin = 4;
            var vertMargin = 8;
            element.addChild(horizontalLine(-horiMargin, staffTop - vertMargin, measureWidth + horiMargin*2));
            element.addChild(horizontalLine(-horiMargin, staffTop + staffHeight + vertMargin, measureWidth + horiMargin*2));
            element.addChild(verticalLine(-horiMargin, staffTop - vertMargin, staffHeight + vertMargin * 2));
            element.addChild(verticalLine(measureWidth + horiMargin, staffTop - vertMargin, staffHeight + vertMargin * 2));
        }

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

    // rectangle in the background so staff lines are clickable
    element.addChild(new SVGElement("rect", [
        new DOMAttr("x", "0"),
        new DOMAttr("y", "15"),
        new DOMAttr("width", length + ""),
        new DOMAttr("height", "40"),
        new DOMAttr("style", "opacity:0;")
    ]));

    // lines
    for (var i=0; i<5; i++) {
        var y: number = 15 + i * 10;
        element.addChild(horizontalLine(0, y, length));
    }

    return element;
}