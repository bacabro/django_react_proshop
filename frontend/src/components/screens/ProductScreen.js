import React , {useState, useEffect}from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form} from 'react-bootstrap'
import Rating from '../Rating'
import Loader from '../Loader'
import Message from '../Message'
import products from '../../products'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import { listProductDetails, createProductReview } from '../../actions/productActions'

import { PRODUCT_CREATE_REVIEW_RESET } from '../../constants/productConstants'

const ProductScreen = ({ match, history }) => {
   // const product = products.find((p) => p._id === match.params.id)
   //npm install redux react-redux redux-thunk redux-devtools-extension
   //const [product, setProduct] = useState([]);
   const [qty, setQty] = useState(1);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');


   const dispatch = useDispatch()


   const productDetails = useSelector(state => state.productDetails)
   const { loading, error, product } = productDetails //Destructure to get the data

   const userLogin = useSelector(state => state.userLogin)
   const { userInfo } = userLogin //Destructure to get the data

   const productReviewCreate = useSelector(state => state.productReviewCreate)
   const { loading: loadingCreateReview, error: errorCreateReview, success: successCreateReview} = productReviewCreate //Destructure to get the data

    useEffect(() => {
        //loadProducts();
        //console.log(match.params.id)
        if (successCreateReview){
            setRating(0)
            setComment('')
            dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
        }

        dispatch(listProductDetails(match.params.id))

    },[dispatch, match, successCreateReview])

    const loadProducts = async () => {
        await axios.get(`/api/products/${match.params.id}`)
        .then(response =>{
           // setProduct(response.data)
        } 
            )
    }

    const addToCarthandler = () => {
        //console.log('Added to cart', qty);
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            match.params.id, {
                rating,
                comment
            }
        ))
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ? 
                <Loader />
                :  error
                    ? <Message variant='danger'>{error}</Message> 
                :
        (
            <div>
            <Row>
            <Col md={6}>
               <Image src={product.image} alt={product.name} fluid /> 
            </Col>
            <Col md={3}>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                   <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                </ListGroup.Item>

                <ListGroup.Item>
                    Price : ${product.price}
                </ListGroup.Item>

                <ListGroup.Item>
                    Description : {product.description}
                </ListGroup.Item>
            </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col>Price : </Col>
                                <Col>
                                 <strong>${product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>

                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col>Status </Col>
                                <Col>
                                <strong><b>
                                {product.countInStock > 0 ? 'In Stock': 'Out of Stock'}
                                 </b></strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>

                    {product.countInStock > 0 && (
                        <ListGroup.Item>
                            <Row>
                                <Col>Qty</Col>
                                <Col xs='auto' className='my-1'>
                                <Form.Control
                                 as="select"
                                 value={qty}
                                 onChange={(e) => setQty(e.target.value)}
                                >
                                {
                                    [...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))
                                }
                                </Form.Control>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )}

                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Button 
                            onClick={addToCarthandler}
                            className='btn-clock' 
                            type='button' 
                            disabled={product.countInStock > 0 ? false : true } 
                            >Add to Cart</Button>
                        </ListGroup.Item>
                    </ListGroup>

                </Card>
            </Col>
        </Row>

        <Row>
            <Col md={6}>
                <h4>Reviews</h4>
                {product.reviews.length === 0 && <Message variant={'info'}>No Reviews</Message>}

                <ListGroup variant='flush'>
                    {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} color='#f8e825'/>
                        <p>{review.createdAt}</p>
                        <p>{review.comment}</p>
                    </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                        <h4>Write a review</h4>

                        {loadingCreateReview && <Loader/>}
                        {successCreateReview && <Message variant={'success'}>Review Submited</Message> }

                        {errorCreateReview && <Message variant={'danger'}>{errorCreateReview}</Message>}
                        {userInfo ? (
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='rating'>
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                    as={'select'}
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    >
                                    <option value={''}>Select...</option>
                                    <option value={'1'}>1 - Poor</option>
                                    <option value={'2'}>2 - Fair</option>
                                    <option value={'3'}>3 - Good</option>
                                    <option value={'4'}>4 - Very Good</option>
                                    <option value={'5'}>5 - Excelent</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId='comment'>
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                    as={'textarea'}
                                    row='5'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    >
                                    </Form.Control>
                                <Button 
                                disabled={loadingCreateReview}
                                type='submit'
                                >Submit</Button>
                                </Form.Group>
                            </Form>
                        ): (
                            <Message variant={'info'}>Please <Link to={'/login'}>login </Link>to write a review</Message>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>

        </div>
        )
        }
          
        </div>
    )

}

export default ProductScreen