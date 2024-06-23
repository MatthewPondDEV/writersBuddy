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
    window.sessionStorage.getItem("currentChat")
      ? JSON.parse(window.sessionStorage.getItem("currentChat"))
      : ["What can I help you with today?"]
  );
  const [tracker, setTracker] = useState(
    window.sessionStorage.getItem("messageTracker")
      ? JSON.parse(window.sessionStorage.getItem("messageTracker"))
      : ["res"]
  );

  useEffect(() => {
      window.sessionStorage.setItem(
          "currentChat",
          JSON.stringify(currentChat)
        );
        window.sessionStorage.setItem(
          "messageTracker",
          JSON.stringify(tracker))
  }, [tracker, currentChat])

  const sendMessage = async (e) => {
    e.preventDefault();
    setCurrentChat((prevChat) => [...prevChat, message]);
    setTracker((prevTracker) => [...prevTracker, "mes"]);
    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        credentials: "include", // Include credentials (cookies)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        const chatResponse = await res.json(); // Access response data directly

        setCurrentChat((prevChat) => [...prevChat, chatResponse]);
        setTracker((prevTracker) => [...prevTracker, "res"]);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error in fetching data from server
    }
  };

  return (
    <div id="brainstorm-chat" className="py-5 my-5 mx-2">
      <div id="chat-history" className="px-5">
        {currentChat[0] === "What can I help you with today?" &&
          currentChat.map((chat, index) => {
            if (tracker[index] === "mes") {
              return (
                <p key={index} className="me-2 my-5 ms-5 ps-3 text-end">
                  {chat} .
                </p>
              );
            } else {
              return (
                <p key={index} className="ms-2 my-5 me-5 pe-3 text-start">
                  . {chat}
                </p>
              );
            }
          })}
      </div>
      <Form
        onSubmit={sendMessage}
        className="mt-5 my-3 px-5 d-flex flex-column justify-content-center align-self-end"
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
