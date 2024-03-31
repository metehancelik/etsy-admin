import Image from "next/image";
import Link from "next/link";
import styles from "@/app/ui/dashboard/orders/orders.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import { getOrders } from "@/app/lib/data";
import { fetchOrders } from "@/app/lib/actions";
// import { deleteProduct } from "@/app/lib/actions";

const OrdersPage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, orders } = await getOrders(q, page);

  console.log(orders[0].sale_date.toLocaleString());

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for an order..." />
        <form action={fetchOrders}>
          <button className={styles.addButton}>Fetch Orders</button>
        </form>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Shop Name</td>
            <td>Sale Date</td>
            <td>Shipment Date</td>
            <td>Delivery Date</td>
            <td>Order ID</td>
            <td>Quantity</td>
            <td>Listing ID</td>
            <td>SKU</td>
            <td>Variations</td>
            <td>Personalizations</td>
            <td>Marked as Gift</td>
            <td>Gift Message</td>
            <td>Gift Wrap</td>
            <td>Shipping Method</td>
            <td>Buyer</td>
            <td>Ship Name</td>
            <td>Ship Address</td>
            <td>Ship City</td>
            <td>Ship State</td>
            <td>Ship Country</td>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <div className={styles.order}>
                  <Image
                    src={order.img || "/noproduct.jpg"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.productImage}
                  />
                  {order.store_name}
                </div>
              </td>
              <td>{order.sale_date.toLocaleString()}</td>
              <td>{order.shipment_date.toLocaleString()}</td>
              <td>{order.ship_by_date.toLocaleString()}</td>
              <td>{order.source_id}</td>
              <td>{order.quantity}</td>
              <td>{order.etsy_listing_id}</td>
              <td>{order.code}</td>
              <td>{order.variations}</td>
              <td>{order.personalizations}</td>
              <td>{order.is_gift ? "Yes" : "No"}</td>
              <td>{order.gift_message}</td>
              <td>{order.buyer_message}</td>
              <td>{order.needs_gift_wrap ? "Yes" : "No"}</td>
              <td>{order.shipping_method}</td>
              <td>{order.buyer}</td>
              <td>{order.ship_name}</td>
              <td>{order.ship_adress}</td>
              <td>{order.ship_city}</td>
              <td>{order.ship_state}</td>
              <td>{order.ship_country}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  {/* <form action={deleteProduct}> */}
                  <form>
                    <input type="hidden" name="id" value={order.id} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default OrdersPage;
