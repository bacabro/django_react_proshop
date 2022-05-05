import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button} from 'react-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import FormContainer from '../FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUser } from '../../actions/userAction'

import { USER_UPDATE_RESET } from '../../constants/userConstant'

function EditUserScreen({ match, history}) {

    const [email, setEmail] = useState('')
    const [isAdmin, setAdmin] = useState(false)
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const userId = match.params.id

    //const redirect = location.search ? location.search.split('=')[1] : '/'


    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user} = userDetails


    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success} = userUpdate


    useEffect(() => {

        if (success){
            dispatch({type: USER_UPDATE_RESET})
            history.push('/admin/userlist')
        }else {
            if (!user.name  || user._id !== Number(userId)) {
                dispatch(getUserDetails(userId))
            }
            else {
                setName(user.name)
                setEmail(user.email)
                setAdmin(user.isAdmin)
            }
        }

    }, [dispatch, user, userId, success, history])


const submitHandler = (e) => {
    e.preventDefault()

    dispatch(updateUser({ _id: user._id, name, email, isAdmin }))
    //console.log('Submited')
}

  return (
      <div>
          <Link to='/admin/userlist'>Go back</Link>
    <FormContainer>
        <h1>Edit User</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {message && <Message variant='danger'>{message}</Message>}

        {loadingUpdate && <Loader/>}

        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

        {loading && <Loader/>}

            <Form onSubmit={submitHandler}>
                 
            <Form.Group controlId='Name'>
            <Form.Label>Name</Form.Label>
            <Form.Control 
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

            <Form.Group controlId='isadmin'>
            <Form.Label>Email Address</Form.Label>
            <Form.Check
            type='checkbox'
            label='Is admin'
            checked={isAdmin}
            onChange={(e) => setAdmin(e.target.checked)}>    
            </Form.Check>
            </Form.Group>
            <Button type='submit' variant='primary'>Update</Button>

            </Form>
    </FormContainer>   
    </div> 
  )
}

export default EditUserScreen