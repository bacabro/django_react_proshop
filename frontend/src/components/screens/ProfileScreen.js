import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../../actions/userAction'
import { USER_LOGIN_SUCCESS, USER_UPDATE_PROFILE_RESET } from '../../constants/userConstant'
import { listMyOrders } from '../../actions/orderActions'

function ProfileScreen({ location, history }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPasword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()



  const userDetails = useSelector(state => state.userDetails)
  const { loading, user, error } = userDetails


  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin


  const userUpdateProfile = useSelector(state => state.userUpdateProfile)
  const { success } = userUpdateProfile


  const orderListMy = useSelector(state => state.orderListMy)
  const { loading : loaddingMy, orders, error: errorMy } = orderListMy


  useEffect(() => {
      //dispatch()
      if (!userInfo) {
        history.push('/login')
      }
      else {
        if (!user || !user.name || success || userInfo._id !== user._id) {
          dispatch({ type: USER_UPDATE_PROFILE_RESET})
          dispatch(getUserDetails('profile'))
          dispatch(listMyOrders())
        } else {
          setName(user.name)
          setEmail(user.email)
        }
      }
   
  }, [dispatch, history, userInfo, user, success])



  const submitHandler = (e) => {
    e.preventDefault()
    //console.log('Submited')
    if (password !== confirmPasword) {
        setMessage('Password do not match')
    }
    else {
        //dispatch(getUserDetails(name, email, password))
        dispatch(updateUserProfile({
          'id': user._id,
          'name': name,
          'email': email,
          'password': password
        }))
    }
    //dispatch(register(name, email, password))
    setMessage('')
}


  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>

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
    type='password'
    placeholder='Enter Password'
    value={password}
    onChange={(e) => setPassword(e.target.value)}>
    
    </Form.Control>
    </Form.Group>

    <Form.Group controlId='passwordConfirm'>
    <Form.Label>Confirm Password</Form.Label>
    <Form.Control 
    type='password'
    placeholder='Enter Password'
    value={confirmPasword}
    onChange={(e) => setConfirmPassword(e.target.value)}>
    
    </Form.Control>
    </Form.Group>


    <Button type='submit' variant='primary'>Update</Button>

    </Form>

        </Col>

        <Col md={9}>
            <h2>My Orders</h2>
            {loaddingMy ? (
              <Loader />
            ): errorMy ? (
              <Message variant={'danger'}>{error}</Message>
            ) : 
            (<Table striped responsive className='table-sm'>
              <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
                {orders.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.createdAt.substring(0,10)}</td>
                    <td>${item.totalPrice}</td>
                    <td>{item.isPaid ? item.paitAt.substring(0,10) : (<i className='fas fa-times' style={{color: 'red'}}></i> )}</td>
                    <td>
                      <LinkContainer to={`/order/${item._id}`}>
                        <Button className='btn-sm'>Details</Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>

            </Table>)
            
            }
        </Col>

    </Row>
  )
}

export default ProfileScreen