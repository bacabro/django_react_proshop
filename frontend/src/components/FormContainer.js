import React, { Children } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
//import { connect } from 'react-redux'


function FormContainer({ children }) {
    return (
        <Container>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    {children}
                </Col>
            </Row>
        </Container>
    )

}
export default FormContainer