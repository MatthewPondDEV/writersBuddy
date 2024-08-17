import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useState} from 'react'


export default function Register({setLoadRegister, setLoadLogin}) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const serverRoute = import.meta.env.VITE_AUTH_API_ROUTE

    async function register(event) {
        console.log('hey')
        event.preventDefault();
        const response = await fetch(`${serverRoute}/register`, {
            method: 'POST',
            body: JSON.stringify({email, username, password}),
            headers: {'Content-Type': 'application/json'},
        })
        if (response.status === 200) {
            alert('Registration Successful')
            setLoadLogin(true)
            setLoadRegister(false)
            setRedirect(true)
        } else {
            alert('Registration Failed')
        }
    }

    return (
        <Form className='p-5 pb-3' onSubmit={register}>

            <Form.Group className="mb-3">
                <Form.Label>Username:</Form.Label>
                <Form.Control name="username"
                    type="username" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />
            </Form.Group>
        
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control name="email"
                    type="email" 
                    placeholder="Enter email" 
                    value={email}
                    onChange={event => setEmail(event.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control name="password"
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={event => setPassword(event.target.value)}/>
            </Form.Group>

            <Button variant="primary w-100" type="submit">
                Submit
            </Button>

        </Form>
    )
}