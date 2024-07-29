import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import Row from "react-bootstrap/esm/Row";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  

  return (
    <Row
      style={{
        background: "linear-gradient(to bottom right,#fffff2,#ffbd59)",
        minHeight: "75px",
      }}
    >
      <Col xs={12} className="text-center">
        <h3
          className="my-3"
          style={{
            textShadow: "1px 1px 6px #FAF9F6, 1px 1px 10px #ccc",
            display: "inline-block",
            borderRadius: "10px",
          }}
        >
          Hey {userInfo?.username || ''}, let's create something great today
        </h3>
      </Col>
    </Row>
  );
}
