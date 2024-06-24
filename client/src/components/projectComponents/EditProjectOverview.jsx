import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import mangaPic from '../../cssImages/Manga5.jpeg'
import Image from "react-bootstrap/Image";
import { useState, useEffect } from "react";

export default function EditProjectOverview({
  projectInfo,
  setViewNumber,
  setIsUpdated,
}) {
  //<a href="https://www.freepik.com/free-vector/aged-paper-texture-background-design_14765966.htm#query=old%20paper&position=3&from_view=search&track=ais">Image by boggus</a> on Freepik
  //<a href="https://www.freepik.com/free-vector/watercolour-background-with-leaves_15206849.htm#query=old%20paper&position=9&from_view=search&track=ais">Image by VecMes</a> on Freepik

  const [files, setFiles] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [summary, setSummary] = useState("");
  const [picture, setPicture] = useState("")
  const [loadData, setLoadData] = useState(false);
  const id = projectInfo._id;

  useEffect(() => {
    if(projectInfo._id) {
      setTitle(projectInfo.title)
      setAuthor(projectInfo.author)
      setGenre(projectInfo.genre)
      setSummary(projectInfo.summary)
      setPicture(projectInfo.cover)
      setLoadData(true)
    }
  }, [projectInfo._id])

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("genre", genre);
    data.set("author", author);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch("http://localhost:5000/projectOverview", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setIsUpdated(false);
      setViewNumber("1");
      window.location.reload();
    }
  }

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="mt-3">{title} Overview</h1>
              {picture ? (
                <Image
                  src={`http://localhost:5000/${picture}`}
                  alt= 'Avatar'
                  style={{ maxHeight: "300px", maxWidth: '97%', borderRadius: '3%'}}
                />
            ) :
            (
              <Image
                  src={mangaPic}
                  alt= 'Avatar'
                  style={{ maxHeight: "300px", maxWidth: '97%', borderRadius: '3%'}}
                />
            )}
            <Form className="my-4" onSubmit={updatePost}>
              <Form.Group className="mb-3">
                <Form.Label>Title:</Form.Label>
                <Form.Control
                  type="title"
                  placeholder={"Title"}
                  value={title}
                  onChange={(ev) => setTitle(ev.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cover:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(ev) => setFiles(ev.target.files)}
                />
                <Form.Text muted>
                  Upload the image that will be the cover of your story.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"Robert Hemingway"}
                  value={author}
                  onChange={(ev) => setAuthor(ev.target.value)}
                />
                <Form.Text muted>That's you</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Genre:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"Sci-Fi, Action, Adventure"}
                  value={genre}
                  onChange={(ev) => setGenre(ev.target.value)}
                />
                <Form.Text muted>
                  Don't be afraid to name 2 or 3 genres, but don't name too
                  many.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Summary:</Form.Label>
                <Form.Control
                  type="summary"
                  as="textarea"
                  placeholder={`"In a world where magic is everything, Asta and Yuno are both found abandoned at a church on the same day. While Yuno is gifted with exceptional magical powers, Asta is the only one in this world without any. At the age of fifteen, both receive grimoires, magic books that amplify their holder’s magic. Asta’s is a rare Grimoire of Anti-Magic that negates and repels his opponent’s spells. Being opposite but good rivals, Yuno and Asta are ready for the hardest of challenges to achieve their common dream: to be the Wizard King. Giving up is never an option!" - "Black Clover"`}
                  value={summary}
                  rows="13"
                  max-rows="25"
                  onChange={(ev) => setSummary(ev.target.value)}
                />
                <Form.Text muted>
                  Describe the overall premise of your story here. If you were
                  to describe the gist of the story in 2-5 sentences, what would
                  it be? Be sure to highlight the protagonist, setting, plot,
                  conflict, and feel of the story without saying too much. This
                  should capture the attention of the reader and make them want
                  to dive in without divulging anything that would spoil the
                  story.
                </Form.Text>
              </Form.Group>
              <div className="text-center">
                <Button variant="primary w-50 mt-4" size="lg" type="submit">
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
