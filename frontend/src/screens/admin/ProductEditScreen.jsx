import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import FormContainer from '../../components/FormContainer'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { useUpdateProductMutation, useGetProductDetailsQuery } from '../../slices/productsApiSlice'

const ProductEditScreen = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [category, setCategory] = useState('');

    const navigate = useNavigate();
    const { id: productId } = useParams();
    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation()
    
    useEffect(() => {
        if (product) {
            setName(product.name)
            setPrice(product.price)
            setDescription(product.description)
            setBrand(product.brand)
            setImage(product.image)
            setCountInStock(product.countInStock) 
            setCategory(product.category)
        }
    }, [product])

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }
        const result = await updateProduct(updatedProduct).unwrap();
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Product updated');
            refetch();
            navigate('/admin/productlist');
        }
    }

    return (
        <>
            <Link to="/admin/productlist" className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {
                    isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name' className='my-2'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='price' className='my-2'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            {/*IMAGE INPUT PLACEHOLDER*/}
                            <Form.Group controlId='description' className='my-2'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type=''
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='category' className='my-2'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='brand' className='my-2'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter brand'
                                    value={category}
                                    onChange={(e) => setBrand(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='countInStock' className='my-2'>
                                <Form.Label>Count In Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter count in stock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Button
                                type="submit"
                                variant="primary"
                                className="my-2"
                            >
                                Update
                            </Button>
                        </Form>
                    )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen