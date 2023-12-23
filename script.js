// Simplificando QuerySelector/ QuerySelectorAll
const qs = el => document.querySelector(el); 
const qsa = el => document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
    let pizzaItem = qs('.models .pizza-item').cloneNode(true); //Clona elementos pai e filho
    //Preencher informações
   qs('.pizza-area').append(pizzaItem); // Adicionando elementos sem sobrepor
});