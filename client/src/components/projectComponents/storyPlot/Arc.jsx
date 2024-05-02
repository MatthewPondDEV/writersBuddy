import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";

export default function Arc() {
  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <h5 className="mt-4 mx-2">Arc</h5>
      <Container>
        <Row className="my-5">
          <Col xs={12}></Col>
        </Row>
      </Container>
    </Col>
  );
}
