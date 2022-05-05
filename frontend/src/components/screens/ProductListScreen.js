import React, {useEffect, useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table , Button, Row, Col} from 'react-bootstrap'
import Loader from '../Loader'
import Message from '../Message'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct, createProduct } from '../../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../../constants/productConstants'
import Paginate from '../Paginate'

function ProductListScreen({history, match}) {

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const {loading, error, products, pages, page } = productList

    //We aare adding this because after a delete, we want the useEffect to load the list again, this will trigger it
    const productDelete = useSelector(state => state.productDelete)
    const {loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete


    const productCreate = useSelector(state => state.productCreate)
    const {loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    let keyword = history.location.search

    useEffect(() => {
        dispatch({type: PRODUCT_CREATE_RESET})

        if (userInfo && !userInfo.isAdmin) {
            //dispatch(listProducts())
            history.push('/login')
        }
        
        if (successCreate){
            history.push(`/admin/product/${createdProduct._id}/edit`)
        }else {
            dispatch(listProducts(keyword))
        }

    },[dispatch, history, userInfo, successDelete, successCreate, createdProduct, keyword])


    const deleteHandler = (id) => {
         if (window.confirm('Are you sure you want to delete this product?')){
             dispatch(deleteProduct(id));
         }
    }

    const createProductHandler = (product) => {
        //Create product

    }

  return (
    <div>
        <Row className='align-items-center'>
            <Col>
            <h1>Products</h1>
            </Col>
            <Col className='text-right'>
            <Button className='my-3' onClick={createProductHandler}> 
            <i className='fas fa-plus'></i> Create Product
            </Button>
            </Col>
        </Row>
        {/* <h1>Products</h1> */}
        {loadingDelete &&  <Loader /> }
        {errorDelete && <Message variant={'danger'}>{errorDelete}</Message>}


        {loadingCreate &&  <Loader /> }
        {errorCreate && <Message variant={'danger'}>{errorCreate}</Message>}

        {loading ? 
        <Loader /> :
        error ? <Message variant={'danger'}>{error}</Message> :
        (
            <div>
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th></th>
                </thead>
                <tbody>
                    {products && products.map((product) => 
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                    <td>
                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                            <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                            </Button>
                        </LinkContainer>

                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                            <i className='fas fa-trash'/>
                            </Button>
                    </td>
                    </tr>
                    )}
                </tbody>

            </Table>
            <Paginate pages={pages} page={page} isAdmin={true}/>
            </div>
        )}
    </div>
  )
}

export default ProductListScreen