import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Image from "react-bootstrap/Image";

export default function EditSettingGeneral({settingInfo, setViewNumber,setIsUpdated, _id}) {

    const [files,setFiles] = useState('')
    const [location,setLocation] = useState('')
    const [timePeriod, setTimePeriod] = useState('')
    const [description,setDescription] = useState('')
    const [pictures, setPictures] = useState([]);
    const [loadData, setLoadData] = useState(false)

    function startLoad() {
    const t = setTimeout(() => {
        if(!loadData && settingInfo) {
            setLocation(settingInfo.location)
            setTimePeriod(settingInfo.timePeriod)
            setDescription(settingInfo.description)
            setLoadData(true)
        }
    }, 200)

    if (loadData) {
        clearTimeout(t)
    }
    }
    startLoad()

    async function updateSettingGeneral(ev) {
            ev.preventDefault()
            const data = new FormData()
            data.set('location', location)
            data.set('timePeriod', timePeriod)
            data.set('description', description)
            data.set('id', _id)
            if (files?.[0]) {
                data.set('files', files?.[0])
            }
            const response = await fetch('http://localhost:5000/settingGeneral', {
                method: 'PUT',
                body: data,
                credentials: 'include',
            })

            if (response.ok) {
                setIsUpdated(false)
                setViewNumber('2')
                window.location.reload()
            }
    }

    return (
      <Col id="papyrus" xs={12} xxl={9}>
        <Container>
          <Row className="my-5">
            <Col xs={12}>
              <h1 className="mt-3">General Setting</h1>
              <div className="d-flex justify-content-center flex-wrap">
                {pictures[0] &&
                  pictures.map((picture) => (
                    <Col xs={12} md={6} className="text-center">
                      <Image
                        src={`http://localhost:5000/${picture}`}
                        alt="Avatar"
                        style={{
                          height: "300px",
                          width: "70%",
                          borderRadius: "20%",
                        }}
                        className="mx-5"
                      />
                    </Col>
                  ))}
              </div>
              <Form className="my-4" onSubmit={updateSettingGeneral}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Period:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={"Time Period"}
                    value={timePeriod}
                    onChange={(ev) => setTimePeriod(ev.target.value)}
                  />
                  <Form.Text muted>
                    What are the general years in time that your story takes
                    place?{" "}
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    max-rows="6"
                    placeholder={"Location"}
                    value={location}
                    onChange={(ev) => setLocation(ev.target.value)}
                  />
                  <Form.Text muted>
                    Where is the story generally located? Are we in space or
                    medieval England? The location could be a completely
                    fictional world, or it could be Detroit in 1998. Completely
                    up to you, the author.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="8"
                    max-rows="16"
                    placeholder={"Setting Description"}
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                  />
                  <Form.Text muted>
                    Give a basic description of your setting here. How advanced
                    is the technology? What is life generally like for people at
                    that time? Who is in power? Are there any key aspects of
                    society that have a big impact on peoples' lives? You will
                    not need to go deep in detail regarding each country,
                    territory or city, as you have places to input those in the
                    sidebar, but you should put enough information that it is
                    easy to understand the general idea of what the setting is
                    like.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Pictures:</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(ev) => setFiles(ev.target.files)}
                  />
                  <Form.Text muted>
                    Upload any pictures or drawings that show the setting of the
                    story. To upload multiple files, hold CTRL or SHIFT before
                    clicking your pictures.
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
