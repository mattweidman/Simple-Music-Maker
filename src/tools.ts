/**
 * Represents a tool in the sidebar.
 */
class Tool {
    constructor(public id:string) {
        document.getElementById(id).onclick = this.onclick;
    }

    onclick() {
        changeCurrentTool(this);
    }
}

/**
 * Changes the selected tool.
 * @param tool tool to switch to
 */
let changeCurrentTool = function(tool:Tool) {
    // set current tool
    currentTool = tool;

    // change cursor style
    let cursorStyle = window.getComputedStyle(document.getElementById(tool.id)).cursor;
    document.getElementById("frameparent").style.cursor = cursorStyle;
}

/**
 * List of all tools and their names.
 */
let tools:Tool[] = [
    new Tool("pointertool"),
    new Tool("erasertool"),
    new Tool("sinetool")
];

/** Currently selected tool. */
let currentTool:Tool = tools[0];