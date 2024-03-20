import { menuArray } from "/data.js"
import { v4 as uuid } from 'https://jspm.dev/uuid'

const appMenu = document.getElementById("app-menu")
const orderSection = document.getElementById("order-section")
const paymentModal = document.getElementById("payment-modal")
let orderArray = []

renderMenu()




// Event listeners
document.addEventListener("click", function(e) {
    if (e.target.dataset.product_id) {
        addMenuItem(menuArray[e.target.dataset.product_id])
    }
    if (e.target.dataset.remove) {
        removeMenuItem(e.target.dataset.remove)
    }
    if (e.target.dataset.complete) {
        openPaymentModal()
    }
    if (e.target.dataset.overlay) {
        document.getElementById("overlay").style.display = "none"
        paymentModal.style.display = "none"
    }
})

function renderMenu() {
    appMenu.innerHTML = menuArray.map(function(menuItem){
        const {name, ingredients, product_id, price, emoji} = menuItem
        
        return `
                <div id="overlay" class="overlay" data-overlay="overlay">
                </div>
                <div class="menu-items-container">
                    <div class="menu-item-card">
                        <div class="button-separator">
                            <div>
                                <p class="menu-card-emoji">${emoji}</p>
                            </div>
                            <div>
                                <p class="menu-item-title">${name}</p>
                                <p class="menu-item-ingredients">${ingredients}</p>
                                <p class="menu-item-price">$${price}</p>
                            </div>
                        </div>
                        <div>
                            <button data-product_id="${product_id}" class="add-to-order-btn">+</button>
                        </div>
                    </div>
                <div>
                `
    }).join('')

}

function addMenuItem(selectedMenuObject){
    
    const newItemToAdd = {...selectedMenuObject}
    newItemToAdd.orderItemID = uuid()
    
    orderArray.push(newItemToAdd)
    renderOrder() 
}

function removeMenuItem(removeOrderItemID) {
    
    orderArray = orderArray.filter(item => item.orderItemID != removeOrderItemID)
    
    orderArray.length === 0 ? orderSection.innerHTML = '' : renderOrder()
}

function renderOrder() {
    let orderPrice = 0
    const orderItems = orderArray.map((item) => {
        orderPrice += item.price    
        return `
                    <div class="order-item">
                        <p>${item.name}</p>
                        <button class="remove-item-button" data-remove="${item.orderItemID}">remove</button>
                        <p class="order-item-price">$${item.price}
                    </div>
                    `
        }).join('')
    
    orderSection.innerHTML = `
                            <div class="order-section">
                                <h2>Your order</h2>
                                ${orderItems}
                                <div class="order-total-price">
                                    <p>Total price:</p>
                                    <p>$${orderPrice}</p>
                                </div>
                                <button class="complete-order-button" data-complete="complete">Complete Order</p> 
                            </div>
                            `                           
}

function openPaymentModal() {
    paymentModal.innerHTML =    `
                                <div class="payment-modal">
                                    <h2>Enter card details</h2>
                                    <form>
                                        <input type="text" name="name" placeholder="Enter your name">
                                        <input type="text" name="card" placeholder="Enter card number">
                                        <input type="text" name="cvv" placeholder="Enter CVV">
                                    </form>
                                    <button>Pay</button>
                                </div>
                                `
    paymentModal.style.display = "flex"
    document.body.style.overflow = 'hidden'
    overlay.style.display = 'block'
}