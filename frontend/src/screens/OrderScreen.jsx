import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from '../slices/ordersApiSlice'

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    }
                });
            }
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

    function onApprove(data, actions) { 
        return actions.order.capture().then(async function (details) { 
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success('Payment successful')
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        });
    }
    async function onApproveTest() { 
        await payOrder({ orderId, details: { payer: {}} });
        refetch();
        toast.success('Payment successful')
    }
    function onError(err) { 
        toast.error(err.message)
    }
    function createOrder(data, actions) { 
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    }
                }
            ]
        }).then((orderId) => {
            return orderId
        })
    }
    
    return isLoading ? (
        <Loader />
    ) : error ? (
            <Message variant='danger' />
    ) : (
                <>
                    <h1>Order {order._id}</h1>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p>
                                        <strong>Name: </strong>{order.user.name}
                                    </p>
                                    <p>
                                        <strong>Email: </strong>{order.user.email}
                                    </p>
                                    <p>
                                        <strong>Address: </strong>
                                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                        {order.shippingAddress.postalCode},{' '}
                                        {order.shippingAddress.country}
                                    </p>
                                    {order.isDelivered ? (
                                        <Message variant='success'>
                                            Delivered on {order.deliveredAt}
                                        </Message>
                                    ) : (
                                        <Message variant='danger'>
                                            Not delivered
                                        </Message>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>{order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Message variant='success'>
                                            Paid on {order.paidAt}
                                        </Message>
                                    ) : (
                                        <Message variant='danger'>
                                            Not paid
                                        </Message>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item._id}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = $
                                                    {(item.qty * (item.price * 100)) / 100}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Shipping</Col>
                                            <Col>${order.shippingPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Tax</Col>
                                            <Col>${order.taxPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>${order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    
                                    {!order.isPaid && (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            {isPending ? <Loader /> : (
                                                <div>
                                                    {/* <Button
                                                        onClick={onApproveTest}
                                                        style={{ marginBottom: '10px' }}
                                                    >
                                                        Test Pay Order
                                                    </Button> */}
                                                    <div>
                                                    <PayPalButtons
                                                        createOrder={ createOrder }
                                                        onApprove={ onApprove }
                                                        onError={ onError }
                                                    ></PayPalButtons>
                                                    </div>
                                                </div>
                                            )}

                                        </ListGroup.Item>
                                    )}
                                    {/* MARK AS DELIVERED PLACEHOLDER */}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
    )
}

export default OrderScreen