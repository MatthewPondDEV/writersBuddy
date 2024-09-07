import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

export default function Register({ setLoadRegister, setLoadLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const serverRoute = import.meta.env.VITE_AUTH_API_ROUTE;

  async function register(event) {
    event.preventDefault();
    if (password.length < 8) {
      setMessage(
        "Password is too short. Please make password at least 8 characters long."
      );
    } else {
      try {
        const response = await fetch(`${serverRoute}/register`, {
          method: "POST",
          body: JSON.stringify({ email, username, password }),
          headers: { "Content-Type": "application/json" },
        });
        alert("Registration Successful");
        setLoadLogin(true);
        setLoadRegister(false);
      } catch (error) {
        setMessage(error);
      }
    }
  }

  return (
    <Form className="p-5 pb-3" onSubmit={register}>
      <Form.Group className="mb-3">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          name="username"
          type="username"
          placeholder="Enter username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          name="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Form.Text className="text-white">
          Password must be at least 8 characters long
        </Form.Text>
      </Form.Group>

      <Button variant="primary w-100" type="submit">
        Submit
      </Button>
      {message && <p className="text-center text-danger">{message}</p>}
    </Form>
  );
}
