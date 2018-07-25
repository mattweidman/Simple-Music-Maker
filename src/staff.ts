import { SVGElement, SVGAttr } from "./svgelements";

/**
 * Represents and displays all the measures in the piece of music.
 */
class Staff extends SVGElement {

    pixelHeight: number; // height of staff in pixels
    pixelWidth: number; // width of staff in pixels
    scale: number; // amount to scale entire staff from its original size
    measureWidth: number; // length of each measure (post-scaling)
    measureHeight: number; // distance between top of one measure to top of next (post-scaling)
    measures: Measure[];

    constructor() {
        super("svg");

        // basic values
        var frame = document.getElementById("musicframe");
        var width = frame.clientWidth;
        var height = frame.clientHeight;
        
        this.pixelHeight = height;
        this.pixelWidth = width;

        this.scale = 2;
        this.measureWidth = 100;
        this.measureHeight = 100;
        this.measures = [];

        // attributes of SVG
        this.addAttributes(
            new SVGAttr("width", this.pixelWidth + ""),
            new SVGAttr("height", this.pixelHeight + ""),
            new SVGAttr("viewBox", "0 0 " + (this.pixelWidth / this.scale) + " " + (this.pixelHeight / this.scale))
        );

        var g = new SVGElement("g");
        this.addChild(g);

        // rows
        var row1 = new Row(this.measureWidth, 0);
        row1.addChild(new Measure(this.measureWidth, this.measureWidth/2));
        row1.addChild(new Measure(this.measureWidth, this.measureWidth*3/2));
        
        g.addChild(row1);
    }

    /**
     * Display staff on screen.
     */
    display() {
        var staffDiv: HTMLElement = document.getElementById("staffdiv");
        var jsElem: Element = this.getJSDom();
        staffDiv.replaceChild(jsElem, staffDiv.childNodes[0]);
    }
}

/**
 * A row of measures in the staff.
 */
class Row extends SVGElement {

    constructor(measureWidth: number, ytranslate: number) {
        super("g", [
            new SVGAttr("transform", "translate(0 " + ytranslate + ")")
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = 15 + i * 10;
            this.addChild(new SVGElement("line", [
                new SVGAttr("x1", "0"),
                new SVGAttr("y1", y + ""),
                new SVGAttr("x2", measureWidth / 2 + ""),
                new SVGAttr("y2", y + "")
            ]));
        }

        // clef
        this.addChild(new SVGElement("use", [
            new SVGAttr("href", "./images/trebleclef.svg#svg1938"),
            new SVGAttr("x", "0"),
            new SVGAttr("y", "0")
        ]));

        // line on the left
        this.addChild(new SVGElement("line", [
            new SVGAttr("x1", "0.5"),
            new SVGAttr("y1", "15"),
            new SVGAttr("x2", "0.5"),
            new SVGAttr("y2", "55")
        ]));
    }
}

/**
 * A musical measure.
 */
class Measure extends SVGElement {    

    constructor(measureWidth: number, xtranslate: number) {
        super("g", [
            new SVGAttr("transform", "translate(" + xtranslate + " 0)")
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = 15 + i * 10;
            this.addChild(new SVGElement("line", [
                new SVGAttr("x1", "0"),
                new SVGAttr("y1", y + ""),
                new SVGAttr("x2", measureWidth + ""),
                new SVGAttr("y2", y + "")
            ]));
        }

        // line on the left
        this.addChild(new SVGElement("line", [
            new SVGAttr("x1", (measureWidth - 0.5) + ""),
            new SVGAttr("y1", "15"),
            new SVGAttr("x2", (measureWidth - 0.5) + ""),
            new SVGAttr("y2", "55")
        ]));
    }
}

// create the staff
var staff: Staff = new Staff();
staff.display();