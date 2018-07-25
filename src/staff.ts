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

    constructor() {

        var frame = document.getElementById("musicframe");
        var width = frame.clientWidth;
        var height = frame.clientHeight;
        console.log(frame);
        
        this.pixelHeight = height;
        this.pixelWidth = width;

        this.innerHeight = height;
        this.innerWidth = width;

        this.rowHeight = 200;
        this.measureWidth = 100;
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

        var rowg = new SVGElement("g", [
            new SVGAttr("transform", "scale(" + this.rowHeight/100 + " " + this.rowHeight/100 + ")")
        ]);
        svg.addChild(rowg);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = (15 + i * 10);
            rowg.addChild(new SVGElement("line", [
                new SVGAttr("x1", "0"),
                new SVGAttr("y1", y + ""),
                new SVGAttr("x2", this.measureWidth + ""),
                new SVGAttr("y2", y + "")
            ]));
        }

        // clef
        rowg.addChild(new SVGElement("use", [
            new SVGAttr("href", "./images/trebleclef.svg#svg1938"),
            new SVGAttr("x", "0"),
            new SVGAttr("y", "0"),
            new SVGAttr("width", this.rowHeight + ""),
            new SVGAttr("height", this.rowHeight + "")
        ]));

        return svg;
    }
}

/**
 * A musical measure.
 */
class Measure {

}

// create the staff
var staff: Staff = new Staff();
staff.display();