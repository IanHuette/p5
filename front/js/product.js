let params = new URL(document.location).searchParams;
let id = params.get("id");
let finalQuantityInput;
const productCardImg = document.createElement("img");
const productCardTitle = document.getElementById("title");
const productCardPrice = document.getElementById("price");
const productCardDes = document.getElementById("description");
const quantity = document.querySelector('#quantity'); 

  // On récupère uniquement le produit dont on a besoin via le paramètre dans la requête
  fetch(`http://localhost:3000/api/products/${id}`)
  .then(res => res.json())
  .then(resultatAPI => {

      console.log(resultatAPI);
      document.querySelector(".item__img").appendChild(productCardImg);
      // On place les données reçues via l'API aux bons endroits sur la page
      productCardImg.src = resultatAPI.imageUrl;
      productCardTitle.innerHTML = resultatAPI.name;
      productCardPrice.innerHTML = resultatAPI.price;
      productCardDes.innerHTML = resultatAPI.description;
    
      for (let color of resultatAPI.colors){
        let colorSelect = document.getElementById("colors")
        let option = document.createElement("option");
        option.text = color;
        option.value = color;
        resultatAPI.colors.innerHTML += colorSelect.appendChild(option);
      }
      // OTHER POSSIBILITY
      // for (let i = 0; i < resultatAPI.colors.length; i++) { 
      //     let colorSelect = document.getElementById("colors")
      //     let option = document.createElement("option");
      //     option.innerText = resultatAPI.colors[i];
      //     colorSelect.appendChild(option);
      //   }


      //A APPRENDRE PAR COEUR ADDTOCART IN TO LOCALSTORAGE
      const addCart = document.querySelector("#addToCart");
      const listColor = document.querySelector('#colors');
    
    
      addCart.addEventListener('click',(e) => {
          // event.preventDefault();
          
          const quantityProduct = parseInt(quantity.value) ;
          const colorProduct = listColor.value;
         console.log(quantityProduct);
        let cartAPI = {
          id:resultatAPI._id , 
          name:resultatAPI.name,
          img:resultatAPI.imageUrl,
          alt:resultatAPI.altTxt,
          description:resultatAPI.description,
          color:colorProduct, 
          number_article: quantityProduct,
          price: resultatAPI.price
        }
        let productsOnLocalStorage = JSON.parse(localStorage.getItem("products"));
      //MESSAGE D ERREUR SELON CONDITION
        if(cartAPI.color =="" || cartAPI.number_article=='0' || cartAPI.number_article > 100){
          alert("Veuillez selectionnez une couleur et un nombre d'article")
        }else{
          if(!productsOnLocalStorage){
            productsOnLocalStorage=[]
            alert("Votre panier a été mis à jour")
          }
        
          for (let i=0; i< productsOnLocalStorage.length; i++){
            if ((cartAPI.color === productsOnLocalStorage[i].color) && (cartAPI.id === productsOnLocalStorage[i].id)){
              
              productsOnLocalStorage[i].number_article += parseInt(cartAPI.number_article);
              localStorage.setItem('products',JSON.stringify(productsOnLocalStorage))
            }
          } //for
        
          let check = productsOnLocalStorage.some( e => e.id === cartAPI.id && e.color === cartAPI.color)
          console.log(check)
          console.log(productsOnLocalStorage)
        
          if(!check){
            productsOnLocalStorage.push(cartAPI)
            localStorage.setItem('products', JSON.stringify(productsOnLocalStorage))
          }
        }// FIN CONDITION
        
      }) 
     // FIN APPRENDRE PAR COEUR
        ;
      })