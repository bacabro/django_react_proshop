import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import FormContainer from '../FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../actions/userAction'

function RegisterScreen({location, history}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPasword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/'


    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo} = userRegister


    useEffect(() => {
        //dispatch()
       if (userInfo) {
           history.push(redirect)
       }
    }, [history, userInfo, redirect])


const submitHandler = (e) => {
    e.preventDefault()
    //console.log('Submited')
    if (password !== confirmPasword) {
        setMessage('Password do not match')
    }
    else {
        dispatch(register(name, email, password))
    }
    //dispatch(register(name, email, password))
}

  return (
    <FormContainer>
            <h1>Sign Up</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {message && <Message variant='danger'>{message}</Message>}

        {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
                 
            <Form.Group controlId='Name'>
            <Form.Label>Name</Form.Label>
            <Form.Control 
            required
            type='name'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}>    
            </Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
            required
            type='email'
            placeholder='Enter E-mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}>    
            </Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
            required
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
            
            </Form.Control>
            </Form.Group>

            <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
            required
            type='password'
            placeholder='Enter Password'
            value={confirmPasword}
            onChange={(e) => setConfirmPassword(e.target.value)}>
            
            </Form.Control>
            </Form.Group>


            <Button type='submit' variant='primary'>Sign up</Button>

            <Row className='py-3'>
                {/* <Col>New Customer? <Link to={'/register'}>Register</Link></Col> */}
                <Col>Already Registered? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in</Link></Col>

            </Row>

            </Form>
    </FormContainer>    
  )
}

export default RegisterScreen