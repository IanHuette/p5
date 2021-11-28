
let productsOnLocalStorage = JSON.parse(localStorage.getItem("product"));

let articleTotal = 0;
let priceTotal = 0;
document.getElementById('totalQuantity').innerHTML = articleTotal;
document.getElementById('totalPrice').innerHTML = priceTotal;

function updateArticlePriceTotal(article, price) {
    // ici, on met à jour l'affichage du total du panier
    document.getElementById('totalQuantity').innerHTML = article;
    document.getElementById('totalPrice').innerHTML = price;
}

function updateOneArticlePriceTotal(id, price, quantity) {
    let displayValue = price * quantity;
    if(isNaN(displayValue)) displayValue = 0;
    document.getElementById(id).innerHTML = displayValue; // a quoi sert le id
}

function resetPriceAndArticleTotal(product) {
    let previousArticleTotal = parseInt(document.getElementById('totalQuantity').innerHTML);
    let previousPriceTotal = parseInt(document.getElementById('totalPrice').innerHTML);
    // on veut soustraire à ces anciennes valeurs pour le produit concerné => quantité et prix
    let previousProductQuantity = parseInt(localStorage.getItem(`previousProductQuantity_${product.id}`)); 
    let resetArticleTotal =  previousArticleTotal - previousProductQuantity;
    let resetPriceTotal = previousPriceTotal - (parseInt(product.price) * previousProductQuantity);  
    return {
        quantity: resetArticleTotal,
        price: resetPriceTotal
    }
}

/**
 * cette boucle for permet d'injecter des cart items depuis ce qui est présent dans le local storage
 * 
 * 1 - on récupère chacun des produits
 * 2 - on sélectionne l'id de chacun des produits + on créé le HTML pour le cart_item incluant cet id
 * 3 - à l'intérieur de la même boucle, on ajoute un event lister pour l'input quantité du produit itéré
 */
for (let [idx, product] of productsOnLocalStorage.entries()) {

    articleTotal += parseInt(product.number_article);
    priceTotal += parseInt(product.price) * parseInt(product.number_article);

    // ici on créé la div qui va contenir le HTML du cart item
    // à ce moment là, productDiv existe en Javascript in memory mais n'est pas injecté dans le DOM
    const productDiv = document.createElement("div");
    productDiv.id = `${product.id}_div`;

    // on manipule cet élément en injectant à la div créée précedemment le HTML correspondant
    productDiv.innerHTML += `<article class="cart__item" data-id="${product.id}" id="${product.id}_cartItem">
                                                            <div class="cart__item__img">
                                                                <img src="${product.img}" alt="${product.alt}">
                                                            </div>
                                                            <div class="cart__item__content">
                                                            <div class="cart__item__content__titlePrice">
                                                                <h2>${product.name}</h2>
                                                                <p id="${product.id}_total"></p>
                                                            </div>
                                                            <div class="cart__item__content__settings">
                                                                <div class="cart__item__content__settings__quantity">
                                                                <p>Qté : </p>
                                                                <input id="${product.id}_quantityItem" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100">
                                                                </div>
                                                                <div class="cart__item__content__settings__delete">
                                                                <p id="${product.id}_deleteBtn" class="deleteItem">Supprimer</p>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </article>`;
      
    // quand notre productDiv est prête, on l'injecte dans le DOM, au niveau des cart items                                                    
    document.getElementById("cart__items").appendChild(productDiv);
          
    // on peut maintenant dynamiquement setter la valeur du quantityItem input
    document.getElementById(`${product.id}_quantityItem`).value = product.number_article;

    updateOneArticlePriceTotal(`${product.id}_total`, product.price, product.number_article);

    /**
     * on créé une paire clé/valeur unique pour la quantité initiale du produit
     * pour l'article itéré lors du chargement de la page;
     * on sauvegarde ça dans le local storage
     */
    localStorage.setItem(`previousProductQuantity_${product.id}`, product.number_article);

    //lors du changement de la quantité, applique la modification
    let itemQuantity = document.getElementById(`${product.id}_quantityItem`);
    itemQuantity.addEventListener("input", (e) => {
        let newQuantityValue = parseInt(e.target.value);
        if(isNaN(newQuantityValue)) newQuantityValue = 0;
        /**
         * ici, on veut changer la valeur initiale de 
         * 1) la valeur du total produit en haut à droite de la carte produit
         * 2) la valeur totale du panier affichée à l'utilisateur
         */
        updateOneArticlePriceTotal(`${product.id}_total`, product.price, newQuantityValue);

        // 2) on récupère d'abord les anciennes valeurs des quantité + prix total du panier
        let reset = resetPriceAndArticleTotal(product);
        // on veut calculer les nouvelles valeurs du nombre d'articles et prix totaux
        let newArticleTotal = reset.quantity + newQuantityValue;
        let newPriceTotal = reset.price + (parseInt(product.price) * newQuantityValue);

        updateArticlePriceTotal(newArticleTotal, newPriceTotal);

        // updating the previous quantity for the product at hand
        localStorage.setItem(
            `previousProductQuantity_${product.id}`, 
            newQuantityValue
        );

        // mettre à jour la liste des produits dans le local storage
        // 1 - mettre à jour l'objet produit
        product.number_article = newQuantityValue;
        // 2 - remettre le produit mis à jour dans la liste
        productsOnLocalStorage.splice(idx, 1, product); 
        // 3 - réécrire dans le local storage
        localStorage.setItem("product", JSON.stringify(productsOnLocalStorage));
    });

    // implémenter le bouton supprimer pour l'article concerné
    // selectionner le bouton sur lequel l'utilisateur clique (event listener)
    document.getElementById(`${product.id}_deleteBtn`).addEventListener("click", e => {
        // supprimer la div correspondant à l'id du produit
        document.getElementById(`${product.id}_div`).remove();
        // recalculer le total du panier
        let reset = resetPriceAndArticleTotal(product);
        updateArticlePriceTotal(reset.quantity, reset.price);
        localStorage.removeItem(`previousProductQuantity_${product.id}`);
        productsOnLocalStorage.splice(idx, 1);
        localStorage.setItem("product", JSON.stringify(productsOnLocalStorage));
    });
}     

updateArticlePriceTotal(articleTotal, priceTotal);

//Probleme: liste de produits n'est plus un objet mais un array
//1-Essayer de changer un array en object

// //TEST1 NON FONCTIONNEL
// function toObject(productsOnLocalStorage) {
//     var rv = {};
//     for (var i = 0; i < productsOnLocalStorage.length; ++i)
//       rv[i] = productsOnLocalStorage[i];
//     return rv;
//   }
//   productsOnLocalStorage = toObject;

//TEST2 non fonctionnel
// const entries = [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ];
// const obj = productsOnLocalStorage.fromEntries(entries);
// console.log(obj);



//////////1- Récupérer et analyser les données saisies par l’utilisateur dans le formulaire
//////////2- Constituer un objet contact (à partir des données du formulaire) et un tableau de produits
    const submit = document.getElementById("order");
    let inputFirstName = document.getElementById("firstName");
    let inputLastName = document.getElementById("lastName");
    let inputCity = document.getElementById("city");
    let inputAdress = document.getElementById("address");
    let inputMail = document.getElementById("email");
    
    
    
// submit.addEventListener("click",(e) =>{
// let order = {
//    contact: {
//            firstName: inputFirstName.value,
//            lastName: inputLastName.value,
//            address: inputAdress.value,
//            city: inputCity.value,
//            email: inputMail.value
//          },
//          products: productsOnLocalStorage
// };
// localStorage.setItem("product", JSON.stringify(order));

// const options = {
//     method: "POST",
//     body: JSON.stringify(order),
//     headers: { "Content-Type": "application/json" },
// };

//     fetch("http://localhost:3000/api/products/order", options)
//     .then(res => res.json())
//     .then((data) => {

// localStorage.setItem("orderId", data.orderId);
// // document.location.href = "confirmation.html";
//     })
// });



