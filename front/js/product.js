let params = new URL(document.location).searchParams;
let id = params.get("id");
// let finalQuantityInput;
const productCardImg = document.createElement("img");
const productCardTitle = document.getElementById("title");
const productCardPrice = document.getElementById("price");
const productCardDes = document.getElementById("description");
const quantity = document.querySelector('#quantity'); 
window.addEventListener('DOMContentLoaded', (event) => {


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
        let productOnStorage = JSON.parse(localStorage.getItem("product"));
      //MESSAGE D ERREUR SELON CONDITION
        if(cartAPI.color =="" || cartAPI.number_article=='0' || cartAPI.number_article > 100){
          alert("Veuillez selectionnez une couleur et un nombre d'article")
        }else{
          if(!productOnStorage){
            productOnStorage=[]
          }
        
          for (let i=0; i< productOnStorage.length; i++){
            if ((cartAPI.color === productOnStorage[i].color) && (cartAPI.id === productOnStorage[i].id)){
              
              productOnStorage[i].number_article += parseInt(cartAPI.number_article);
              localStorage.setItem('product',JSON.stringify(productOnStorage))
            }
          } //for
        
          let check = productOnStorage.some( e => e.id === cartAPI.id && e.color === cartAPI.color)
          console.log(check)
          console.log(productOnStorage)
        
          if(!check){
            productOnStorage.push(cartAPI)
            localStorage.setItem('product', JSON.stringify(productOnStorage))
          }
        }// FIN CONDITION
      }) 
     // FIN APPRENDRE PAR COEUR
        ;
      })

// TEST LOCALSTORAGE
  // let ProduitEnregiste = JSON.parse(localStorage.getItem("produit"));
  // console.log(ProduitEnregiste); 
  
  
  // localStorage.setItem('name', parseFloat(document.getElementById('title').value))
  // localStorage.setItem('price', parseFloat(document.getElementById('price').value))
  // localStorage.setItem('color');

//    let name = document.querySelector("title").value;
//    const panier = JSON.parse(localStorage.getItem("panier")) || []
//    panier.push({
//      name: JSON.stringify(productCardTitle.innerHTML)
//    })
//    window.localStorage.setItem("panier",JSON.stringify(panier))
//   //  console.log(panier)
//    console.log("Le produit a été ajouté au panier");
//   //  showModal()
// })





  // document.getElementById("quantity").addEventListener("change", e => {
  //   const userInput = e.target.value;
  //   // vérifier qu'il s'agit bien d'un nombre entier + vérifier que le nombre est positif + vérifier que la quantité n'excède pas 100
  //   if (
  //     Number.isInteger(userInput) 
  //     && Number.parseInt(userInput) > 0
  //     && Number.parseInt(userInput) <= 100
  //   ) {
  //     finalQuantityInput = userInput;
  //   } else {
  //     alert("WRONG INPUT")
  //   }
  // });





 

/**
 * 
 * quand on veut controler un string de manière poussée, on peut utiliser un regex,
 * par exemple on n'accepte que les emails de type user@openclassrooms.com
 * 
 */
    })