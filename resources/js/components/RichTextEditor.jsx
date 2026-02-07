import React, { useState, useEffect, useRef } from 'react';

// Simple Rich Text Editor Component compatible with React 19
const RichTextEditor = ({ value, onChange, placeholder, error, minHeight = 200 }) => {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
            updateCharCount(value);
        }
    }, [value]);

    const updateCharCount = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html || '';
        const plainText = (tempDiv.textContent || tempDiv.innerText || '').trim();
        setCharCount(plainText.length);
    };

    const handleInput = (e) => {
        const html = e.target.innerHTML;
        onChange(html);
        updateCharCount(html);
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const ToolbarButton = ({ onClick, children, title, active = false }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${active ? 'bg-gray-300' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className={`border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} ${isFocused ? 'ring-2 ring-green-500' : ''}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
                <div className="flex gap-1">
                    <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
                        <strong>B</strong>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
                        <em>I</em>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
                        <u>U</u>
                    </ToolbarButton>
                </div>
                <div className="border-l border-gray-300 mx-1"></div>
                <div className="flex gap-1">
                    <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
                        •
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
                        1.
                    </ToolbarButton>
                </div>
                <div className="border-l border-gray-300 mx-1"></div>
                <div className="flex gap-1">
                    <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
                        ⬅
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
                        ⬌
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('justifyRight')} title="Align Right">
                        ➡
                    </ToolbarButton>
                </div>
                <div className="border-l border-gray-300 mx-1"></div>
                <div className="flex gap-1">
                    <ToolbarButton onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) execCommand('createLink', url);
                    }} title="Insert Link">
                        🔗
                    </ToolbarButton>
                </div>
            </div>
            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="min-h-[200px] p-3 focus:outline-none rich-text-editor-content"
                style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    minHeight: `${minHeight}px`,
                }}
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />
            {/* Character Counter */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 rounded-b-md flex justify-between items-center text-xs">
                <span className="text-gray-500">Plain text characters (HTML tags not counted)</span>
                <span className="font-medium text-gray-600">
                    {charCount.toLocaleString()}
                </span>
            </div>
            <style>{`
                .rich-text-editor-content[data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
                .rich-text-editor-content {
                    outline: none;
                }
                .rich-text-editor-content p {
                    margin: 0.5em 0;
                }
                .rich-text-editor-content ul, 
                .rich-text-editor-content ol {
                    margin: 0.5em 0;
                    padding-left: 2em;
                }
                /* Make formatting visible in editor */
                .rich-text-editor-content strong,
                .rich-text-editor-content b {
                    font-weight: 700 !important;
                }
                .rich-text-editor-content em,
                .rich-text-editor-content i {
                    font-style: italic !important;
                }
                .rich-text-editor-content u {
                    text-decoration: underline !important;
                }
                .rich-text-editor-content a {
                    color: #10b981 !important;
                    text-decoration: underline !important;
                    cursor: pointer;
                }
                .rich-text-editor-content a:hover {
                    color: #059669 !important;
                }
                .rich-text-editor-content h1 {
                    font-size: 2rem !important;
                    font-weight: 700 !important;
                    margin: 0.5em 0 !important;
                }
                .rich-text-editor-content h2 {
                    font-size: 1.75rem !important;
                    font-weight: 700 !important;
                    margin: 0.5em 0 !important;
                }
                .rich-text-editor-content h3 {
                    font-size: 1.5rem !important;
                    font-weight: 700 !important;
                    margin: 0.5em 0 !important;
                }
                .rich-text-editor-content h4 {
                    font-size: 1.25rem !important;
                    font-weight: 700 !important;
                    margin: 0.5em 0 !important;
                }
                .rich-text-editor-content ul {
                    list-style-type: disc !important;
                    margin: 0.5em 0 !important;
                    padding-left: 2em !important;
                }
                .rich-text-editor-content ol {
                    list-style-type: decimal !important;
                    margin: 0.5em 0 !important;
                    padding-left: 2em !important;
                }
                .rich-text-editor-content li {
                    margin: 0.25em 0 !important;
                }
                .rich-text-editor-content div[style*="text-align: center"],
                .rich-text-editor-content[style*="text-align: center"] {
                    text-align: center !important;
                }
                .rich-text-editor-content div[style*="text-align: right"],
                .rich-text-editor-content[style*="text-align: right"] {
                    text-align: right !important;
                }
                .rich-text-editor-content div[style*="text-align: left"],
                .rich-text-editor-content[style*="text-align: left"] {
                    text-align: left !important;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
