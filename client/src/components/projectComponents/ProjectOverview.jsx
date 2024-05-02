import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

export default function ProjectOverview({projectInfo, setViewNumber}) {
    
    
    return (
        <Col id='papyrus' xs={12} xxl={9}>
            <Container>
                <Row className='my-5'>
                    <h1 className='mt-3 text-center'>Project Overview</h1>
                    <Col xs={12} className='mt-5 pt-2'>
                            <h1 className='mt-5'>{projectInfo.title}</h1>
                            <h2 className='mt-2'><i>by</i> {projectInfo.author}</h2>
                            <h2 className='mt-4'>genre: {projectInfo.genre}</h2>
                    </Col>
                    <Col xs={12} className='my-5 pt-2'>
                        <p className='my-5 text-center'>{projectInfo.summary}</p>
                    </Col>
                    <Button size='lg' onClick={() => {setViewNumber('0')}}>Edit Project Overview</Button>
                </Row>
            </Container>
        </Col>
    )
}