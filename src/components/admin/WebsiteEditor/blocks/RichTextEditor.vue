<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'

import {StarterKit} from '@tiptap/starter-kit'
import {Underline} from '@tiptap/extension-underline'
import {TextStyle} from '@tiptap/extension-text-style'
import {Color} from '@tiptap/extension-color'
import {FontFamily} from '@tiptap/extension-font-family'
import {Image} from '@tiptap/extension-image'
import {Link} from '@tiptap/extension-link'
import {TextAlign} from '@tiptap/extension-text-align'

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
    Undo2,
    Redo2,
    Palette,
    RemoveFormatting,
} from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
    content: props.modelValue || '',

    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            },
        }),

        Underline,
        TextStyle,
        Color,
        FontFamily,

        Image.configure({
            inline: false,
            allowBase64: false,
        }),

        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
        }),

        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
    ],

    editorProps: {
        attributes: {
            class: 'rich-text-content focus:outline-none',
        },
    },

    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    },
})

// Sinkronisasi jika konten berubah dari luar editor.
watch(
    () => props.modelValue,
    (value) => {
        if (!editor.value) return

        const currentHTML = editor.value.getHTML()
        const nextHTML = value || ''

        if (currentHTML !== nextHTML) {
            editor.value.commands.setContent(nextHTML, {
                emitUpdate: false,
            })
        }
    },
)

function setHeading(level) {
    editor.value?.chain().focus().toggleHeading({ level }).run()
}

function setParagraph() {
    editor.value?.chain().focus().setParagraph().run()
}

function setAlignment(alignment) {
    editor.value?.chain().focus().setTextAlign(alignment).run()
}

function setFontFamily(event) {
    const value = event.target.value

    if (!value) {
        editor.value?.chain().focus().unsetFontFamily().run()
        return
    }

    editor.value?.chain().focus().setFontFamily(value).run()
}

function setFontSize(event) {
    const value = event.target.value

    if (!value) return

    editor.value
        ?.chain()
        .focus()
        .setMark('textStyle', { fontSize: value })
        .run()
}

function setTextColor(event) {
    const value = event.target.value

    editor.value?.chain().focus().setColor(value).run()
}

function insertLink() {
    const currentLink = editor.value?.getAttributes('link').href || ''
    const url = window.prompt('Masukkan URL tautan:', currentLink)

    if (url === null) return

    if (!url.trim()) {
        editor.value?.chain().focus().unsetLink().run()
        return
    }

    editor.value
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.trim() })
        .run()
}

function insertImage() {
    const url = window.prompt('Masukkan URL gambar:')

    if (!url?.trim()) return

    editor.value
        ?.chain()
        .focus()
        .setImage({ src: url.trim(), alt: '' })
        .run()
}

function insertHorizontalRule() {
    editor.value?.chain().focus().setHorizontalRule().run()
}

function clearFormatting() {
    editor.value
        ?.chain()
        .focus()
        .clearNodes()
        .unsetAllMarks()
        .run()
}

function isActive(name, attributes = {}) {
    return editor.value?.isActive(name, attributes) || false
}

function isTextAlign(alignment) {
    return editor.value?.isActive({ textAlign: alignment }) || false
}

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<template>
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <!-- TOOLBAR -->
        <div class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">

            <!-- Baris 1 -->
            <div class="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2">

                <button
                    type="button"
                    title="Paragraph"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('paragraph') }"
                    @click="setParagraph"
                >
                    <Pilcrow :size="16" />
                </button>

                <button
                    type="button"
                    title="Heading 1"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('heading', { level: 1 }) }"
                    @click="setHeading(1)"
                >
                    <Heading1 :size="17" />
                </button>

                <button
                    type="button"
                    title="Heading 2"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('heading', { level: 2 }) }"
                    @click="setHeading(2)"
                >
                    <Heading2 :size="17" />
                </button>

                <button
                    type="button"
                    title="Heading 3"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('heading', { level: 3 }) }"
                    @click="setHeading(3)"
                >
                    <Heading3 :size="17" />
                </button>

                <span class="mx-1 h-6 w-px bg-slate-200" />

                <select
                    class="toolbar-select"
                    title="Jenis font"
                    @change="setFontFamily"
                >
                    <option value="">Font Default</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>

                <select
                    class="toolbar-select"
                    title="Ukuran font"
                    @change="setFontSize"
                >
                    <option value="">Ukuran</option>
                    <option value="12px">12</option>
                    <option value="14px">14</option>
                    <option value="16px">16</option>
                    <option value="18px">18</option>
                    <option value="20px">20</option>
                    <option value="24px">24</option>
                    <option value="28px">28</option>
                    <option value="32px">32</option>
                    <option value="36px">36</option>
                </select>
            </div>

            <!-- Baris 2 -->
            <div class="flex flex-wrap items-center gap-1 p-2">

                <button
                    type="button"
                    title="Bold"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('bold') }"
                    @click="editor?.chain().focus().toggleBold().run()"
                >
                    <Bold :size="16" />
                </button>

                <button
                    type="button"
                    title="Italic"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('italic') }"
                    @click="editor?.chain().focus().toggleItalic().run()"
                >
                    <Italic :size="16" />
                </button>

                <button
                    type="button"
                    title="Underline"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('underline') }"
                    @click="editor?.chain().focus().toggleUnderline().run()"
                >
                    <UnderlineIcon :size="16" />
                </button>

                <button
                    type="button"
                    title="Strikethrough"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('strike') }"
                    @click="editor?.chain().focus().toggleStrike().run()"
                >
                    <Strikethrough :size="16" />
                </button>

                <span class="mx-1 h-6 w-px bg-slate-200" />

                <button
                    v-for="alignment in [
                        { value: 'left', icon: AlignLeft },
                        { value: 'center', icon: AlignCenter },
                        { value: 'right', icon: AlignRight },
                        { value: 'justify', icon: AlignJustify },
                    ]"
                    :key="alignment.value"
                    type="button"
                    :title="`Align ${alignment.value}`"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isTextAlign(alignment.value) }"
                    @click="setAlignment(alignment.value)"
                >
                    <component :is="alignment.icon" :size="16" />
                </button>

                <span class="mx-1 h-6 w-px bg-slate-200" />

                <button
                    type="button"
                    title="Bullet List"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('bulletList') }"
                    @click="editor?.chain().focus().toggleBulletList().run()"
                >
                    <List :size="16" />
                </button>

                <button
                    type="button"
                    title="Numbered List"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('orderedList') }"
                    @click="editor?.chain().focus().toggleOrderedList().run()"
                >
                    <ListOrdered :size="16" />
                </button>

                <button
                    type="button"
                    title="Blockquote"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('blockquote') }"
                    @click="editor?.chain().focus().toggleBlockquote().run()"
                >
                    <Quote :size="16" />
                </button>

                <span class="mx-1 h-6 w-px bg-slate-200" />

                <button
                    type="button"
                    title="Text Color"
                    class="toolbar-btn relative"
                >
                    <Palette :size="16" />
                    <input
                        type="color"
                        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        @input="setTextColor"
                    />
                </button>

                <button
                    type="button"
                    title="Insert Link"
                    class="toolbar-btn"
                    :class="{ 'toolbar-active': isActive('link') }"
                    @click="insertLink"
                >
                    <LinkIcon :size="16" />
                </button>

                <button
                    type="button"
                    title="Insert Image"
                    class="toolbar-btn"
                    @click="insertImage"
                >
                    <ImageIcon :size="16" />
                </button>

                <button
                    type="button"
                    title="Horizontal Rule"
                    class="toolbar-btn"
                    @click="insertHorizontalRule"
                >
                    <Minus :size="16" />
                </button>

                <button
                    type="button"
                    title="Clear Formatting"
                    class="toolbar-btn"
                    @click="clearFormatting"
                >
                    <RemoveFormatting :size="16" />
                </button>

                <span class="mx-1 h-6 w-px bg-slate-200" />

                <button
                    type="button"
                    title="Undo"
                    class="toolbar-btn"
                    :disabled="!editor?.can().undo()"
                    @click="editor?.chain().focus().undo().run()"
                >
                    <Undo2 :size="16" />
                </button>

                <button
                    type="button"
                    title="Redo"
                    class="toolbar-btn"
                    :disabled="!editor?.can().redo()"
                    @click="editor?.chain().focus().redo().run()"
                >
                    <Redo2 :size="16" />
                </button>
            </div>
        </div>

        <!-- EDITOR -->
        <EditorContent
            :editor="editor"
            class="rich-text-editor min-h-[260px] p-4"
        />

        <div class="border-t border-slate-100 bg-slate-50 px-3 py-2">
            <p class="text-[10px] text-slate-400">
                Gunakan toolbar untuk mengatur format konten.
            </p>
        </div>
    </div>
</template>

<style>
.toolbar-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    color: #475569;
    transition: 0.15s;
}

.toolbar-btn:hover:not(:disabled) {
    background: #e2e8f0;
    color: #0f172a;
}

.toolbar-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.toolbar-active {
    background: #dbeafe;
    color: #0369a1;
}

.toolbar-select {
    max-width: 125px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    padding: 5px 7px;
    font-size: 11px;
    color: #475569;
    outline: none;
}

.toolbar-select:focus {
    border-color: #14a2d8;
}

/* Area editor */
.rich-text-editor .tiptap {
    min-height: 230px;
    outline: none;
    color: #334155;
    font-size: 14px;
    line-height: 1.8;
}

.rich-text-editor .tiptap p {
    margin: 0 0 12px;
}

.rich-text-editor .tiptap h1 {
    margin: 24px 0 12px;
    font-size: 2em;
    font-weight: 700;
    line-height: 1.25;
}

.rich-text-editor .tiptap h2 {
    margin: 22px 0 10px;
    font-size: 1.6em;
    font-weight: 700;
    line-height: 1.3;
}

.rich-text-editor .tiptap h3 {
    margin: 18px 0 8px;
    font-size: 1.3em;
    font-weight: 700;
    line-height: 1.4;
}

.rich-text-editor .tiptap ul {
    padding-left: 24px;
    margin: 12px 0;
    list-style: disc;
}

.rich-text-editor .tiptap ol {
    padding-left: 24px;
    margin: 12px 0;
    list-style: decimal;
}

.rich-text-editor .tiptap li {
    margin: 4px 0;
}

.rich-text-editor .tiptap blockquote {
    border-left: 4px solid #14a2d8;
    padding-left: 16px;
    margin: 16px 0;
    color: #64748b;
}

.rich-text-editor .tiptap a {
    color: #0284c7;
    text-decoration: underline;
}

.rich-text-editor .tiptap img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 16px 0;
    border-radius: 8px;
}

.rich-text-editor .tiptap hr {
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #e2e8f0;
}

.rich-text-editor .tiptap p.is-editor-empty:first-child::before {
    color: #94a3b8;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}
</style>