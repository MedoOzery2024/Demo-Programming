"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Code, Quote, Undo, Redo } from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const btnClass = "p-2 rounded hover:bg-gold-500/20 text-gray-400 hover:text-gold-400 disabled:opacity-50 transition-colors";
  const activeClass = "bg-gold-500/20 text-gold-400";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-[#141414] rounded-t-lg">
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}>
        <Bold size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}>
        <Italic size={16} />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 my-auto"></div>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}>
        <Heading1 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}>
        <Heading2 size={16} />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 my-auto"></div>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}>
        <List size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}>
        <ListOrdered size={16} />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 my-auto"></div>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`${btnClass} ${editor.isActive('codeBlock') ? activeClass : ''}`}>
        <Code size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btnClass} ${editor.isActive('blockquote') ? activeClass : ''}`}>
        <Quote size={16} />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1 my-auto"></div>
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={btnClass}>
        <Undo size={16} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={btnClass}>
        <Redo size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none focus:ring-0',
      },
    },
  });

  return (
    <div className="glass rounded-lg border border-white/10 flex flex-col overflow-hidden bg-[#0A0A0A]">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1 bg-transparent" />
    </div>
  );
}
