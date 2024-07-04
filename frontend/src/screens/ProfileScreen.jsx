import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { useGetMyOrderQuery } from '../slices/ordersApiSlice'

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfle, { isLoading: loadingUpdateProfile }] = useProfileMutation(); 
    const { data: orders, isLoading, error } = useGetMyOrderQuery();

    console.log('orders', orders);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo, userInfo.name, userInfo.email]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password do not match')
        } else {
            try {
                const res = await updateProfle({ _id: userInfo._id, name, email, password }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully')
            } catch (error) {
                toast.error(error?.data?.message || error.error)                
            }
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className="my-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter your name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className="my-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password' className="my-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter your password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='confirmPassword' className="my-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter your confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-2">
                        Update
                    </Button>
                    { loadingUpdateProfile && <Loader />}
                </Form>
            </Col>
            <Col md={9}>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <Table striped hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.createdAt}</td>
                                            <td>{order.totalPrice}</td>
                                            <td>
                                                {order.isPaid ? (
                                                    order.paidAt
                                                ) : (
                                                    <FaTimes style={{color:'red'}} />    
                                                )}
                                            </td>
                                            <td>
                                                {order.isDelivered ? (
                                                    order.deliveredAt
                                                ) : (
                                                    <FaTimes style={{color:'red'}} />    
                                                )}
                                            </td>
                                            <td>
                                                <Button
                                                    as={Link}
                                                    to={`/order/${order._id}`}
                                                    className='btn-sm'
                                                    variant='light'
                                                >
                                                    Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen