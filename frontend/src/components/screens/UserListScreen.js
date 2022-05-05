import React, {useEffect, useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table , Button} from 'react-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import FormContainer from '../FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { getUserList, deleteUser } from '../../actions/userAction'


function UserListScreen({history}) {

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const {loading, error, users} = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete, error: errorDelete } = userDelete

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(getUserList())
        }
        else {
            history.push('/login')
        }

    },[dispatch, history, successDelete, userInfo])


    const deleteHandler = (id) => {
         if (window.confirm('Are you sure you want to delete this user?')){
             dispatch(deleteUser(id));
         }
        //dispatch(deleteUser(id));
    }

  return (
    <div>
        <h1>Users</h1>
        {loading ? 
        <Loader /> :
        error ? <Message variant={'danger'}>{error}</Message> :
        (
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <th>ID</th>
                    <th>Name</th>
                    <th>E-mail</th>
                    <th>Admin</th>
                    <th></th>
                </thead>
                <tbody>
                    {users && users.map((user) => 
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.isAdmin ? (
                            <i className='fas fa-check' style={{color: 'green'}}></i>)
                         : (<i className='fas fa-check' style={{color: 'red'}}></i>)
                    }</td>
                    <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                            </Button>
                        </LinkContainer>

                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                            <i className='fas fa-trash'/>
                            </Button>
                    </td>
                    </tr>
                    )}
                </tbody>

            </Table>
        )}
    </div>
  )
}

export default UserListScreen