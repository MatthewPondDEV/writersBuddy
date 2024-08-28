import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const serverRoute = import.meta.env.VITE_AUTH_API_ROUTE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword != confirmPass) {
        setMessage('Both inputs must match to move forward with your password reset.')
    } else {
    try {
      const response = await fetch(`${serverRoute}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
        credentials: 'include'
      });
      const result = await response.text();
      setMessage(result);
      setRedirect(true)
    } catch (error) {
      setMessage("Error resetting password");
    }
    }
  };

   if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Container fluid>
      <Row sm md id="index-background">
        <Col className='d-flex justify-content-center align-items-center'>
          <div
            className="my-5 mx-3 px-5 py-5 text-center"
            style={{
              maxWidth: "800px",
              minWidth: "50%",
              background: "rgba(0, 0, 0, 0.75)",
              boxShadow: "0 0 15px #ffffff",
              borderRadius: "20px",
            }}
          >
            <h1 className='text-center text-white mb-5'>Reset Your Password</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label className='text-white text-start'>New Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3 mt-4' controlId="formBasicPassword">
                <Form.Label className='text-white text-start'>Confirm Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary w-100 mt-5 mb-3" type="submit">
                Reset Password
              </Button>
              {message && <p>{message}</p>}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
