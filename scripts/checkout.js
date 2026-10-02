import { cart ,removeFromCart,updateQuantity} from "../data/cart.js";
import {products} from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import {deliveryOptions} from '../data/deliveryOptions.js'


let cartSummaryHtml ='';

cart.forEach((cartItem)=>{
    const productId =cartItem.productId;
    let matchingProduct ;

    products.forEach((product)=>{
      if (product.id === productId) {
    matchingProduct = product;
  }
    })

  const deliveryOptionId =cartItem.deliveryOptionId;
  let deliveryOption;

  deliveryOptions.forEach((option)=>{
    if(option.id === deliveryOptionId){
      deliveryOption = option;
    }
  })

  if (!matchingProduct || !deliveryOption) {
    return;
  }

  const today =dayjs();
    const deliverDate =today.add(
      deliveryOption.deliveryDays,'days'
    );
    const dateString =deliverDate.format(
      'dddd,MMMM D'
    );

  cartSummaryHtml +=
        ` <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">
                 ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">
                    ${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link"
                    data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link"
                    data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>  
                ${deliveryOptionsHtml(matchingProduct,cartItem)}
              </div>
            </div>
          </div>
    `;
});

function deliveryOptionsHtml(matchingProduct,cartItem){
  let html ='';
  deliveryOptions.forEach((deliveryOption)=>{
    const isChecked = String(deliveryOption.id) === String(cartItem.deliveryOptionId);
    const today =dayjs();
    const deliverDate =today.add(
      deliveryOption.deliveryDays,'days'
    );
    const dateString =deliverDate.format(
      'dddd,MMMM D'
    );
    const priceString = deliveryOption.priceCents === 0
      ? 'Free'
      : formatCurrency(deliveryOption.priceCents);
  
   html += `
      <div class="delivery-option">
        <input type="radio" ${isChecked ? 'checked':''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
     </div>
    `
  });

  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;

function updateCartQuantity() {
  const cartQuantity = cart.reduce((total, cartItem) => {
    return total + cartItem.quantity;
  }, 0);

  document.querySelector('.js-return-to-home-link').innerHTML =
    `${cartQuantity} items`;
}

updateCartQuantity();

document.querySelectorAll('.js-delete-link').forEach((link)=>{
  link.addEventListener('click',() => {
    const productId = link.dataset.productId;
      removeFromCart(productId);

     const container = document.querySelector(`.js-cart-item-container-${productId}`);
       container.remove();
       updateCartQuantity();
  });
});

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const quantityLabel = container.querySelector('.quantity-label');

    if (link.innerText.trim() === 'Update') {
      quantityLabel.innerHTML = `<input class="quantity-input" value="${quantityLabel.innerText}">`;
      link.innerText = 'Save';
      return;
    }

    const quantityInput = container.querySelector('.quantity-input');
    const newQuantity = Number(quantityInput.value);

    if (!Number.isInteger(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
      alert('Quantity must be a whole number from 0 to 999.');
      return;
    }

    if (newQuantity === 0) {
      removeFromCart(productId);
      container.remove();
    } else {
      updateQuantity(productId, newQuantity);
      quantityLabel.innerHTML = newQuantity;
      link.innerText = 'Update';
    }
    updateCartQuantity();
  });
});


