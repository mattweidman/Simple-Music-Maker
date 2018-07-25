import { SVGElement, SVGAttr } from "./svgelements";

/**
 * Represents and displays all the measures in the piece of music.
 */
class Staff {

    pixelHeight: number;
    pixelWidth: number;
    innerHeight: number;
    innerWidth: number;
    rowHeight: number;
    measureWidth: number;
    measures: Measure[];

    constructor(pixelHeight: number, pixelWidth: number, 
            innerHeight: number, innerWidth: number,
            rowHeight: number, measureWidth: number) {
        this.pixelHeight = pixelHeight;
        this.pixelWidth = pixelWidth;
        this.innerHeight = innerHeight;
        this.innerWidth = innerWidth;
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
    constructElement(): SVGElement {
        var svg = new SVGElement("svg", [
            new SVGAttr("width", this.pixelWidth + ""),
            new SVGAttr("height", this.pixelHeight + ""),
            new SVGAttr("viewBox", "0 0 " + this.innerWidth + " " + this.innerHeight)
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = (15 + i * 10) * this.rowHeight / 100;
            svg.addChild(new SVGElement("line", [
                new SVGAttr("x1", "0"),
                new SVGAttr("y1", y + ""),
                new SVGAttr("x2", this.measureWidth + ""),
                new SVGAttr("y2", y + "")
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
var staff: Staff = new Staff(200, 200, 200, 200, 200, 200);
staff.display();