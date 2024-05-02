import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import { useState } from "react"

export default function SettingGeneral({projectInfo, setViewNumber}) {
    const [setting, setSetting] = useState({})
    const [loadData, setLoadData] = useState(false)

    function startLoad() {
    const t = setTimeout(() => {
        if(!loadData && projectInfo.title) {
            setSetting(projectInfo.setting)
            setLoadData(true)
        }
    }, 200)

    if (loadData) {
        clearTimeout(t)
    }
    }
    startLoad()

    return (
        <Col id='papyrus' xs={12} xxl={9}>
            <Container>
                <Row className='my-5'>
                    <h1 className='text-center'>Setting</h1>
                    <Col className='my-5'>
                        <p className='my-4 mt-5'>Time Period: {setting.timePeriod}</p>
                        <p className='my-4'>General Location: {setting.location}</p>
                        <p className='my-4'>Description: {setting.description}</p>
                    </Col>
                    <Button size='lg' onClick={() => {setViewNumber('3')}}>Edit General Setting</Button>
                </Row>
            </Container>
        </Col>

    )
}