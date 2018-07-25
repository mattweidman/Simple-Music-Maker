import { SVGElement, SVGAttr } from "./svgelements";

/**
 * Represents and displays all the measures in the piece of music.
 */
class Staff {

    pixelHeight: number; // height of staff in pixels
    pixelWidth: number; // width of staff in pixels
    scale: number; // amount to scale entire staff from its original size
    measureWidth: number; // length of each measure (post-scaling)
    measureHeight: number; // distance between top of one measure to top of next (post-scaling)
    measures: Measure[];

    constructor() {

        var frame = document.getElementById("musicframe");
        var width = frame.clientWidth;
        var height = frame.clientHeight;
        
        this.pixelHeight = height;
        this.pixelWidth = width;

        this.scale = 2;
        this.measureWidth = 100;
        this.measureHeight = 100;
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
            new SVGAttr("viewBox", "0 0 " + (this.pixelWidth / this.scale) + " " + (this.pixelHeight / this.scale))
        ]);

        var g = new SVGElement("g");
        svg.addChild(g);

        var row1 = new Row(this.measureWidth, 0).constructElement();
        row1.addChild(new Measure(this.measureWidth, this.measureWidth/2).constructElement());
        row1.addChild(new Measure(this.measureWidth, this.measureWidth*3/2).constructElement());
        
        g.addChild(row1);

        return svg;
    }
}

/**
 * A row of measures in the staff.
 */
class Row {
    element: SVGElement;

    constructor(measureWidth: number, ytranslate: number) {
        this.element = new SVGElement("g", [
            new SVGAttr("transform", "translate(0 " + ytranslate + ")")
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = 15 + i * 10;
            this.element.addChild(new SVGElement("line", [
                new SVGAttr("x1", "0"),
                new SVGAttr("y1", y + ""),
                new SVGAttr("x2", measureWidth / 2 + ""),
                new SVGAttr("y2", y + "")
            ]));
        }

        // clef
        this.element.addChild(new SVGElement("use", [
            new SVGAttr("href", "./images/trebleclef.svg#svg1938"),
            new SVGAttr("x", "0"),
            new SVGAttr("y", "0")
        ]));

        // line on the left
        this.element.addChild(new SVGElement("line", [
            new SVGAttr("x1", "0.5"),
            new SVGAttr("y1", "15"),
            new SVGAttr("x2", "0.5"),
            new SVGAttr("y2", "55")
        ]));
    }

    constructElement(): SVGElement {
        return this.element;
    }
}

/**
 * A musical measure.
 */
class Measure {    
    element: SVGElement;

    constructor(measureWidth: number, xtranslate: number) {
        this.element = new SVGElement("g", [
            new SVGAttr("transform", "translate(" + xtranslate + " 0)")
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = 15 + i * 10;
            this.element.addChild(new SVGElement("line", [
                new SVGAttr("x1", "0"),
                new SVGAttr("y1", y + ""),
                new SVGAttr("x2", measureWidth + ""),
                new SVGAttr("y2", y + "")
            ]));
        }

        // line on the left
        this.element.addChild(new SVGElement("line", [
            new SVGAttr("x1", (measureWidth - 0.5) + ""),
            new SVGAttr("y1", "15"),
            new SVGAttr("x2", (measureWidth - 0.5) + ""),
            new SVGAttr("y2", "55")
        ]));
    }

    constructElement(): SVGElement {
        return this.element;
    }
}

// create the staff
var staff: Staff = new Staff();
staff.display();