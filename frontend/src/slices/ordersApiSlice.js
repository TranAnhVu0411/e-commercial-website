import { ORDER_URL, PAYPAL_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDER_URL,
                method: 'POST',
                body: {...order}
            }),
            keepUnusedDataFor: 5
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDER_URL}/${orderId}`
            }),
            keepUnusedDataFor: 5
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDER_URL}/${orderId}/paid`,
                method: 'PUT',
                body: { ...details }
            })
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL
            }),
            keepUnusedDataFor: 5
        }),
        getMyOrder: builder.query({
            query: () => ({
                url: `${ORDER_URL}/mine`
            }),
            keepUnusedDataFor: 5
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDER_URL
            }),
            keepUnusedDataFor: 5
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDER_URL}/${orderId}/delivered`,
                method: 'PUT',
            })
        }),
    })
})

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useGetMyOrderQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation
} = ordersApiSlice;