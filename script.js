let cart = [];
let modalQt = 1;
let modalKey;

// Simplificando QuerySelector/ QuerySelectorAll
const qs = el => document.querySelector(el); 
const qsa = el => document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
    let pizzaItem = qs('.models .pizza-item').cloneNode(true); //Clona elementos pai e filho
    //Preencher informações

    pizzaItem.setAttribute('data-key', index);
    //Formatando o preço com Template String + toFixed 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; 
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`; 
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', e => {
        e.preventDefault();

        //Selecionando o atributo do elemento pizza item mais proximo
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;

        modalQt = 1;
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsa('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
        });

        qs('.pizzaInfo--qt').innerHTML = modalQt;

        qs('.pizzaWindowArea').style.opacity = "0";
        qs('.pizzaWindowArea').style.display = "flex";
    
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = "1";
        }, 200);

        qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
            item.addEventListener('click', closeWindown);
        });

        qs('.pizzaInfo--qtmais').addEventListener('mouseup', qtMais);
        qs('.pizzaInfo--qtmenos').addEventListener('mouseup', qtMenos);

        qsa('.pizzaInfo--size').forEach((size)=>{
           size.addEventListener('click', ()=>{
            qs('.pizzaInfo--size.selected').classList.remove('selected');
            size.classList.add('selected');
           });
        });

        qs('.pizzaInfo--addButton').addEventListener('click', addCart);

        qsa('.pizzaInfo--size, .pizzaInfo--size span').forEach((element)=>{
            element.addEventListener('click', (event)=>{
                let sizeDiv = event.target.closest('.pizzaInfo--size');
                let sizePriceIndex = sizeDiv.getAttribute('data-key');
        
                if (sizePriceIndex == 0) {
                    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[0].toFixed(2)}`;
                } else if (sizePriceIndex == 1) {
                    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[1].toFixed(2)}`;
                } else if (sizePriceIndex == 2) {
                    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[2].toFixed(2)}`;
                }
            });
        });

    });

   qs('.pizza-area').append(pizzaItem); // Adicionando elementos sem sobrepor
});

//Functions
function closeWindown() {
    qs('.pizzaWindowArea').style.opacity = "0";
    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display = "none";
    }, 500);
}

function qtMenos() {
    if(modalQt > 1) {
        modalQt--;
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    }
}

function qtMais() {
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
}

function addCart() {
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = `${pizzaJson[modalKey].id}@${size}`;

    let key = cart.findIndex(item => item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }            
    updateCart();
    closeWindown();
}

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = ``;

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
            
            let sizePizza = parseInt(cart[i].size);
            subtotal += pizzaItem.price[sizePizza] * cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                     pizzaSizeName = `P`;
                break;
                case 1:
                    pizzaSizeName = `M`;
                break;
                case 2:
                    pizzaSizeName = `G`;
                break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;

                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            qs('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}

qs('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        qs('aside').style.left = 0;
    }
});

qs('aside .menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
});