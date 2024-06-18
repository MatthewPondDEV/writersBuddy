import { useState } from "react";
import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function BrainstormPage() {

    return (
        <>
        <Container fluid>
            <Header />
            <Row id='brainstorm-background'>
                <Sidebar />
                <Col xs={12} xxl={10}>
                    <h1 className='m-5 text-center' >Let's Brainstorm</h1>
                    
                </Col>
            </Row>
        </Container>
        </>
    )
}