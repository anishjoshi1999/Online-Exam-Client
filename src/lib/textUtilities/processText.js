import renderLatex from "./renderLatex";
function processText(text) {
    // First, replace any HTML entities
    const decodedText = text.replace(/&[#\w]+;/g, (match) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = match;
      return textarea.value;
    });
  
    // Then render LaTeX within the text
    return renderLatex(decodedText);
  }
  export default processText;
 