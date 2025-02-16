import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OrderProducts = {
  quantity: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: {
      id: number;
      name: string;
      totalRelatedProducts: number;
    };
  };
};
type UpdateOrderProps = {
  name: string;
  quantity?: number;
};

type InitialState = {
  orderProducts: OrderProducts[];
  totalAmount: number;
  payClicked: boolean;
};

const initialState: InitialState = {
  orderProducts: [],
  totalAmount: 0,
  payClicked: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<OrderProducts>) {
      const orderName = action.payload.product.name;
      const existingOrder = state.orderProducts.find(
        (item) => item.product.name === orderName
      );

      if (existingOrder) {
        state.orderProducts.forEach((order) => {
          if (order.product.name === orderName) {
            order.quantity += 1;
            order.subtotal = order.product.price * order.quantity;
          }
        });
      } else {
        state.orderProducts.push({ ...action.payload, quantity: 1 });
      }

      state.totalAmount = state.orderProducts.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      console.log('state', state.orderProducts);
    },
    setQuantity(state, action: PayloadAction<UpdateOrderProps>) {
      const orderName = action.payload.name;

      state.orderProducts.forEach((order) => {
        if (order.product.name === orderName) {
          order.quantity = action.payload.quantity ?? 0;
          order.subtotal = order.product.price * order.quantity;
        }
      });

      state.orderProducts = state.orderProducts.filter(
        (product) => product.quantity !== 0
      );

      state.totalAmount = state.orderProducts.reduce(
        (total, item) => total + item.subtotal,
        0
      );
    },
    deleteOrder(state, action: PayloadAction<UpdateOrderProps>) {
      const orderName = action.payload.name;

      state.orderProducts = state.orderProducts.filter(
        (order) => order.product.name !== orderName
      );
      state.totalAmount = state.orderProducts.reduce(
        (total, item) => total + item.subtotal,
        0
      );
    },
    setPayClicked(state, action: PayloadAction<boolean>) {
      state.payClicked = action.payload;
    },
    resetOrder(state) {
      state.orderProducts = [];
      state.totalAmount = 0;
    },
  },
});

export const { addOrder, setQuantity, deleteOrder, resetOrder, setPayClicked } =
  orderSlice.actions;
export default orderSlice.reducer;
