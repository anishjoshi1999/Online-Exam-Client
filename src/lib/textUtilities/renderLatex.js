import katex from 'katex';
import "katex/dist/katex.min.css";
function renderLatex(text) {
    // Regular expression to find block-level LaTeX expressions (between $$)
    const blockLatexRegex = /\$\$([\s\S]+?)\$\$/g;
    
    // Regular expression to find inline LaTeX expressions (between $)
    const inlineLatexRegex = /\$([^$\n]+?)\$/g;
    
    // First, replace block-level LaTeX
    let processedText = text.replace(blockLatexRegex, (match, latexExpression) => {
      try {
        // Render block-level LaTeX
        return katex.renderToString(latexExpression.trim(), {
          throwOnError: false,
          displayMode: true
        });
      } catch (error) {
        console.error('Error rendering block LaTeX:', error);
        return match;
      }
    });
    
    // Then, replace inline LaTeX
    processedText = processedText.replace(inlineLatexRegex, (match, latexExpression) => {
      try {
        // Render inline LaTeX
        return katex.renderToString(latexExpression.trim(), {
          throwOnError: false,
          displayMode: false
        });
      } catch (error) {
        console.error('Error rendering inline LaTeX:', error);
        return match;
      }
    });
    
    return processedText;
  }
export default renderLatex;
