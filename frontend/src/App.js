//import logo from './logo.svg';
import './App.css';
import Header from './components/Header' 
import Footer from './components/Footer' 
import {
  HomeScreen, 
  ProductScreen, 
  CartScreen, 
  LoginScreen, 
  RegisterScreen, 
  ProfileScreen,
  ShippingScreen,
  PaymentScreen,
  PlaceOrderScreen,
  OrderScreen,
  UserListScreen,
  EditUserScreen,
  ProductListScreen,
  ProductEditScreen,
  OrderListScreen,
} from './components/screens'
//import HomeScreen from './components/screens/HomeScreen'
import { Container } from 'react-bootstrap';
import {BrowserRouter as Router, Route} from 'react-router-dom'

function App() {
  //The question mark there make it opcional, example component cart you can click on cart without the qty
  return (
    <Router>
    <Header/>
    <main className="py-3">
    <Container>
    <Route path='/' component={HomeScreen} exact/>
    <Route path='/login' component={LoginScreen}/>
    <Route path='/register' component={RegisterScreen}/>
    <Route path='/profile' component={ProfileScreen}/>
    <Route path='/shipping' component={ShippingScreen}/>
    <Route path='/payment' component={PaymentScreen}/>
    <Route path='/placeorder' component={PlaceOrderScreen}/>
    <Route path='/product/:id' component={ProductScreen}/>
    <Route path='/cart/:id?' component={CartScreen}/>
    <Route path='/order/:id' component={OrderScreen}/>

    <Route path='/admin/userlist' component={UserListScreen}/>
    <Route path='/admin/user/:id/edit' component={EditUserScreen}/>
    <Route path='/admin/productlist' component={ProductListScreen}/>
    <Route path='/admin/product/:id/edit' component={ProductEditScreen}/>
    <Route path='/admin/orderlist' component={OrderListScreen}/>
    </Container>
    </main>
    <Footer/>


    </Router>
  );
}

export default App;
