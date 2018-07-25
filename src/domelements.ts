/**
 * Represents an element in HTML DOM.
 */
export class DOMElement {
    name: string;
    attributes: DOMAttr[];
    children: DOMElement[];

    constructor(name: string, attributes?: DOMAttr[], children?: DOMElement[]) {
        this.name = name;
        this.attributes = attributes === undefined ? [] : attributes;
        this.children = children === undefined ? [] : children;
    }

    /**
     * Constructs the DOM element that JavaScript can use.
     */
    getJSDom(): Element {

        var elem: HTMLElement = document.createElement(this.name);

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
    addAttribute(attr: DOMAttr) {
        this.attributes.push(attr);
    }

    /**
     * Adds a new DOM element as a child.
     * @param child new DOM element
     */
    addChild(child: DOMElement) {
        this.children.push(child);
    }
}

/**
 * Special kind of DOM element with a namespace (like an svg).
 */
export class DOMElementNS extends DOMElement {
    ns: string;

    constructor(name: string, ns:string, attributes?: DOMAttr[], children?: DOMElement[]) {
        super(name, attributes, children);
        this.ns = ns;
    }

    /**
     * Constructs the DOM element that JavaScript can use.
     */
    getJSDom(): Element {

        var elem: Element = document.createElementNS(this.ns, this.name);
        console.log(elem);

        this.attributes.forEach(attribute => {
            elem.setAttribute(attribute.key, attribute.value);
        });

        this.children.forEach(child => {
            elem.appendChild(child.getJSDom());
        });

        return elem;
    }
}

/**
 * HTML attribute.
 */
export class DOMAttr {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}