"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { Order, User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";

export const addUser = async (formData) => {
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    });

    await newUser.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const updateUser = async (formData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      username,
      email,
      password,
      phone,
      address,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await User.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

// export const addProduct = async (formData) => {
//   const { title, desc, price, stock, color, size } =
//     Object.fromEntries(formData);

//   try {
//     connectToDB();

//     const newProduct = new Product({
//       title,
//       desc,
//       price,
//       stock,
//       color,
//       size,
//     });

//     await newProduct.save();
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to create product!");
//   }

//   revalidatePath("/dashboard/products");
//   redirect("/dashboard/products");
// };

// export const updateProduct = async (formData) => {
//   const { id, title, desc, price, stock, color, size } =
//     Object.fromEntries(formData);

//   try {
//     connectToDB();

//     const updateFields = {
//       title,
//       desc,
//       price,
//       stock,
//       color,
//       size,
//     };

//     Object.keys(updateFields).forEach(
//       (key) =>
//         (updateFields[key] === "" || undefined) && delete updateFields[key]
//     );

//     await Product.findByIdAndUpdate(id, updateFields);
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to update product!");
//   }

//   revalidatePath("/dashboard/products");
//   redirect("/dashboard/products");
// };

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/dashboard/products");
};

// export const deleteProduct = async (formData) => {
//   const { id } = Object.fromEntries(formData);

//   try {
//     connectToDB();
//     await Product.findByIdAndDelete(id);
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to delete product!");
//   }

//   revalidatePath("/dashboard/products");
// };

export const authenticate = async (prevState, formData) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { username, password });
  } catch (err) {
    if (err.message.includes("CredentialsSignin")) {
      return "Wrong Credentials";
    }
    throw err;
  }
};

export const insertOrders = async (orders) => {
  try {
    connectToDB();
    await Order.insertMany(orders);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to insert orders!");
  }
};

export const fetchOrders = async () => {
  const headers = {
    "ORDERDESK-STORE-ID": process.env.ORDERDESK_STORE_ID,
    "ORDERDESK-API-KEY": process.env.ORDERDESK_API_KEY,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get("https://app.orderdesk.me/api/v2/orders", {
      headers,
    });
    const data = [];

    for (const order of response.data.orders) {
      for (const item of order.order_items) {
        const temp = {};

        temp.sale_date = order.date_added;
        temp.shipment_date = order.date_updated;
        temp.ship_by_date = order.order_metadata.ship_by_date;
        temp.source_id = order.source_id;
        temp.quantity = item.quantity;
        temp.etsy_listing_id = item.metadata.etsy_listing_id;
        temp.code = item.code;
        temp.personalizations = item.variation_list.Personalization;
        item.variation_list && delete item.variation_list.Personalization;
        temp.variations = JSON.stringify(item.variation_list);
        temp.is_gift = order.checkout_data.is_gift === "yes" ? true : false;
        temp.gift_message = order.checkout_data.gift_message;
        temp.buyer_message = order.checkout_data.buyer_message;
        temp.needs_gift_wrap = order.checkout_data.needs_gift_wrap;
        temp.shipping_method = order.shipping_method;
        temp.buyer = `${order.customer.first_name} ${order.customer.last_name}`;
        temp.ship_name = `${order.shipping.first_name} ${order.shipping.last_name}`;
        temp.ship_address =
          `${order.shipping.company} ${order.shipping.address1} ${order.shipping.address2} ${order.shipping.address3} ${order.shipping.address4} ${order.shipping.city} ${order.shipping.state} ${order.shipping.postal_code} ${order.shipping.country}`.replace(
            / +(?= )/g,
            ""
          );
        temp.ship_city = order.shipping.city;
        temp.ship_state = order.shipping.state;
        temp.ship_country = order.shipping.country;

        data.push(temp);
      }
    }

    await insertOrders(data);
    revalidatePath("/dashboard/orders");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch orders!");
  }
};
