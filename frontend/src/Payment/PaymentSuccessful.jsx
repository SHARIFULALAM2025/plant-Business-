import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import {useSearchParams} from 'react-router'
const PaymentSuccessful = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    console.log(sessionId)
    useEffect(() => {
        if (sessionId) {
            axios.post(`${import.meta.env.VITE_SERVER}/payment-success`, {
              sessionId,
            })
        }
    }, [sessionId])

    return (
        <div>
            <h1 className="">payment successful </h1>
        </div>
    );
};

export default PaymentSuccessful;