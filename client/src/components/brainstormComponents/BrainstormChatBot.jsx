import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import ClearChatModal from "./ClearChatModal";
import SaveChatModal from "./SaveChatModal";
import Spinner from "react-bootstrap/Spinner";

export default function BrainstormChatBot() {
  const [showSaveChatModal, setSaveChatModal] = useState(false);
  const [showClearChatModal, setShowClearChatModal] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentChat, setCurrentChat] = useState(
    window.sessionStorage.getItem("currentChat")
      ? JSON.parse(window.sessionStorage.getItem("currentChat"))
      : [
          {
            role: "assistant",
            content: "Let's brainstorm! What can I help you with today?",
          },
        ]
  );

  const handleClose = () => setSaveChatModal(false);
  const handleShow = () => setSaveChatModal(true);

  const clearHandleClose = () => setShowClearChatModal(false);
  const clearHandleShow = () => setShowClearChatModal(true);

  useEffect(() => {
    window.sessionStorage.setItem("currentChat", JSON.stringify(currentChat));
    var element = document.getElementById("chat-history");
    element.scrollTop = element.scrollHeight;
  }, [currentChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const updatedChat = [...currentChat, { role: "user", content: message }];
    setCurrentChat(updatedChat);
    setMessage("");
    setShowSpinner(true)
    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        credentials: "include", // Include credentials (cookies)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedChat }),
      });

      if (res.ok) {
        const chatResponse = await res.json(); // Access response data directly

        setCurrentChat([
          ...updatedChat,
          { role: "assistant", content: chatResponse },
        ]);
        setShowSpinner(false)
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error in fetching data from server
    }
  };

  return (
    <div id="brainstorm-chat" className="py-5 my-5 mx-2">
      <div id="chat-history" className="px-2">
        {currentChat[0].role === "assistant" &&
          currentChat.map((chat, index) => {
            if (chat.role === "user") {
              return (
                <p key={index} className="me-1 my-5 ms-5 ps-3 text-end">
                  | <i className="bi bi-person"></i>
                  <br />
                  {chat.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="ms-1 my-5 me-5 pe-3 text-start">
                  <i className="bi bi-robot"></i> | <br />
                  {chat.content}
                </p>
              );
            }
          })}
      </div>
      <Form
        onSubmit={sendMessage}
        className="mt-5 my-3 px-2 d-flex flex-column justify-content-center align-self-end"
      >
        <div
          className="px-5 py-2 mb-2 d-flex justify-content-between align-items-end"
          style={{ height: "60px" }}
        >
          <i className="bi bi-robot">
            {showSpinner && <Spinner animation="grow" variant="primary" />}
          </i>
          <i className="bi bi-person"></i>
        </div>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message that you want to send to the chatbot to help you brainstorm. Ex: 'I want to write a space western about a lone space cowboy. Can you help me get started?'. Please allow a few seconds for a response after submission."
          />
        </Form.Group>
        <Button size="lg" className="mx-4" type="submit">
          <i class="bi bi-send"></i> Submit Message
        </Button>
        <div className="mt-4 d-flex justify-content-around">
          <Button
            variant="primary mx-1"
            size="lg"
            onClick={() => setSaveChatModal(true)}
          >
            Save Chat
          </Button>
          <Button
            variant="danger mx-1"
            size="lg"
            onClick={() => setShowClearChatModal(true)}
          >
            Clear Chat
          </Button>
        </div>
      </Form>
      <ClearChatModal
        setCurrentChat={setCurrentChat}
        handleClose={clearHandleClose}
        showModal={showClearChatModal}
      />
      <SaveChatModal
        currentChat={currentChat}
        handleClose={handleClose}
        showModal={showSaveChatModal}
      />
    </div>
  );
}
