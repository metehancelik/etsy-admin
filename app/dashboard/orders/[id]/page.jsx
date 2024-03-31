// import { updateProduct } from "@/app/lib/actions";
import { getOrder } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/products/singleProduct/singleProduct.module.css";
import Image from "next/image";

const SingleOrderPage = async ({ params }) => {
  const { id } = params;
  const order = await getOrder(id);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src="/noavatar.png" alt="" fill />
        </div>
        {order.title}
      </div>
      <div className={styles.formContainer}>
        {/* <form action={updateProduct} className={styles.form}> */}
        <form className={styles.form}>
          <input type="hidden" name="id" value={order.id} />
          <label>Title</label>
          <input type="text" name="title" placeholder={order.title} />
          <label>Price</label>
          <input type="number" name="price" placeholder={order.price} />
          <label>Stock</label>
          <input type="number" name="stock" placeholder={order.stock} />
          <label>Color</label>
          <input
            type="text"
            name="color"
            placeholder={order.color || "color"}
          />
          <label>Size</label>
          <textarea
            type="text"
            name="size"
            placeholder={order.size || "size"}
          />
          <label>Cat</label>
          <select name="cat" id="cat">
            <option value="kitchen">Kitchen</option>
            <option value="computers">Computers</option>
          </select>
          <label>Description</label>
          <textarea
            name="desc"
            id="desc"
            rows="10"
            placeholder={order.desc}
          ></textarea>
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleOrderPage;
