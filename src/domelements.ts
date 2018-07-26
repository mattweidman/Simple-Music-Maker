var xmlns: string = "http://www.w3.org/2000/svg";

export class DOMElement {
    name: string;
    attributes: DOMAttr[];
    children: SVGElement[];
    value: string;

    constructor(name: string, attributes?: DOMAttr[], children?: SVGElement[], value?: string) {
        this.name = name;
        this.attributes = attributes === undefined ? [] : attributes;
        this.children = children === undefined ? [] : children;
        this.value = value === undefined ? "" : value;
    }

    /**
     * Create a DOM element without attributes or children.
     */
    createElement(): Element {
        return document.createElement(this.name);
    }

    /**
     * Constructs the DOM element that JavaScript can use.
     */
    getJSElement(): Element {

        var elem: Element = this.createElement();

        this.attributes.forEach(attribute => {
            elem.setAttribute(attribute.key, attribute.value);
        });

        this.children.forEach(child => {
            elem.appendChild(child.getJSElement());
        });

        if (this.value !== "") {
            elem.innerHTML = this.value;
        }

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
     * Adds new attributes to the DOM element.
     * @param attrs list of attributes to add
     */
    addAttributes(...attrs: DOMAttr[]) {
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

    /**
     * Gets the value of an attribute. Returns null if key not found.
     * @param key name of attribute
     */
    getAttribute(key: string): string {
        var found = null;
        this.attributes.forEach(attribute => {
            if (attribute.key === key) {
                found = attribute.value;
            }
        });
        return found;
    }

    /**
     * Replaces an attribute if the key already exists, else adds a new attribute.
     * @param key name of attribute
     * @param value value to give to attribute
     */
    setAttribute(key: string, value: string) {
        this.attributes.forEach(attribute => {
            if (attribute.key === key) {
                attribute.value = value;
                return;
            }
        });
        this.addAttribute(new DOMAttr(key, value));
    }
}

/**
 * Represents an element in HTML DOM.
 */
export class SVGElement extends DOMElement {

    constructor(name: string, attributes?: DOMAttr[], children?: SVGElement[]) {
        super(name, attributes, children);
    }

    createElement(): Element {
        return document.createElementNS(xmlns, this.name);
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