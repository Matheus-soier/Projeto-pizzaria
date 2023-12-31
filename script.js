let modalQt = 1;

// Simplificando QuerySelector/ QuerySelectorAll
const qs = el => document.querySelector(el); 
const qsa = el => document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
    let pizzaItem = qs('.models .pizza-item').cloneNode(true); //Clona elementos pai e filho
    //Preencher informações

    pizzaItem.setAttribute('data-key', index);
    //Formatando o preço com Template String + toFixed 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; 
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; 
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', e => {
        e.preventDefault();

        //Selecionando o atributo do elemento pizza item mais proximo
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
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