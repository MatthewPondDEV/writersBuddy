import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import Dropdown from "react-bootstrap/Dropdown";
import Highlight from "@tiptap/extension-highlight";
import { useState, useEffect } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Editor } from "@tiptap/core";

export default function TipTap({ content, onChange, id }) {
  const editor = useCurrentEditor({
    content: content,
  });

  const FooterBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
      return null;
    }

    const [pageCount, setPageCount] = useState(1); // Default to 1 page
    const [wordCount, setWordCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      if (editor) {
        const calculatePageCount = () => {
          const wordCount = editor.getHTML().split(/\s+/).length; // Count words
          const pages = Math.ceil(wordCount / 250);
          setPageCount(pageCount);
        };

        const calculateWordCount = () => {
          // Calculate word count based on the text content
          const content = editor.getHTML();
          const words = content.trim().split(/\s+/);
          setWordCount(words.length);
        };
        const calculateCurrentPage = () => {
          const { selection } = editor.state;
          if (selection && selection.anchor) {
            const anchorPosition = editor.view.posAtCoords({ left: 0, top: 0 }); // Get anchor position
            const wordsBeforeCursor = editor.state.doc.textBetween(
              anchorPosition,
              selection.$from.pos,
              " "
            ); // Count words before cursor
            const currentPage = Math.ceil(
              wordsBeforeCursor.split(/\s+/).length / 250
            ); // Calculate current page
            setCurrentPage(currentPage);
          }
        };

        calculatePageCount();
        calculateWordCount();
        calculateCurrentPage();

        // Subscribe to editor changes to update counts
        editor.on("transaction", () => {
          calculatePageCount();
          calculateWordCount();
          calculateCurrentPage();
        });

        return () => {
          editor.off("transaction");
        };
      }
    }, [editor]);

    return (
      <>
        <div className="editor-status flex-wrap">
          <span className="mx-2">Current Page: {currentPage}</span>
          <span className="mx-2">Page Count: {pageCount}</span>
          <span className="me-2">Word Count: {wordCount}</span>
        </div>
      </>
    );
  };

  const MenuBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
      return null;
    }

    const [textColor, setTextColor] = useState("#000000"); // State for text color

    const handleChangeColor = (color) => {
      editor.chain().focus().setColor(color).run();
      setTextColor(color); // Update local state with the selected color
    };

    useEffect(() => {
      if (editor) {
        // Subscribe to editor changes to update text color
        const handler = () => {
          const currentColor =
            editor.getAttributes("textStyle").color || "#000000";
          setTextColor(currentColor); // Update local state with the current text color
        };
        editor.on("transaction", handler);

        return () => {
          editor.off("transaction", handler); // Unsubscribe from the event listener when the component unmounts
        };
      }
    }, [editor]);

    return (
      <>
        <Row
          id="tiptap-nav"
          className="flex-row mx-1 my-4 border-top border-bottom border-dark"
        >
          <Col className="d-flex my-2 justify-content-center flex-wrap">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
            <span className="mx-1">|</span>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={
                editor.isActive("bold") ? "is-active bg-dark text-white" : ""
              }
            >
              <i className="bi bi-type-bold"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={
                editor.isActive("italic") ? "is-active bg-dark text-white" : ""
              }
            >
              <i className="bi bi-type-italic"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              className={
                editor.isActive("underline")
                  ? "is-active bg-dark text-white"
                  : ""
              }
            >
              <i className="bi bi-type-underline"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={
                editor.isActive("strike") ? "is-active bg-dark text-white" : ""
              }
            >
              <i className="bi bi-type-strikethrough"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={
                editor.isActive("highlight")
                  ? "is-active bg-dark text-white"
                  : ""
              }
            >
              <i className="bi bi-highlighter"></i>
            </button>
            <span className="mx-1">|</span>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" })
                  ? "is-active bg-dark text-white"
                  : ""
              }
            >
              <i className="bi bi-text-left"></i>
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" })
                  ? "is-active bg-dark text-white"
                  : ""
              }
            >
              <i className="bi bi-text-center"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" })
                  ? "is-active bg-dark text-white"
                  : ""
              }
            >
              <i className="bi bi-text-right"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={
                editor.isActive("bulletList")
                  ? "is-active bg-dark text-white"
                  : ""
              }
            >
              <i class="bi bi-list-ul"></i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={
                editor.isActive("orderedList")
                  ? "is-active bg-dark text-white"
                  : ""
              }
            >
              <i className="bi bi-list-ol"></i>
            </button>
            <span className="mx-1">|</span>
            <Dropdown>
              <Dropdown.Toggle variant="pb-1 none" id="dropdown-button">
                Font
              </Dropdown.Toggle>
              <Dropdown.Menu id="font-size-dropdown">
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().setFontFamily("Inter").run()
                    }
                    className={
                      editor.isActive("textStyle", { fontFamily: "Inter" })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Inter" }}
                  >
                    Inter
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().setFontFamily("Courier New").run()
                    }
                    className={
                      editor.isActive("textStyle", { fontFamily: "Courier New" })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Courier New" }}
                  >
                    Courier New
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setFontFamily("Brush Script MT")
                        .run()
                    }
                    className={
                      editor.isActive("textStyle", {
                        fontFamily: "Brush Script MT",
                      })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Brush Script MT" }}
                  >
                    Brush Script MT
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().setFontFamily("Futura").run()
                    }
                    className={
                      editor.isActive("textStyle", { fontFamily: "Futura" })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Futura" }}
                  >
                    Futura
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().setFontFamily("Marker Felt").run()
                    }
                    className={
                      editor.isActive("textStyle", { fontFamily: "Marker Felt" })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Marker Felt" }}
                  >
                    Marker Felt
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setFontFamily("Comic Sans MS, Comic Sans")
                        .run()
                    }
                    className={
                      editor.isActive("textStyle", {
                        fontFamily: "Comic Sans MS, Comic Sans",
                      })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Comic Sans MS" }}
                  >
                    Comic Sans
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().setFontFamily("monospace").run()
                    }
                    className={
                      editor.isActive("textStyle", { fontFamily: "monospace" })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "monospace" }}
                  >
                    Monospace
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setFontFamily("Snell Roundhand")
                        .run()
                    }
                    className={
                      editor.isActive("textStyle", {
                        fontFamily: "Snell Roundhand",
                      })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Snell Roundhand" }}
                  >
                    Snell Roundhand
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().setFontFamily("Arial Narrow").run()
                    }
                    className={
                      editor.isActive("textStyle", { fontFamily: "Arial Narrow" })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                    style={{ fontFamily: "Arial Narrow" }}
                  >
                    Arial Narrow                  
                    </button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <span className="mx-1">|</span>
            <Dropdown>
              <Dropdown.Toggle variant="pb-1 none" id="dropdown-button">
                Font size
              </Dropdown.Toggle>
              <Dropdown.Menu id="font-size-dropdown">
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={
                      editor.isActive("heading", { level: 1 })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                  >
                    <h1>Biggest</h1>
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                      editor.isActive("heading", { level: 2 })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                  >
                    <h2>Bigger</h2>
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().setParagraph({ level: 4 }).run()
                    }
                    className={
                      editor.isActive("heading", { level: 4 })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                  >
                    <h4>Normal</h4>
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 5 }).run()
                    }
                    className={
                      editor.isActive("heading", { level: 5 })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                  >
                    <h5>Smaller</h5>
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 6 }).run()
                    }
                    className={
                      editor.isActive("heading", { level: 6 })
                        ? "is-active pt-2 w-100 bg-dark text-white"
                        : ""
                    }
                  >
                    <h6>Smallest</h6>
                  </button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <span className="mx-1">|</span>
            <button>
              <i className="bi bi-palette me-2"></i>
              <input
                className="py-1"
                type="color"
                onChange={(event) => handleChangeColor(event.target.value)}
                value={textColor} // Use local state for the input value
                data-testid="setColor"
              />
            </button>
          </Col>
        </Row>
      </>
    );
  };

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    Underline,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    FontFamily.configure({
      types: ["textStyle"],
    }),
    Highlight.configure({ multicolor: true }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
  ];

  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    setContentLoaded(false);
  }, [id]);

  useEffect(() => {
    if (content && editor) {
      setContentLoaded(true);
      editor.content = content;
    }
  }, [content, editor, contentLoaded]);

  return (
    <>
      {contentLoaded && (
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={content}
          onUpdate={({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
          }}
          placeholder="Start typing here..."
          slotAfter={<FooterBar />}
        ></EditorProvider>
      )}
    </>
  );
}
