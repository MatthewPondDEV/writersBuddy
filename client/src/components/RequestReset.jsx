import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function RequestReset({ setLoadLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const serverRoute = import.meta.env.VITE_AUTH_API_ROUTE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverRoute}/reset-password-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.text();
      setMessage(result);
      setEmail("");
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="my-4 pt-5 px-5">
      <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Label>Email address:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Form.Text className="text-white">
          A reset link will be sent to the email associated with your account
        </Form.Text>
      </Form.Group>
      <Button variant="primary w-100" type="submit">
        Request Password Reset
      </Button>
      {message && <p className="text-center text-white">{message}</p>}
    </Form>
  );
}
