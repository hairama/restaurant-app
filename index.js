// Importing the menu data & UUID generator function
import { menuArray } from "/data.js"
import { v4 as uuid } from 'https://jspm.dev/uuid'

// Creating selectors for the 3 main parts of the app
const appMenu = document.getElementById("app-menu")
const orderSection = document.getElementById("order-section")
const paymentModal = document.getElementById("payment-modal")

// Creating an empty array to hold order objects
let orderArray = []

// Rendering the menu items
renderMenu()


/*  Event listeners are set up to add and remove items from the menu
    and to open or close the payment modal 
*/
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
        closePaymentModal()
    }
})



function renderMenu() {
/*  This function adds HTML to the 'appMenuHTML' string variable and displays the menu items.
    1. It creates a container for all menu items 
    2. Iterates over the menuArray
    3. Generates a 'card' for each menu item. 
    4. Joins the array items together 
    5. Renders the page with the 'appMenu' selector
*/  
    let appMenuHTML = `
    <div id="overlay" class="overlay" data-overlay="overlay">
    </div>
    <div class="menu-items-container">
    `
    appMenuHTML += menuArray.map(function(menuItem){
        const {name, ingredientList, product_id, price, emoji} = menuItem
        
        let ingredients = ingredientList.join(', ')

        return `      
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
            <span class="add-to-order-btn" data-product_id="${product_id}" role="button">+</span>
            </div>
        </div>
    `
    }).join('')
    appMenuHTML += `<div>`
    appMenu.innerHTML = appMenuHTML
}

function addMenuItem(selectedMenuObject){
/*  When the add-to-order-btn is clicked, this function adds the corresponding menu object to the orderArray
    1. It "spreads" the object from the orderArray(selectedMenuObject) and assigns it to newItemToAdd
    2. It adds a UUID, which is helpful if we want to remove it later
    3. It pushes the new item to the orderArray and renders the order
*/ 
    const newItemToAdd = {...selectedMenuObject}
    newItemToAdd.orderItemID = uuid()
    
    orderArray.push(newItemToAdd)
    renderOrder() 
}

function removeMenuItem(removeOrderItemID) {
/* When a remove button is clicked on an order item, this function:
    1. Filters it out of the array, using the UUID
    2. It checks if the orderArray is empty and
        a. If it is, "removes" the order section (by setting the HTML to a blank string)
        b. If it's not, re-renders the order section
*/
    orderArray = orderArray.filter(item => item.orderItemID != removeOrderItemID)
    
    orderArray.length === 0 ? orderSection.innerHTML = '' : renderOrder()
}

function renderOrder() {
/* This function displays any items in the order section (and their prices) by
    1. Setting the order price to 0
    2. Mapping through the order array
    3. Generating HTML for each order item, and adding it to the orderItems array
    4. Adding the price for each item
    5. Adding the HTML for the order section including
      a. The order items HTML we just created
      b. The total price we just calculated

*/
    let orderPrice = 0
    const orderItems = orderArray.map((item) => {
        orderPrice += item.price    
        return `
                    <div class="order-item-container">
                        <p>${item.name}</p>
                        <button class="remove-item-button" data-remove="${item.orderItemID}">remove</button>
                        <p class="order-item-price">$${item.price}
                    </div>
                    `
        }).join('')
    
    orderSection.innerHTML = `
                            <!--<div class="order-section">-->
                                <h2 class="order-section-title">Your order</h2>
                                ${orderItems}
                                <div class="order-total-price-container">
                                    <p class="order-total-price">Total price:</p>
                                    <p class="order-total-price">$${orderPrice}</p>
                                </div>
                                <button class="complete-button" data-complete="complete">Complete Order</p> 
                            <!--</div>-->
                            `
}

function openPaymentModal() {
/* This function displays the payment form modal and places a semi-transparent overlay beneath it
    1. Generate HTML for the modal
    2. Make the display visible by setting the modal display to "flex"
    3. Make the overlay visible and prevent scrolling behind it
    5. Create a selector to click on the overlay/click off of the modal 
    6. Add an event listener & function to form submission

*/
    paymentModal.innerHTML =    `
                                <div class="payment-modal">
                                    <p>Enter card details</p>
                                    <form id="payment-form">
                                        <input 
                                        required
                                        type="text" 
                                        name="name" 
                                        id="name"
                                        placeholder="Enter your name"
                                        >
                                        <input 
                                        required
                                        type="text" 
                                        name="card" 
                                        id="card"
                                        placeholder="Enter card number"
                                        >
                                        <input 
                                        required
                                        type="text" 
                                        name="cvv" 
                                        id="cvv"
                                        placeholder="Enter CVV">
                                        <button class="pay-button" data-pay="pay">Pay</button>
                                    </form>
                                    
                                </div>
                                `
    paymentModal.style.display = "flex"
    document.body.style.overflow = 'hidden'
    overlay.style.display = 'block'

    const paymentForm = document.getElementById('payment-form')

    paymentForm.addEventListener('submit', function(e){
        /* This function handles form submission events
            1. Prevent the page from reloading
            2. Store the customer name (for the thank you message)
            3. Close the payment modal
            4. Call the displayThankYouMessage function
        */
        e.preventDefault()
        const nameInput = document.getElementById("name")
        const customerName = nameInput.value
        
        closePaymentModal()
        displayThankyouMessage(customerName)
    })
}

function closePaymentModal() {
/* This function hides the modal and overlay, and makes the document body scrollable again
*/
    document.getElementById("overlay").style.display = "none"
    paymentModal.style.display = "none"
    document.body.style.overflow = 'visible'
}

function displayThankyouMessage(customerName) {
/* This function replaces the order section HTML with a thank you message */    
    orderSection.innerHTML = `
                                <div class="post-payment-thank-you-message">
                                    <p>Thanks, ${customerName}! Your order is on its way!</p>
                                </div>
                            `
}