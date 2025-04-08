import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import getPastOrders from '../api/getPastOrders';

export const Route = createLazyFileRoute('/past')({
  component: PastOrdersRoute,
});

function PastOrdersRoute () {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['past-orders', page], // unique key for the query
    // this will cause the query to refetch when the page changes
    // and the data will be cached for 30 seconds
    // before being marked as stale
    // this is useful for pagination
    // and prevents unnecessary network requests
    // when the user is navigating through pages
    // and the data is still fresh
    queryFn: () => getPastOrders(page), // fetching function 
    staleTime: 30000 //
  });
  if (isLoading) {
    return (
        <div className="past-orders">
            <h2>Loading...</h2>
        </div>);
  }

  return (
    <div className="past-orders">
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Order Time</th>
                </tr>
            </thead>
            <tbody>
                {data.map((order) => (
                    <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>{order.date}</td>
                        <td>{order.time}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="pages">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
            </button>
            <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
                Next
            </button>
        </div>
    </div>
  )
}
