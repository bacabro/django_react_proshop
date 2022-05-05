import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Col} from 'react-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import FormContainer from '../FormContainer'
import CheckOutSteps from '../CheckOutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../../actions/cartActions'

function PaymentScreen({history}) {
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('Paypal')


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    useEffect(() => {
        if (!shippingAddress.address) {
            history.push('/shipping')
        }
    }, [])

  return (
    <FormContainer>
    <CheckOutSteps step1 step2 step3/>

    <Form onSubmit={submitHandler}>
    <Form.Group>
        <Form.Label as='legend'>
            Select Method
        </Form.Label>
        <Col>
            <Form.Check 
            type='radio'
            label='Paypal or Credit Card'
            id='paypal'
            name='paymentMethod'
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
        </Col>
    </Form.Group>
    <Button type='submit' variant='primary'>Continue</Button>
    </Form>

    </FormContainer>
  )
}

export default PaymentScreen