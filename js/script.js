AOS.init();
// -----Inputs-----
const imageURLInput = document.getElementById("image-url-input");
const nameInput = document.getElementById("name-input");
const pricetInput = document.getElementById("price-input");
const descriptiontInput = document.getElementById("description-input");

//-----Buttons-----
const submit = document.getElementById("submit-product-bttn");
const postCommentsButton = document.getElementById("post-comment-button");

//-----Declerations-----
const commentsResult = document.getElementById("comments-result");

//-----show all products function-----
let showAllProducts = () => {
  $.ajax({
    type: 'GET',
    url: "https://holloware-backend-psi.vercel.app/allProducts",
    //the success function contains an object which can be named anything 
    success: (products) => {
      console.log(products);
      renderProducts(products);
    },
    error: (error) => {
      console.log(error);
    }
  });
};

//-----------------------------
// COMMENTS MODAL
//-----------------------------
// Renders the comments in the modal, passing our data, named 'product' to the ajax via arguments
let renderComments = (product) => {
  if (product.comments.length > 0) {
    // Declaring an empty string that the comments get pushed into
    let allComments = "";
    product.comments.forEach((comment) => {
      collectCommentButtons();
      // Filling our empty string that the comments get pushed into
      allComments += `<li class="comment-text"><img class="comments-pfp" src="${comment.commentedBy}"> ${comment.text}</li>`;
    });
    return allComments;
  } else {
    // If there are no comments pushed to allComments, return a small message
    return `<p class="no-comments">No comments yet</p>`;
  }
};

let openCommentModal = (productId) => {
  // Ajax GET to request the individual product via ID
  $.ajax({
    type: 'GET',
    url: `https://holloware-backend-psi.vercel.app/product/${productId}`,
    //the success function contains an object which can be named anything 
    success: (product) => {
      commentsResult.innerHTML = `
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      <img class="comments-image" src="${product.image_url}" alt="${product.name}">
      <p class="comments-description">${product.description}</p>
      <ul class="comments-box">${renderComments(product)}</ul>
      <div class="laptop-image-container">
      <img class="comments-image-laptop" src="${product.image_url}" alt="${product.name}">
       <h2 class="comments-title">${product.name}</h2>
      </div>
          `;
    },
    error: (error) => {
      console.log(error);
    }
  });
  if (loggedin == false) {
    console.log("boo");
    document.getElementById("comments-input").style.display = "none";
    document.getElementById("post-comment-button").style.display = "none";
  }
  postCommentsButton.onclick = () => {
    console.log(productId);
    console.log("left a comment");
    $.ajax({
      url: `https://holloware-backend-psi.vercel.app/postComment`,
      type: 'POST',
      data: {
        text: document.getElementById("comments-input").value,
        product_id: productId,
        commentedBy: sessionStorage.profileImg,
      },
      success: (commentedBy) => {
        console.log("Comment posted");
        console.log(commentedBy);
        openCommentModal(productId);
        showAllProducts();
      },
      error: () => {
        console.log("Error can't post comment");
      }
    });
  };
};

let collectCommentButtons = () => {
  let commentButtonsArray = document.getElementsByClassName("comment-button");
  for (let i = 0; i < commentButtonsArray.length; i++) {
    commentButtonsArray[i].onclick = () => {
      let productId = commentButtonsArray[i].parentNode.parentNode.id;
      openCommentModal(productId);
    };
  }
};

//-----render products function-----
let renderProducts = (products) => {
  const gridContainer = document.getElementById("grid-container");
  console.log("the render projects function is working");
  gridContainer.innerHTML = "";
  products.forEach((item) => {
    if (sessionStorage.userID == item.product_owner) {
      gridContainer.innerHTML += `
      <div class="product-wrapper" id="${item._id}" data-aos="fade-up">
        <div class="hover-functions">
        <i class="bi bi-pencil-fill edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
        <i class="bi bi-trash3-fill delete-button"></i>     
        <i class="bi bi-heart"></i>  
        </div>
          <img src="${item.image_url}" alt="${item.name}">
          <div class="product-bio">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <i id="comment-button" class="bi bi-chat-left-text-fill comment-button" data-bs-toggle="modal" data-bs-target="#commentsModal"></i>
          </div>
      </div>
      `;
      console.log(item.product_owner);
    } else {
      gridContainer.innerHTML += `
      <div class="product-wrapper" id="${item._id}" data-aos="fade-up">
        <div class="hover-functions">
        <i class="bi bi-heart"></i>  

        </div>
          <img src="${item.image_url}" alt="${item.name}">
          <div class="product-bio">
          <h3>${item.name}</h3>
          <p>$${item.price}</p>
          <i id="comment-button" class="bi bi-chat-left-text-fill comment-button" data-bs-toggle="modal" data-bs-target="#commentsModal"></i>
          </div>
      </div>
      `;
    }
  });
  collectDeleteButtons();
  collectCommentButtons();
  collectEditButtons();
  collectLikeButtons();
};


//------------------------
//Delete Product
//------------------------

let deleteProduct = (productId) => {
  $.ajax({
    url: `https://holloware-backend-psi.vercel.app/deleteProduct/${productId}`,
    type: "DELETE",
    success: () => {
      showAllProducts();
    },
    error: () => {
      console.log("Cannot call API");
    },
  });
};

let collectDeleteButtons = () => {
  let deleteButtonsArray = document.getElementsByClassName("delete-button");
  for (let i = 0; i < deleteButtonsArray.length; i++) {
    deleteButtonsArray[i].onclick = () => {
      let currentId = deleteButtonsArray[i].parentNode.parentNode.id;
      deleteProduct(currentId);
    };
  }
};

let collectLikeButtons = () => {
  let likeBtnArray = document.getElementsByClassName("bi-heart");
  for (let i = 0; i < likeBtnArray.length; i++) {
    likeBtnArray[i].onclick = () => {
      console.log("you liked me");
      likeBtnArray[i].style.color = "#F4C9FF";
      likeBtnArray[i].style.fontSize = "30px";
    };
  }
};

//------------------------
//Edit Product
//------------------------
let fillEditInputs = (product, id) => {
  let imageurl = document.getElementById("imageUrl");
  let productName = document.getElementById("productName");
  let productPrice = document.getElementById("productPrice");
  let productDescription = document.getElementById("productDescription");
  let imagePreview = document.getElementById("image-preview");
  imageurl.value = product.image_url;
  productName.value = product.name;
  productPrice.value = product.price;
  productDescription.value = product.description;
  imagePreview.innerHTML = `
  <img src="${product.image_url}" alt="${product.name}">
  `;

  //------------------------
  //Edit Listen
  //------------------------
  $("#updateProduct").click(function () {
    event.preventDefault();
    let productId = id;
    let imageurl = document.getElementById("imageUrl").value;
    let productName = document.getElementById("productName").value;
    let productPrice = document.getElementById("productPrice").value;
    let productDescription = document.getElementById("productDescription").value;
    console.log(productId, imageurl, productName, productPrice, productDescription);
    $.ajax({
      url: `https://holloware-backend-psi.vercel.app/updateProduct/${productId}`,
      type: "PATCH",
      data: {
        name: productName,
        price: productPrice,
        image_url: imageurl,
        description: productDescription,
      },
      success: function (data) {
        showAllProducts();
        $('#editModal').modal('hide');
        $("#updateProduct").off('click');
      },
      error: function () {
        console.log("error: cannot update");
      },
    });
  });
};

let populateEditModal = (productId) => {
  console.log(productId);
  $.ajax({
    type: 'GET',
    url: `https://holloware-backend-psi.vercel.app/product/${productId}`,
    success: (productData) => {
      console.log(productData);
      fillEditInputs(productData, productId);
    },
    error: (error) => {
      console.log(error);
    }
  });
};

let collectEditButtons = () => {
  let editButtonsArray = document.getElementsByClassName("edit-button");
  for (let i = 0; i < editButtonsArray.length; i++) {
    editButtonsArray[i].onclick = () => {
      let currentId = editButtonsArray[i].parentNode.parentNode.id;
      populateEditModal(currentId);
    };
  }
};

//-----------------------------
// LIST ALL PRODUCTS
//-----------------------------
showAllProducts();

//-----------------------------
// LOGIN FUNCTION
//-----------------------------
let loggedin = false;
let checkLogin = () => {
  let navContent;
  const profileContainer = document.getElementById("profile-container");
  if (sessionStorage.userID) {
    console.log("you logged in");
    loggedin = true;
    navContent = ` 
      <div id="user-details">
        <i class="bi bi-plus-circle small-add" id="new-product-bttn" data-bs-toggle="modal" data-bs-target="#add-product-modal"></i>
        <button class="big-add" id="bignew-product-bttn" data-bs-toggle="modal" data-bs-target="#add-product-modal">Add New Product <i class="bi bi-plus-circle"></i></button>     
            
        <span id="dp" style="background-image: url('${sessionStorage.profileImg}')"></span>
      </div>
    `;
  } else {
    loggedin = false;
    console.log("you are a guest");
    navContent = `
      <ul>
        <li class="landing-h5 guest"><a href="register.html">Register</a></li>
        <li class="landing-h5 guest"><a href="login.html">Login</a></li>
      </ul>
    `;
  }
  profileContainer.innerHTML = navContent;
  if (loggedin == true) {
    const profileBtn = document.getElementById("dp");
    const userProfle = document.getElementById("user-profile");
    const userOverlay = document.getElementById("user-overlay");
    const topSignUpIn = document.getElementById("topSignUpIn");

    topSignUpIn.classList.toggle('hidden');


    profileBtn.onclick = () => {
      userOverlay.classList.toggle('active');
      userProfle.classList.toggle('active');


      userProfle.innerHTML = `
      <i class="bi bi-x" id="close-profile-bttn"></i>
      <div id="profile-content-wrapper">
        <span id="dp" style="background-image: url('${sessionStorage.profileImg}')"></span>
        <h3>Hi ${sessionStorage.userName}!</h3>
        <div class="btn-wrapper">
          <button id="myProducts-Btn">My Products</button>    
          <button id="logout-Btn">Log Out</button>     
        </div>
      </div>
   
      `;
      //-----logout and close modal function-----
      const logoutBtn = document.getElementById("logout-Btn");

      let logOut = () => {
        console.log("you've logged out");
        sessionStorage.clear();
        topSignUpIn.classList.toggle('hidden');
        window.location.reload();
      };
      if (sessionStorage.userID) {
        const closePrfileBtn = document.getElementById("close-profile-bttn");
        closePrfileBtn.onclick = () => {
          userProfle.classList.toggle('active');
          userOverlay.classList.toggle('active');
          console.log("closed");
        };

        logoutBtn.onclick = () => logOut();
      }
    };

    submit.onclick = () => {
      console.log("clicked submit");
      $.ajax({
        url: `https://holloware-backend-psi.vercel.app/addProduct`,
        type: "POST",
        data: {
          image_url: imageURLInput.value,
          name: nameInput.value,
          price: pricetInput.value,
          description: descriptiontInput.value,
          product_owner: sessionStorage.userID

        },
        success: () => {
          console.log("A new product was added.");
          showAllProducts();
          $('#add-product-modal').modal('hide');
        },
        error: () => {
          console.log("Error: cannot reach the backend");
        },
      });
    };

  }
};
checkLogin();