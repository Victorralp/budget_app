import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Product, Order } from '@/types';

export const productsCollection = collection(db, 'products');
export const ordersCollection = collection(db, 'orders');
export const usersCollection = collection(db, 'users');

export const getProducts = async (constraints?: QueryConstraint[]) => {
  try {
    const q = constraints
      ? query(productsCollection, ...constraints)
      : productsCollection;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const getProduct = async (id: string) => {
  try {
    const docRef = doc(productsCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

export const createOrder = async (orderData: Omit<Order, 'id'>) => {
  try {
    const docRef = await addDoc(ordersCollection, orderData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const q = query(
      ordersCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};
