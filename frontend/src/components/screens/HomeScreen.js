import React, {useState, useEffect} from 'react'
import {Row, Col} from 'react-bootstrap'
import Product from '../Product'
import Loader from '../Loader'
import Message from '../Message'
import Paginate from '../Paginate'

import { useDispatch, useSelector} from 'react-redux'

import { listProducts } from '../../actions/productActions'

import ProductCarousel from '../ProductCarousel'

//import products from '../../products'
//import axios from 'axios'

const HomeScreen = ({history}) => {
    //const [products, setProducts] = useState([]);
    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)

    const {error, loading, products, page, pages} = productList

    let keyword = history.location.search 
    //console.log(keyword)
    useEffect(() => {
        dispatch(listProducts(keyword))
    },[dispatch, keyword])

    //const products = []
    return (
        <div>
            {!keyword && <ProductCarousel />}

            <h1>Latest Products</h1>
            {loading ? <Loader/>
            : error ? <Message variant='danger'>{error}</Message>
            :
            <div className='container'>
            <Row>
                {products.map((item, index) =>
                <Col sm={12} md={6} lg={4} xl={3} key={index}>
                    <Product product={item} />
                </Col>
                )}
            </Row>
            <Paginate page={page} pages={pages} keyword={keyword}/>
            </div>

        }
        </div>
    )
}

export default HomeScreen; 