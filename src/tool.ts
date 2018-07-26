// Note: This is in its own file because putting it in toolbar would cause a
// circular dependency since it is used by both toolbar and staff.

/**
 * Enum to represent the currently selected tool.
 */
export enum Tool {
    Selector, Eraser, Sinewave
}

var toolSelected: Tool = Tool.Selector;

/**
 * Change currently selected tool.
 * @param tool new tool
 */
export function setSelectedTool(tool: Tool) {
    toolSelected = tool;
}

/**
 * Get currently selected tool.
 */
export function getSelectedTool() {
    return toolSelected;
}