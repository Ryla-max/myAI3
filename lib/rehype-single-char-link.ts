import { visit } from "unist-util-visit";
import type { Root } from "hast";

/**
 * Rehype plugin that adds a 'single-char-link' class to anchor elements
 * whose text content is exactly one character (after trimming whitespace).
 */
export function rehypeSingleCharLink() {
    return (tree: Root) => {
        visit(tree, "element", (node) => {
            if (node.tagName === "a") {
                // Extract text content from the anchor element
                const textContent = extractTextContent(node);
                const trimmedText = textContent.trim();

                // If the trimmed text is exactly one character, add the class
                if (trimmedText.length === 1) {
                    node.properties = node.properties || {};

                    // Handle className which can be string, number, true, or array
                    const existingClass = Array.isArray(node.properties.className)
                        ? node.properties.className.filter((c): c is string => typeof c === "string")
                        : typeof node.properties.className === "string"
                            ? [node.properties.className]
                            : [];

                    node.properties.className = [...existingClass, "single-char-link"];
                }
            }
        });
    };
}

/**
 * Recursively extracts text content from a node and its children.
 */
function extractTextContent(node: any): string {
    if (node.type === "text") {
        return node.value || "";
    }

    if (node.children && Array.isArray(node.children)) {
        return node.children
            .map((child: any) => extractTextContent(child))
            .join("");
    }

    return "";
}

