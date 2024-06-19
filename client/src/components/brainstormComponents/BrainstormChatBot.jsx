import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";

export default function BrainstormChatBot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [currentChat, setCurrentChat] = useState(
    window.localStorage.getItem("currentChat")
      ? window.localStorage.getItem("currentChat")
      : ["What can I help you with today?"]
  );
  const [tracker, setTracker] = useState(
    window.localStorage.getItem("messageTracker")
      ? window.localStorage.getItem("messageTracker")
      : ["res"]
  );

  useEffect(() => {
    if (typeof currentChat[0] != "string") {
      setCurrentChat(["What can I help you with today?"]);
      setTracker(["res"]);
      window.localStorage.setItem("currentChat", currentChat);
      window.localStorage.setITem("messageTracker", tracker);
    }
    if (message) {
      currentChat.push(message);
      tracker.push("mes");
    }
    console.log(currentChat);
    console.log(tracker);
  }, [message]);

  useEffect(() => {
    if (response) {
      currentChat.push(response);
      tracker.push("res");
    }
  }, [response]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/chatbot",
        { message },
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
      setResponse(response.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id="brainstorm-chat" className="py-5 my-5 mx-2">
      <div id="chat-history">
        {currentChat[0] === "What can I help you with today?" &&
          currentChat.map((chat, index) => {
            if (tracker[index] === "mes") {
              return <p className="me-2 my-3 text-end">{chat}</p>;
            }
            if (tracker[index] === "res") {
              return <p className="ms-2 my-3 text-start">{chat}</p>;
            }
          })}
      </div>
      <Form
        className="mt-5 my-3 px-5 d-flex flex-column justify-content-center align-self-end"
        onSubmit={sendMessage}
      >
        <div className="px-5 mb-2 d-flex justify-content-between">
          <i className="bi bi-robot"></i>
          <i className="bi bi-person"></i>
        </div>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message that you want to send to the chatbot to help you brainstorm"
          />
        </Form.Group>
        <Button size="lg" className="mx-5" type="submit">
          Send
        </Button>
      </Form>
    </div>
  );
}
