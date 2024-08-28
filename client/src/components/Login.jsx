import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function Login({setResetPass, setLoadLogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const serverRoute = import.meta.env.VITE_AUTH_API_ROUTE;
  
  async function login(event) {
    event.preventDefault();
    const response = await fetch(`${serverRoute}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to="/home" />;
  }

  return (
    <Form className="p-5 pb-3" onSubmit={login}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Form.Group>
      <Button variant="primary w-100" type="submit">
        Submit
      </Button>
      <Button
        variant="link"
        className="my-2 pb-3"
        onClick={() => {
          setLoadLogin(false);
          setResetPass(true)
        }}
      >
        Forgot password? Click here
      </Button>
    </Form>

  );
}
