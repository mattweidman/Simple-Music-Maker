var xmlns: string = "http://www.w3.org/2000/svg";

/**
 * Represents an element in HTML DOM.
 */
export class SVGElement {
    name: string;
    attributes: SVGAttr[];
    children: SVGElement[];

    constructor(name: string, attributes?: SVGAttr[], children?: SVGElement[]) {
        this.name = name;
        this.attributes = attributes === undefined ? [] : attributes;
        this.children = children === undefined ? [] : children;
    }

    /**
     * Constructs the DOM element that JavaScript can use.
     */
    getJSDom(): Element {

        var elem: Element = document.createElementNS(xmlns, this.name);

        this.attributes.forEach(attribute => {
            elem.setAttribute(attribute.key, attribute.value);
        });

        this.children.forEach(child => {
            elem.appendChild(child.getJSDom());
        });

        return elem;
    }

    /**
     * Adds a new attribute to the DOM element.
     * @param attr attribute to add
     */
    addAttribute(attr: SVGAttr) {
        this.attributes.push(attr);
    }

    /**
     * Adds new attributes to the DOM element.
     * @param attrs list of attributes to add
     */
    addAttributes(...attrs: SVGAttr[]) {
        attrs.forEach(attr => {
            this.addAttribute(attr);
        });
    }

    /**
     * Adds a new DOM element as a child.
     * @param child new DOM element
     */
    addChild(child: SVGElement) {
        this.children.push(child);
    }
}

/**
 * HTML attribute.
 */
export class SVGAttr {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}