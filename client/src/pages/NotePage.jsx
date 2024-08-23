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
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
  const [showMessage, setShowMessage] = useState(true);
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
  const [findNote, setFindNote] = useState(false)
  const [currentNoteId, setCurrentNoteId] = useState(
    window.sessionStorage.getItem("currentNoteId")
  );


  useEffect(() => {
    const retrieveNotes = async () => {
      const response = await fetch(`${serverRoute}/getUserNotes`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
      const noteArray = await response.json();
        setNotes(noteArray);
        setUpdated(true);
        setFindNote(true)
      }
    };
    retrieveNotes();
  }, [updated]);

 useEffect(() => {
    // Use find to get the note with the currentNoteId
    const currentNote = notes.find((note) => note._id === currentNoteId);

    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setShowMessage(false);
    }
}, [currentNoteId, findNote]);

  async function updateNote(ev) {
    ev.preventDefault();
    const response = await fetch(`${serverRoute}/updateNote`, {
      method: "Put",
      body: JSON.stringify({ title, content, currentNoteId }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      setUpdated(false);
    }
  }

  const createNote = async () => {
    const create = await fetch(`${serverRoute}/createNewNote`, {
      method: "Post",
      body: JSON.stringify({ title: "New Note" }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (create.ok) {
      const noteDoc = await create.json();
      const updatedNotes = [...notes, noteDoc];
      setNotes(updatedNotes);
      setCurrentNoteId(noteDoc._id);
    }
  };

  async function deleteNote() {
    const deleteFunction = await fetch(`${serverRoute}/deleteNote`, {
      method: "Delete",
      body: JSON.stringify({ currentNoteId }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (deleteFunction.ok) {
      setCurrentNoteId(null)
      window.sessionStorage.setItem("currentNoteId", null);
      setUpdated(false);
      setShowMessage(true)
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
          showMessage={showMessage}
        />
        <Col xs={12} xxl={10} id="papyrus">
          <div className="mt-4">
            <h5 className="mx-2">Notes</h5>
          </div>
          {showMessage === true ? (
            <>
              <h2 className="text-center">Select or Create a note to begin</h2>
            </>
          ) : (
            <Container>
              <Row>
                <Col className="my-5 py-5">
                  <Form onSubmit={updateNote}>
                    <div className="mb-3 d-flex align-items-center flex-column text-center">
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
                    </div>
                    <Tiptap
                      content={content}
                      id={currentNoteId}
                      onChange={setContent}
                    />
                    <div className="text-center d-flex flex-column align-items-center my-3">
                      <Button
                        variant="primary w-75 mt-4"
                        size="lg"
                        type="submit"
                      >
                        Save Changes
                      </Button>
                      <Button variant="danger mt-3 w-50" onClick={deleteNote}>
                        <i className="bi bi-trash"></i> Delete Note
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
}
