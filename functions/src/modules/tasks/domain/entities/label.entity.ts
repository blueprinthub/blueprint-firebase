/**
 * Represents a label that can be applied to a task.
 * @interface
 * @property {string} name - The text representation of the status.
 * For example, "In Progress".
 * @property {string} colorHex - The hex color of the status.
 * For example, "#FF0000"
 * @example
 * {
  name: "Completed",
  colorHex: "#000000",
}
 */
export interface Label {
  /**
   * The text representation of the status. For example, "In Progress".
   */
  name: string;

  /**
   * The hex color of the status. For example, "#FF0000"
   */
  colorHex: string;
}
