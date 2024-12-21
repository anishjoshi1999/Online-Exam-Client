import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";
import Blockquote from "@tiptap/extension-blockquote";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import MathExtension from "@aarkue/tiptap-math-extension";
import "katex/dist/katex.min.css";
const WYSIWYGEditor = ({ index, question, onQuestionChange }) => {
  // Initialize the Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Blockquote,
      Image,
      Placeholder.configure({
        placeholder:"Start typing your question here...",
        emptyNodeClass:
          'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      MathExtension.configure({ evaluation: false, katexOptions: { macros: { "\\B": "\\mathbb{B}" } }, delimiters: "dollar" }),
    ],
    content: typeof window !== "undefined" ? question.question : "", // Ensure content is loaded only on the client
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
    immediatelyRender: false, // Prevent rendering immediately on the server
  });

  // Effect to listen for updates in the editor content
  useEffect(() => {
    if (editor) {
      const handleEditorChange = () => {
        onQuestionChange(index, "question", editor.getHTML());
      };

      // Listen for updates from the editor
      editor.on("update", handleEditorChange);

      // Clean up the listener when the component unmounts
      return () => {
        editor.off("update", handleEditorChange);
      };
    }
  }, [editor, index, onQuestionChange]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border rounded-lg shadow-sm bg-white">
        <EditorToolbar editor={editor} />
        <div className="border-t">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
