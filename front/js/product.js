let params = new URL(document.location).searchParams;
let id = params.get("id");
// let finalQuantityInput;
const productCardImg = document.createElement("img");
const productCardTitle = document.getElementById("title");
const productCardPrice = document.getElementById("price");
const productCardDes = document.getElementById("description");

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
      
      
      
      for (let i = 0; i < resultatAPI.colors.length; i++) { 
          let colorSelect = document.getElementById("colors")
          let option = document.createElement("option");
          option.innerText = resultatAPI.colors[i];
          colorSelect.appendChild(option);
        }

      }) 

// TEST LOCALSTORAGE
  // let ProduitEnregiste = JSON.parse(localStorage.getItem("produit"));
  // console.log(ProduitEnregiste); 
  
  
  localStorage.setItem('name', parseFloat(document.getElementById('title').value))
  localStorage.setItem('price', parseFloat(document.getElementById('price').value))
  localStorage.setItem('color');

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