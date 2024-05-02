import logo from '../cssImages/logo.png';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import instagram from '../cssImages/icons/instagram.png'
import facebook from '../cssImages/icons/facebook.png'
import pinterest from '../cssImages/icons/pinterest.png'
import twitter from '../cssImages/icons/twitter.png'
import tiktok from '../cssImages/icons/tiktok.png'


export default function Footer() {

    
    return (
        <footer style={{background:'linear-gradient(to bottom right,#fffff2,#ffbd59)'}}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h3 className='text-center mt-4'>Leave us a message and tell us what you think!</h3>
                        <Form className='pt-2 pb-4 justify-content-space-between'>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email address:</Form.Label>
                                    <Form.Control type="email" placeholder="name@example.com" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Message:</Form.Label>
                                <Form.Control as="textarea" rows={3} />
                            </Form.Group>
                            <Button variant="primary w-100" type="submit">
                                Submit
                            </Button>
                         </Form>
                    </Col>
                    <Col className='text-center' id='foot-icons'> 
                        <Image src={instagram} className='m-4 mb-5' width='7%' />
                        <Image src={facebook} className='m-4 mb-5' width='7%' />
                        <Image src={pinterest} className='m-4 mb-5' width='7%' />
                        <Image src={twitter} className='m-4 mb-5' width='7%' />
                        <Image src={tiktok} className='m-4 mb-5' width='7%' />
                    </Col>
                </Row>
                <Row id='foot-logo'>
                    <Col className='text-center'>
                        <Image src={logo} width='60px' className='py-2 my-3' rounded />
                        
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}