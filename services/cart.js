const Cart = require('../models/cart');
const Product = require('../models/products');

const addCartService = async (productId, userId, quantity) => {
    try {
        if (!productId || !userId || !quantity) {
            throw new Error('Missing details');
        }

        const exists = await Cart.findOne({ where: { productId, userId } });

        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            throw new Error('Product not found');
        }

        if (exists) {
            const cartQuatity = exists.quantity + quantity;
            await Cart.update({ quantity: cartQuatity }, { where: { productId, userId } });

            // Calculate new product quantity and sales count
            const newQuantity = product.quantity - quantity;
            const newSalesCount = product.salesCount + quantity;

            await Product.update({
                quantity: newQuantity,
                salesCount: newSalesCount
            }, { where: { id: productId } });

            return { message: 'Cart successfully updated!' };
        }

        await Cart.create({
            userId,
            productId,
            quantity
        });

        // Calculate new product quantity and sales count
        const newQuantity = product.quantity - quantity;
        const newSalesCount = product.salesCount + quantity;

        await Product.update({
            quantity: newQuantity,
            salesCount: newSalesCount
        }, { where: { id: productId } });

        return { message: 'Item successfully added to cart!' };
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteCartService = async (cartId) => {
    try {
        const cartItem = await Cart.findOne({ where: { id: cartId } });

        if (!cartItem) {
            return { message: 'Item not found!' };
        }

        const product = await Product.findOne({ where: { id: cartItem.productId } });
        if (!product) {
            return { message: 'Product not found!' };
        }

        // Calculate updated quantity and sales count
        const updatedProductQuantity = product.quantity + cartItem.quantity;
        const updatedProductSalesCount = product.salesCount - cartItem.quantity;

        if (updatedProductSalesCount < 0) {
            return { message: 'Sales count cannot be less than zero!' };
        }

        const cartDeleteResult = await Cart.destroy({ where: { id: cartId } });
        if (!cartDeleteResult) {
            return { message: 'Failed to delete cart item.' };
        }

        const productUpdateResult = await Product.update(
            { quantity: updatedProductQuantity, salesCount: updatedProductSalesCount },
            { where: { id: cartItem.productId } }
        );

        if (productUpdateResult[0] === 0) {
            return { message: 'Failed to update product details.' };
        }

        return { message: 'Item successfully deleted and product updated!' };
    } catch (error) {
        console.error("Error in deleteCartService:", error);
        throw new Error('An error occurred while deleting the item from the cart and updating the product.');
    }
};

const getCartServices = async (userId) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId }
        });

        const productIds = cartItems.map(item => item.productId);

        const products = await Product.findAll({
            where: { id: productIds },
            attributes: ['id', 'name', 'offerPrice', 'images']
        });

        const result = cartItems.map(item => {
            const product = products.find(p => p.id === item.productId);

            const imgs = product.images ? JSON.parse(product.images) : [];
            const imageUrl = imgs.map(img => `http://localhost:4000/${img}`);

            return {
                id: item.id,
                productId: product.id,
                img: imageUrl[0] || null,
                product: product.name,
                price: Number(product.offerPrice).toFixed(2),
                quantity: Number.parseInt(item.quantity, 10) 
            };
        });

        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};





module.exports = {
    addCartService,
    deleteCartService,
    getCartServices
};
