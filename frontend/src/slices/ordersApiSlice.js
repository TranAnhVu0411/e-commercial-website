import { ORDER_URL } from '../constants';
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
        })
    })
})

export const { useCreateOrderMutation, useGetOrderDetailsQuery } = ordersApiSlice;