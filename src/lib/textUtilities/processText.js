import renderLatex from "./renderLatex";

function processText(text) {
    console.log("Processing text:", text);

    // Decode HTML entities
    const parser = new DOMParser();
    const decodedText = parser.parseFromString(text, "text/html").body.textContent;

    // Render LaTeX expressions
    return renderLatex(decodedText);
}

export default processText;
