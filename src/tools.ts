class Tool {
    constructor(public id:string) {
        document.getElementById(id).onclick = this.onclick;
    }

    onclick() {
        changeCurrentTool(this);
    }
}

let changeCurrentTool = function(tool:Tool) {
    // set current tool
    currentTool = tool;

    // change cursor style
    let cursorStyle = window.getComputedStyle(document.getElementById(tool.id)).cursor;
    document.getElementById("frameparent").style.cursor = cursorStyle;
}

let tools:Tool[] = [
    new Tool("pointertool"),
    new Tool("erasertool"),
    new Tool("sinetool")
];

let currentTool:Tool = tools[0];