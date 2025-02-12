import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        })
    }, []);

    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td >{(new Date(order.createdAt)).toLocaleString()}</td>
                            <>{order.paid ? 'YES' : 'NO'}</>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.name} {order.email}<br />
                                {order.city} {order.postalCode} {order.country}<br />
                                {order.streetAddress}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <div key={l._id}>
                                        {l.price_data?.product_data.name} x
                                        {l.quantity}<br />
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}