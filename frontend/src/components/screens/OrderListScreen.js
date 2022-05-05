import React, {useEffect, useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table , Button} from 'react-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import FormContainer from '../FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { listOrders } from '../../actions/orderActions'

function OrderListScreen({history}) {
    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const {loading, error, orders} = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        }
        else {
            history.push('/login')
        }

    },[dispatch, history, , userInfo])


    const deleteHandler = (id) => {
         if (window.confirm('Are you sure you want to delete this user?')){
             //dispatch(deleteUser(id));
         }
        //dispatch(deleteUser(id));
    }

  return (
    <div>
        <h1>Orders</h1>
        {loading ? 
        <Loader /> :
        error ? <Message variant={'danger'}>{error}</Message> :
        (
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <th>ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                    {orders && orders.map((order) => 
                    <tr key={order._id}>

                        <td>{order._id}</td>
                        <td>{order.user && order.users.name}</td>
                        <td>{order.createdAt.substring(0,10)}</td>
                        <td>${order.totalPrice}</td>
                        <td>{order.isPaid ? (
                            order.paidAt.substring(0,10))
                         : (<i className='fas fa-check' style={{color: 'red'}}></i>)
                        }</td>

                    <td>{order.isDelivered ? (
                            order.deliveredAt.substring(0,10))
                         : (<i className='fas fa-check' style={{color: 'red'}}></i>)
                    }</td>
                    <td>
                        <LinkContainer to={`/order/${order._id}`}>
                            <Button variant='light' className='btn-sm'>
                                Details
                            </Button>
                        </LinkContainer>

                        {/* <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(order._id)}>
                            <i className='fas fa-trash'/>
                            </Button> */}
                    </td>
                    </tr>
                    )}
                </tbody>

            </Table>
        )}
    </div>
  )
}

export default OrderListScreen