import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import NoteSidebar from "../components/NoteSidebar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import QuillEditor from "../components/projectComponents/QuillEditor";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tiptap from "../components/Tiptap";

export default function NotePage() {
  const [notes, setNotes] = useState([
    {
      title: "",
      content: "",
    },
  ]);
  const [title, setTitle] = useState("");
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [content, setContent] = useState("");
  const [updated, setUpdated] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(
    window.localStorage.getItem("currentNoteId")
  );

  const createNote = async () => {
    const create = await fetch("http://localhost:5000/createNewNote", {
      method: "Post",
      body: JSON.stringify({ title: "New Note" }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (create.ok) {
      setUpdated(false);
      setCurrentNoteId(notes[notes.length - 1]._id);
      window.localStorage.setItem("currentNoteId", currentNoteId);
    }
  };

  useEffect(() => {
    const retrieveNotes = async () => {
      const response = await fetch("http://localhost:5000/getUserNotes", {
        method: "GET",
        credentials: "include",
      });

      const noteArray = await response.json();
      if (noteArray.length) {
        setNotes(noteArray);
        setUpdated(true);
      } else {
        createNote();
      }
    };
    retrieveNotes();
  }, [updated]);

  useEffect(() => {
    window.localStorage.setItem("currentNoteId", currentNoteId);
    if (notes.length) {
      notes.forEach((note) => {
        if (note._id === currentNoteId) {
          setTitle(note.title);
          setContent(note.content);
        }
      });
    }
  }, [currentNoteId, updated]);

  async function updateNote(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:5000/updateNote", {
      method: "Put",
      body: JSON.stringify({ title, content, currentNoteId }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      setUpdated(false);
    }
  }

  async function deleteNote() {
    const deleteFunction = await fetch("http://localhost:5000/deleteNote", {
      method: "Delete",
      body: JSON.stringify({ currentNoteId }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (deleteFunction.ok) {
      setUpdated(false);
      setCurrentNoteId(notes[0]._id);
    }
  }
  return (
    <Container fluid>
      <Header />
      <Row>
        <NoteSidebar
          notes={notes}
          createNote={createNote}
          setCurrentNoteId={setCurrentNoteId}
        />
        <Col xs={12} xxl={10} id="papyrus">
          <div className="d-flex justify-content-between mt-4">
            <h5 className="mx-2">Notes</h5>
            <Button variant="primary" onClick={deleteNote}>
              <i class="bi bi-trash"></i> Delete Note
            </Button>
          </div>
          <Container>
            <Row>
              <Col className="my-5 py-5">
                <Form onSubmit={updateNote}>
                  <div className="mb-5 d-flex align-items-center flex-column text-center">
                    <h1 className="text-center">{title}</h1>
                    <Button
                      variant="primary"
                      onClick={() => {
                        showEditTitle
                          ? setShowEditTitle(false)
                          : setShowEditTitle(true);
                      }}
                    >
                      <i className="bi bi-pencil-square mx-2" />
                    </Button>
                    {showEditTitle && (
                      <Form.Group className="mb-1 text-start">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                          type="text"
                          className=""
                          value={title}
                          onChange={(ev) => setTitle(ev.target.value)}
                        />
                        <div className=" text-center">
                          <Button variant="primary mt-2" type="submit">
                            Save
                          </Button>
                        </div>
                      </Form.Group>
                    )}
                  </div>
                  <Tiptap />
                  <div className="text-center my-3">
                    <Button variant="primary w-75 mt-4" size="lg" type="submit">
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
