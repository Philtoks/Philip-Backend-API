import express from 'express';
import {getAllProducts, getOneProduct, createProducts, updateProducts, deleteProducts} from '../controllers/users.js';
const router = express.Router();

router.get('/', getAllProducts);

router.post('/', createProducts);

router.put('/:ID', updateProducts);

router.delete('/:ID', deleteProducts);

router.get('/:ID', getOneProduct);

export default router;
