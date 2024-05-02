import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';

export default function CreateCharacterModal({showModal, handleClose, setViewNumber, id, setCurrentCharacterId}) {
    const [characterName, setCharacterName] = useState('')
    const [characterType, setCharacterType] = useState('')

    async function createCharacter(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/createCharacter', {
            method: 'PUT',
            body: JSON.stringify({characterName, characterType, id}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })
        if (response.ok) {
        
            const idResponse = await fetch(`http://localhost:5000/getCharacterId/${id}`, {
                credentials: 'include',
            })

            const character = await idResponse.json()
            console.log(character)
            setCurrentCharacterId(character._id)
            setViewNumber('11')
            setCharacterName('')
            handleClose()
            window.location.reload()
        }
    }

    return (
        <Modal
        show = {showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        className='mt-5'
        >
        <Modal.Header closeButton>
          <Modal.Title>Create a new character</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createCharacter}>
            <Form.Group className="mb-4">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="title"
                placeholder = {'Name of character'}
                value={characterName}
                onChange={event => setCharacterName(event.target.value)}
              />
              <Form.Text muted>
                What is the name of this character? Think "Wyatt Earp", "Bruce Banner", "King Arthur"
              </Form.Text>
            </Form.Group>
            <div key = {'inline-radio'}>
              <Form.Check
            label="Main Protagonist"
            name="group1"
            type={'radio'}
            value = {'Main Protagonist'}
            onChange = {event => setCharacterType(event.target.value)}
            id={`inline-radio-1`}
          />
          <Form.Check
            label="Major Supporting Protagonist"
            name="group1"
            type={'radio'}
            value = {'Major Supporting Protagonist'}
            onChange = {event => setCharacterType(event.target.value)}
            id={`inline-radio-2`}
          />
          <Form.Check
            label="Minor Supporting Protagonist"
            name="group1"
            type={'radio'}
            value = {'Minor Supporting Protagonist'}
            onChange = {event => setCharacterType(event.target.value)}
            id={`inline-radio-3`}
          />
          <Form.Check
            label="Major Antagonist"
            name="group1"
            type={'radio'}
            value = {'Major Antagonist'}
            onChange = {event => setCharacterType(event.target.value)}
            id={`inline-radio-4`}
          />
          <Form.Check
            label="Minor Antagonist"
            name="group1"
            type={'radio'}
            value = {'Minor Antagonist'}
            onClick = {event => setCharacterType(event.target.value)}
            id={`inline-radio-5`}
          />
          <Form.Check
            className='mb-1'
            label="Tertiary"
            name="group1"
            type={'radio'}
            value = {'Tertiary'}
            onClick = {event => setCharacterType(event.target.value)}
            id={`inline-radio-6`}
          />
          <Form.Text muted>
            Select what place this character has in your story.
          </Form.Text>
            </div>
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