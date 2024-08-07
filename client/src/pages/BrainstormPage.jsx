import { useState } from "react";
import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BrainstormChatBot from "../components/brainstormComponents/BrainstormChatBot";

export default function BrainstormPage() {

    return (
        <>
        <Container fluid>
            <Header />
            <Row id='brainstorm-background'>
                <Sidebar />
                <Col xs={12} xxl={10}>
                <h1 className='m-5 text-center' >Let's Brainstorm</h1>
                <p className='my-3 text-center'>Use the chatbot to help break yourself out of writer's block, or to help start your next story.</p>
                <div className='d-flex justify-content-center'>
                    <BrainstormChatBot />
                </div>
                </Col>
            </Row>
        </Container>
        </>
    )
}