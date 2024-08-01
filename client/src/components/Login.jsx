import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useState} from 'react';
import {Navigate} from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';


export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const {setUserInfo} = useContext(UserContext)

    async function login(event) {
        event.preventDefault()
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
                setRedirect(true)
            })           
        } else {
            alert('wrong credentials')
        }
    }

    if (redirect) {
        return <Navigate to='/home' />
    }

    return (
    <Form className='p-5 pb-3' onSubmit={login}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username:</Form.Label>
        <Form.Control type="username" 
            placeholder="Enter username"
            value={username}
            onChange={event => setUsername(event.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control type="password" 
            placeholder="Password" 
            value={password}
            onChange={event => setPassword(event.target.value)}/>
      </Form.Group>
      <Button variant="primary w-100" type="submit">
        Submit
      </Button>
      <Link className='my-2 pb-3' to={'/'}><span>Forgot password? Click here</span></Link>
    </Form>
    )
}