import React from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Calculator,
  Image 
} from "lucide-react";

const ToolbarButton = ({ onClick, isActive, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      isActive ? "text-blue-600 bg-blue-50" : "text-gray-600"
    }`}
  >
    {children}
  </button>
);

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="p-2 flex flex-wrap gap-1 border-b">
      <div className="flex items-center space-x-1 mr-4">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          <Strikethrough className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          <Code className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => addImage()}
          isActive={editor.isActive("image")}
        >
          <Image className="w-5 h-5" />
        </ToolbarButton>
      </div>
      <div className="flex items-center space-x-1 mr-4">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <Quote className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center space-x-1">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="w-5 h-5" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export default EditorToolbar;
