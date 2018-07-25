import { DOMElement, DOMElementNS, DOMAttr } from "./domelements";

/**
 * Represents and displays all the measures in the piece of music.
 */
class Staff {
    height: number;
    width: number;
    rowHeight: number;
    measureWidth: number;
    measures: Measure[];

    constructor(height: number, width: number, rowHeight: number, measureWidth: number) {
        this.height = height;
        this.width = width;
        this.rowHeight = rowHeight;
        this.measureWidth = measureWidth;
        this.measures = [];
    }

    /**
     * Display staff on screen.
     */
    display() {
        var staffDiv: HTMLElement = document.getElementById("staffdiv");
        var jsElem: Element = this.constructElement().getJSDom();
        staffDiv.replaceChild(jsElem, staffDiv.childNodes[0]);
    }

    /**
     * Construct SVG element containing staff.
     */
    constructElement(): DOMElement {
        var svg = new DOMElementNS("svg", "http://www.w3.org/2000/svg", [
            new DOMAttr("width", this.width + ""),
            new DOMAttr("height", this.height + ""),
            new DOMAttr("viewBox", "0 0 " + this.width + " " + this.height)
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = 15 + i * 10;
            svg.addChild(new DOMElement("line", [
                new DOMAttr("x1", "0"),
                new DOMAttr("y1", y + ""),
                new DOMAttr("x2", "100"),
                new DOMAttr("y2", y + ""),
                new DOMAttr("stroke", "black"),
                new DOMAttr("stroke-width", "5")
            ]));
        }

        return svg;
    }
}

/**
 * A musical measure.
 */
class Measure {

}

// create the staff
var staff: Staff = new Staff(100, 100, 100, 100);
staff.display();