import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import TipTap from "../../Tiptap";
import DeleteChapterModal from "./DeleteChapterModal";

export default function EditChapter({
  projectInfo,
  setViewNumber,
  _id,
  currentChapterId,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chapterNumber, setChapterNumber] = useState(Number);
  const [showEditTitle, setShowEditTitle] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleClose = () => setShowDeleteModal(false);
    const handleOpen = () => setShowDeleteModal(true);

  useEffect(() => {
    if (projectInfo._id) {
      projectInfo.write.chapters.forEach((chapter) => {
        if (currentChapterId === chapter._id) {
          setTitle(chapter.title);
          setChapterNumber(chapter.chapterNumber);
          setContent(chapter.content);
        }
      });
    }
  }, [currentChapterId, projectInfo._id]);

  async function updateChapter(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("content", content);
    data.set("chapterNumber", chapterNumber);
    data.set("id", _id);
    data.set("chapterId", currentChapterId);

    console.log(content)

    const response = await fetch("http://localhost:5000/updateChapter", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      window.location.reload();
    }
  }

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <DeleteChapterModal
        showModal={showDeleteModal}
        handleClose={handleClose}
        currentChapterId={currentChapterId}
        id={_id}
        setViewNumber={setViewNumber}
      />
      <div className="d-flex justify-content-between mt-4">
        <h5 className="mx-2">Chapters</h5>
        <Button variant="primary" onClick={handleOpen}>
          <i className="bi bi-trash"></i> Delete Chapter
        </Button>
      </div>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <Form onSubmit={updateChapter}>
              <div className="d-flex align-items-center flex-column text-center">
                <h1 className="text-center mt-5">
                  Chapter {chapterNumber}: <br />
                  {title}
                </h1>
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
                      className="text-center"
                      value={title}
                      onChange={(ev) => setTitle(ev.target.value)}
                    />
                    <Form.Label className="mt-2">Chapter Number:</Form.Label>
                    <Form.Control
                      type="number"
                      value={chapterNumber}
                      className="text-center"
                      onChange={(ev) => setChapterNumber(ev.target.value)}
                    />
                    <div className=" text-center">
                      <Button variant="primary mt-2" type="submit">
                        Save
                      </Button>
                    </div>
                  </Form.Group>
                )}
              </div>
              <div>
                <TipTap content = {content} onChange={setContent} id={currentChapterId} />
              </div>
              <div className="text-center my-5">
                <Button variant="primary w-75 mt-4" size="lg" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
