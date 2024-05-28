import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';


export default function CreateProjectModal({ handleClose, showModal }) {
    const [title,setTitle] = useState('');
    const [redirect, setRedirect] = useState(false)
    const [id,setId] = useState(null)

    async function createProject(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/createProject', {
            method: 'Post',
            body: JSON.stringify({title}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })
        if (response.ok) {
          setRedirect(true)
        }
    }

    if (showModal && redirect) {
        const getId = fetch('http://localhost:5000/getProjectID', {
            credentials: 'include',
            }).then(res => {
              res.json().then(project => {
                setId(project[0]._id)
          })
        })
  }


    if (redirect && id) {
        return <Navigate to={`/project/${id}`} />
    }

    return (
        <Modal
        show = {showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className='mt-5'
        >
        <Modal.Header closeButton>
          <Modal.Title>Create Your Next Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createProject}>
            <Form.Group className="mb-4">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="title"
                placeholder = {'Think "Romeo & Juliet", "One Piece", "Spiderman", ...'}
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
            </Form.Group>
            <div className='d-flex justify-content-end border-top '>
            <Button variant="secondary me-3 mt-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary mt-3" type="submit">Create</Button>
          </div>
          </Form>
        </Modal.Body>
      </Modal>
    )
}