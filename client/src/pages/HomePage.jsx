import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Explore from '../components/Explore';

export default function HomePage() {
    
    return (
        <Container fluid>
        <Header />
        <Row>
            <Sidebar />
            <Explore />

        </Row>
        </Container>
    )

}