import { DOMElement, DOMAttr } from "./domelements"

/**
 * Toolbar on left side of screen.
 */
class Toolbar {
    sections: ToolSection[]

    constructor() {
        this.sections = [
            new ToolSection("Basic", [
                new ToolButton("Selector", "default", 'url("images/pointer.svg")'),
                new ToolButton("Eraser", 'url("images/eraser.svg"), auto', 'url("images/eraser.svg")')
            ]),
            new ToolSection("Tones", [
                new ToolButton("Sine wave", 'url("images/sinewave.svg")', 'url("images/sinewave.svg"), auto')
            ]),
            new ToolSection("Measures", [
                new Button("New measure", 'url("images/newmeasure.svg")')
            ])
        ]
    }

    display() {
        var parentDiv: HTMLElement = document.getElementById("frameparent");
        var jsElem: Element = this.getDOMElement().getJSElement();
        parentDiv.replaceChild(jsElem, parentDiv.childNodes[0]);
    }

    getDOMElement(): DOMElement {
        var element: DOMElement = new DOMElement("div", [
            new DOMAttr("class", "frame toolframe")
        ]);

        this.sections.forEach(section => {
            element.addChild(section.getDOMElement());
        });

        return element;
    }
}

/**
 * Section of tools.
 */
class ToolSection {
    name: string;
    buttons: Button[];

    constructor(name: string, buttons: Button[]) {
        this.name = name;
        this.buttons = buttons;
    }

    getDOMElement(): DOMElement {
        var element: DOMElement = new DOMElement("div", [
            new DOMAttr("class", "toolsection")
        ], [
            new DOMElement("h4", undefined, undefined, this.name)
        ]);

        this.buttons.forEach(button => {
            element.addChild(button.getDOMElement());
        });

        return element;
    }
}

/**
 * Button under the tools menu.
 */
class Button {
    name: string;
    image: string;

    constructor(name: string, image: string) {
        this.name = name;
        this.image = image;
    }

    getDOMElement(): DOMElement {
        return new DOMElement("div", [
            new DOMAttr("class", "tool"),
            new DOMAttr("style", "background-image: " + this.image + ";")
        ], [
            new DOMElement("span", [
                new DOMAttr("class", "tooltip")
            ], [
                new DOMElement("p", undefined, undefined, this.name)
            ])
        ]);
    }
}

/**
 * Button for selecting a tool.
 */
class ToolButton extends Button {
    cursor: string;

    constructor(name: string, cursor: string, image: string) {
        super(name, image);
        this.cursor = cursor;
    }

    getDOMElement(): DOMElement {
        var element: DOMElement = super.getDOMElement();
        var style: string = element.getAttribute("style");
        style += "cursor: " + this.cursor + ";";
        element.setAttribute("style", style);
        return element;
    }
}

var toolbar: Toolbar = new Toolbar();
toolbar.display();

/**
 * Represents a tool in the sidebar.
 */
/* class Tool {
    constructor(public id:string) {
        document.getElementById(id).onclick = this.onclick;
    }

    onclick() {
        changeCurrentTool(this);
    }
} */

/**
 * Changes the selected tool.
 * @param tool tool to switch to
 */
/* let changeCurrentTool = function(tool:Tool) {
    // set current tool
    currentTool = tool;

    // change cursor style
    let cursorStyle = window.getComputedStyle(document.getElementById(tool.id)).cursor;
    document.getElementById("frameparent").style.cursor = cursorStyle;
} */

/**
 * List of all tools and their names.
 */
/* let tools:Tool[] = [
    new Tool("pointertool"),
    new Tool("erasertool"),
    new Tool("sinetool")
]; */

/** Currently selected tool. */
//let currentTool:Tool = tools[0];