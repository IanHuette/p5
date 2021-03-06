
// on récupère une liste de produits depuis le local storage (les produits sélectionnés par le user dans accueil)
let productsOnLocalStorage = JSON.parse(localStorage.getItem("products"));

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

// si on a effectivement des produits stockés dans le local storage, on exécute le code qui va afficher le total et les cartes produits
if(productsOnLocalStorage != null) {
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
            localStorage.setItem("products", JSON.stringify(productsOnLocalStorage));
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
            localStorage.setItem("products", JSON.stringify(productsOnLocalStorage));
        });
    }
}     

updateArticlePriceTotal(articleTotal, priceTotal);

//////////1- Récupérer et analyser les données saisies par l’utilisateur dans le formulaire
//////////2- Constituer un objet contact (à partir des données du formulaire) et un tableau de produits
const submit = document.getElementById("order");
let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputCity = document.getElementById("city");
let inputAddress = document.getElementById("address");
let inputMail = document.getElementById("email");

    console.log(productsOnLocalStorage);

let errorFirstName = document.getElementById('firstNameErrorMsg');
let errorLastName = document.getElementById('lastNameErrorMsg');
let errorAddress = document.getElementById('addressErrorMsg');
let errorCity = document.getElementById('cityErrorMsg');
let errorMail = document.getElementById('emailErrorMsg');




submit.addEventListener("click",(e) => {
    e.preventDefault();

    ///ICI JE VEUX CONTROLER LE FORMULAIRE, SI IL N Y A PAS DE NOM/PRENOM ect  > AFFICHé UN MESSAGE SINON  > CONTINUER LA FONCTION
    ///SAUF QUE MEME SI IL N Y A PAS UN NOM/PRENOM ect LA FONCTION CONTINUE ET ENVOIE TOUT A L API
    
    if (inputFirstName.value == '') {
        errorFirstName.innerHTML = "Veuillez renseigner votre Prénom";
    }
    if (inputLastName.value == '') {
        errorLastName.innerHTML = "Veuillez renseigner votre Nom";
    }
    if (inputAddress.value == '') {
        errorAddress.innerHTML = "Veuillez renseigner votre Adresse";
    }
    if (inputCity.value == '') {
        errorCity.innerHTML = "Veuillez renseigner votre Ville";
    }
    if (inputMail.value == '') {
        errorMail.innerHTML = "Veuillez renseigner votre adresse Mail";
    }
    if (productsOnLocalStorage === null ){
        alert("Votre panier est vide, pour commander merci d'ajouter des produits !")
        document.location.href = "index.html";
        // return;
    }

    /// J AIMERAIS ARRETER LA FONCTION ICI SI IL Y A UN MESSAGE QUE J AI AFFICHé SINON JE VEUX QUE LA FONCTION CONTINUE


    else {
        console.log(productsOnLocalStorage);
        const productIdsArr = productsOnLocalStorage.map(product => product.id);

    // l'objet order est ce que nous envoyons au backend
        let order = {
            contact: {
                firstName: inputFirstName.value,
                lastName: inputLastName.value,
                address: inputAddress.value,
                city: inputCity.value,
                email: inputMail.value
            },
            products: productIdsArr
        };

    /**
     * on persiste la commande dans le local storage
     * pour récupérer les informations de commande dans la page confirmation
     */
        localStorage.setItem("order", JSON.stringify(order));

        const options = {
            method: "POST",
            body: JSON.stringify(order),
            headers: { "Content-Type": "application/json" },
        };

        fetch("http://localhost:3000/api/products/order", options)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                localStorage.setItem("orderId", data.orderId);
                document.location.href = "confirmation.html";
            })
    }
});



