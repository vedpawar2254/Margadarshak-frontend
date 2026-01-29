import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
    Bold, Italic, Underline as UnderlineIcon,
    List, ListOrdered, Link as LinkIcon,
    Heading1, Heading2, Quote, Code,
    Undo, Redo, X
} from 'lucide-react';
import { useEffect } from 'react';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const buttonClass = (isActive) =>
        `p-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`;

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg">
            {/* Text Style */}
            <select
                className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 mr-2 focus:outline-none"
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'p') editor.chain().focus().setParagraph().run();
                    else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                    else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                    else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                }}
                value={editor.isActive('heading', { level: 1 }) ? 'h1' :
                    editor.isActive('heading', { level: 2 }) ? 'h2' :
                        editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
            >
                <option value="p">Normal text</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            {/* Formatting */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive('bold'))}
                title="Bold"
                type='button'
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive('italic'))}
                title="Italic"
                type='button'
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={buttonClass(editor.isActive('underline'))}
                title="Underline"
                type='button'
            >
                <UnderlineIcon size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={buttonClass(editor.isActive('strike'))}
                title="Strikethrough"
                type='button'
            >
                <span className="line-through font-serif font-bold text-sm">S</span>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            {/* Lists */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive('bulletList'))}
                title="Bullet List"
                type='button'
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive('orderedList'))}
                title="Ordered List"
                type='button'
            >
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            {/* Others */}
            <button
                onClick={setLink}
                className={buttonClass(editor.isActive('link'))}
                title="Link"
                type='button'
            >
                <LinkIcon size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={buttonClass(editor.isActive('blockquote'))}
                title="Blockquote"
                type='button'
            >
                <Quote size={18} />
            </button>

            <div className="ml-auto flex gap-1">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    title="Undo"
                    type='button'
                >
                    <Undo size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    title="Redo"
                    type='button'
                >
                    <Redo size={18} />
                </button>
            </div>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[150px] p-4 max-w-none text-gray-900',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    // Update content if changed externally (e.g. from props)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (editor.getText() === '' && content) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    color: #111827; /* text-gray-900 */
                }
                .ProseMirror ul {
                    list-style-type: disc !important;
                    padding-left: 1.5em !important;
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                }
                .ProseMirror ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5em !important;
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                }
                .ProseMirror li {
                    margin-top: 0.25em;
                    margin-bottom: 0.25em;
                }
                .ProseMirror blockquote {
                    border-left: 3px solid #dfe2e5;
                    padding-left: 1em;
                    color: #606f7b;
                }
            `}</style>
        </div>
    );
}
