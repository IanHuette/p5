fetch("http://localhost:3000/api/products")
    .then(res => res.json())

    // Dispatcher les données de chaque produit dans le DOM
    .then(resultatAPI => {
      console.log(resultatAPI);
      for (let article in resultatAPI) {
        let productLink = document.createElement("a");
        document.getElementById("items").appendChild(productLink);
        productLink.href = `product.html?id=${resultatAPI[article]._id}`;
      
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle)
        
        let productImg = document.createElement("img")
        productArticle.appendChild(productImg)
        productImg.src = `${resultatAPI[article].imageUrl}`
        productImg.alt = `${resultatAPI[article].altTxt}`

        let productName = document.createElement("h3")
        productArticle.appendChild(productName)
        productName.innerHTML = `${resultatAPI[article].name}`
        productName.classList.add("productName")

        let productDescription = document.createElement("p")
        productArticle.appendChild(productDescription)
        productDescription.innerHTML = `${resultatAPI[article].description}`
        productDescription.classList.add("productDescription")
      }
    })
      
    
