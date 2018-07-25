import { DOMElement, SVGElement, DOMAttr } from "./domelements";

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

    getDOMElement(): DOMElement {
        var element: SVGElement = new SVGElement("svg", [
            new DOMAttr("width", this.pixelWidth + ""),
            new DOMAttr("height", this.pixelHeight + ""),
            new DOMAttr("viewBox", "0 0 " + (this.pixelWidth / this.scale) + " " + (this.pixelHeight / this.scale))
        ]);

        var g = new SVGElement("g");
        element.addChild(g);

        // rows
        var row1 = this.createRow(0);
        this.measures.forEach((measure, index) => {
            row1.addChild(measure.getDOMElement(this.measureWidth, this.measureWidth * (index + 0.5)));
        });
        
        g.addChild(row1);

        return element;
    }

    createRow(ytranslate: number): SVGElement {
        var element = new SVGElement("g", [
            new DOMAttr("transform", "translate(0 " + ytranslate + ")")
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = 15 + i * 10;
            element.addChild(new SVGElement("line", [
                new DOMAttr("x1", "0"),
                new DOMAttr("y1", y + ""),
                new DOMAttr("x2", this.measureWidth / 2 + ""),
                new DOMAttr("y2", y + "")
            ]));
        }

        // clef
        element.addChild(new SVGElement("use", [
            new DOMAttr("href", "./images/trebleclef.svg#svg1938"),
            new DOMAttr("x", "0"),
            new DOMAttr("y", "0")
        ]));

        // line on the left
        element.addChild(new SVGElement("line", [
            new DOMAttr("x1", "0.5"),
            new DOMAttr("y1", "15"),
            new DOMAttr("x2", "0.5"),
            new DOMAttr("y2", "55")
        ]));

        return element;
    }
}

/**
 * A musical measure.
 */
class Measure {

    getDOMElement(measureWidth: number, xtranslate: number): SVGElement {
        var element: SVGElement = new SVGElement("g", [
            new DOMAttr("transform", "translate(" + xtranslate + " 0)")
        ]);

        // staff lines
        for (var i=0; i<5; i++) {
            var y: number = 15 + i * 10;
            element.addChild(new SVGElement("line", [
                new DOMAttr("x1", "0"),
                new DOMAttr("y1", y + ""),
                new DOMAttr("x2", measureWidth + ""),
                new DOMAttr("y2", y + "")
            ]));
        }

        // line on the right
        element.addChild(new SVGElement("line", [
            new DOMAttr("x1", (measureWidth - 0.5) + ""),
            new DOMAttr("y1", "15"),
            new DOMAttr("x2", (measureWidth - 0.5) + ""),
            new DOMAttr("y2", "55")
        ]));

        return element;
    }
}

// create the staff
var staff: Staff = new Staff();
staff.display();