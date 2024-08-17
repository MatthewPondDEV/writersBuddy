import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";

export default function CreateChapterModal({
  showModal,
  handleClose,
  write,
  id,
  setIsUpdated,
  setCurrentChapterId,
  setViewNumber,
}) {
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
  const [title, setTitle] = useState("");
  const [loadData, setLoadData] = useState(false)
  const [chapterNumber, setChapterNumber] = useState(Number);

  function startLoad() {
    const t = setTimeout(() => {
      if (!loadData && id) {
        setChapterNumber(write.chapters.length + 1);
      }
      setLoadData(true);
    }, 200);

    if (loadData) {
      clearTimeout(t);
    }
  }
  startLoad();

  async function createChapter(ev) {
    ev.preventDefault();
    const response = await fetch(`${serverRoute}/createChapter`, {
      method: "PUT",
      body: JSON.stringify({ title, chapterNumber, id }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      setIsUpdated(false);

      const idResponse = await fetch(
        `${serverRoute}/getChapterId/${id}`,
        {
          credentials: "include",
        }
      );

      const chapter = await idResponse.json();
      setCurrentChapterId(chapter._id);
      setViewNumber("25");
      setTitle("");
      handleClose();
      window.location.reload();
    }
  }

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={true}
      className="mt-5"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create a new Chapter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createChapter}>
          <Form.Group className="mb-4">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="title"
              placeholder={"Name of your next chapter"}
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <Form.Text muted>What is the title of this chapter?</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Chapter Number</Form.Label>
            {write && (
              <Form.Control
                type="number"
                value={chapterNumber}
                placeholder=""
                onChange={(ev) => setChapterNumber(ev.target.value)}
              />
            )}
          </Form.Group>
          <div className="d-flex justify-content-end border-top ">
            <Button variant="secondary me-3 mt-3" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary mt-3" type="submit">
              Create
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
