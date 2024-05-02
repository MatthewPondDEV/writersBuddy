import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function QuillEditor({ value, onChange }) {
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const quillRef = useRef();

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().on("text-change", () => {
        const text = quillRef.current.getEditor().getText();
        const words = text.match(/\S+/g) || [];
        const numWords = words.length;
        setWordCount(numWords);

        // Assume a rough estimate of words per page (adjust as needed)
        const wordsPerPage = 250;
        const numPages = Math.ceil(numWords / wordsPerPage);
        setPageCount(numPages);
      });
    }
  }, []);

  const handleTextChange = (content, delta, source, editor) => {
    onChange(content);
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["undo", "redo"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    'size',
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
  ];

  return (
    <div id="editor-container" className="d-flex flex-column justify-content-between">
      
      <ReactQuill
        ref={quillRef}
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleTextChange}
        placeholder="Write something epic..."
        theme="snow"
      />
      <div className='d-flex' style={{ marginTop: "20px" }}>
        <p className="ms-5">Word Count: {wordCount}</p>
        <p className="ms-5">Page Count: {pageCount}</p>
      </div>
    </div>
  )
}