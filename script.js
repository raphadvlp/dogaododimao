const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const numberAddress = document.getElementById("numberAddress");
const complement = document.getElementById("complement");
const observations = document.getElementById("observation");
const addressWarn = document.getElementById("address-warn");
const nameWarn = document.getElementById("name-warn");
const clientNameInput = document.getElementById("client-name");
const minimoPedidoWarn = document.getElementById("minimo-pedido-warn");
const paymentWarn = document.getElementById("payment-warn");


//Lista do carrinho começa vazia
let cart = [];

//Abre o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal(); //Atualizando o carrinho toda vez que adicona item e clica em abrir o modal
    cartModal.style.display = "flex";
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none";
    }
})

//Fechar o modal com o botão de fechar
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
})

document.getElementById("cep").addEventListener("blur", function() {
    if(this.value.length === 8) { // Verifica se tem 8 dígitos
        consultaCep();
    } else {
        Toastify({
            text: "CEP Inválido ❌",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }
});


menu.addEventListener("click", function(event) {
    //Verifica se clicamos no item com essa classe ou no pai ou no filho | o closest faz isso
    let parentButton = event.target.closest(".add-to-card-btn");

    if(parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        //Adicionar no carrinho
        addToCart(name, price);
    }
})

function consultaCep() {
    let cep = document.getElementById("cep").value.replace(/\D/g, ''); // Remove não-dígitos
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    if(cep.length != 8) {
        return;
    }

    fetch(url)
        .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            mostrarEndereco(data);
        })
    });
}

function mostrarEndereco(dados) {
    addressInput.value = `${dados.logradouro} - ${dados.localidade}/${dados.uf}`;
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
}

//Função para adicionar no carrinho
function addToCart(name, price) {
    //Procura dentro do carrinho se já existe um item com o mesmo nome
    const existingItem = cart.find(item => item.name === name);

    if(existingItem) {
        //Se o item já existe aumenta apenas a quantidade em +1
        existingItem.quatity += 1;

    } else {

         //Adicionando um objeto ao array
        cart.push({
            name,
            price,
            quatity: 1,
        })
        
    }

    //Aviso de item adicionado ao carrinho
    Toastify({
        text: "Item adicionado ao carrinho  😁",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#999900",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    

    updateCartModal();

}



//Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0; 

    //Percorre a nossa lista
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        //Cria o elemento de acordo com cada item da lista
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quatity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

       total += item.price * item.quatity;

        //Depois adiciona dentro da div do carrinho cart-items que está la no HTML
        cartItemsContainer.appendChild(cartItemElement);
    })

    //Formatando o valor total para moeda Brasileira
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    //Atualizando a quantidade de item no carrinho na barra de ver meu carrinho
    cartCounter.innerText = cart.length;

}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains('remove-from-cart-btn')) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }

    //Aviso de item removido do carrinho
    Toastify({
        text: "Item removido do carrinho 😞",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#000",
          color: "#FFF"
        },
        onClick: function(){} // Callback after click
      }).showToast();
})

function removeItemCart(name) {
    //Envia a posição do item na lista caso o nome dele seja o mesmo nome do item clicado
    //findIndex só retorna -1 quando não encontra o item na lista
    const index = cart.findIndex(item => item.name === name); 

    //Se for -1 é porque encontrou o item na lista
    if(index !== -1) {
        const item = cart[index]; //Pega a posição do item
        
        
        if(item.quatity > 1) {
            item.quatity -= 1;
            updateCartModal();
            return;
        }

        //Se tiver apenas 1 item na quantidade ele removeo item
        cart.splice(index, 1);
        updateCartModal();
    }

}

//Pegando o valor digitado no campo de endereço
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    //Se estiver com o alerta e começar a digitar no campo, o alerta some e a borda tembém
    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})

//Pegando o valor digitado no campo de observações
observations.addEventListener("input", function(event) {
    let inputValue = event.target.value;
})

//Pegando o valor digitado no campo de nome
clientNameInput.addEventListener("input", function(event) {
    let inputNameValue = event.target.value;

    //Se estiver com o alerta e começar a digitar no campo, o alerta some e a borda tembém
    if(inputNameValue !== "") {
        clientNameInput.classList.remove("border-red-500");
        nameWarn.classList.add("hidden");
    }
})


//Finalizar o pedido
checkoutBtn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Botão de checkout clicado");

    const isOpen = checkRestauranteOpen();
    if(!isOpen) {
        
        //Aviso de restaurante fechado
        Toastify({
            text: "Ops, o restaurante está fechado 😞",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();

        return;
    }

    //Se o carrinho estiver vazio não finaliza o pedido, não faz nada
    if(cart.length === 0) {
        console.log("Carrinho vazio"); // Log de depuração
        return;
    }

    //Verifica se estamos tentando enviar o pedido sem colocar o endereço, ele vai emitir o alerta
    if(addressInput.value === "" || clientNameInput.value === "") {

        addressWarn.classList.remove("hidden");
        nameWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        clientNameInput.classList.add("border-red-500");
        console.log("Campos obrigatórios não preenchidos"); // Log de depuração
        return;
    }

    // Verificar se uma forma de pagamento foi selecionada
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if(!selectedPayment) {
        paymentWarn.classList.remove("hidden");
        console.log("Forma de pagamento não selecionada"); // Log de depuração
        return;
    }
    paymentWarn.classList.add("hidden");

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quatity;
    });

    
    //Gera número do pedido até 5 digitos
    const numeroDoPedido = Math.floor(Math.random() * 100000);
    // Obter o valor do pagamento selecionado
    const paymentMethod = selectedPayment.value;

     // Informações do PIX (substitua com seus dados reais)
     const pixInfo = `
        *DADOS PARA PAGAMENTO PIX*
        Chave PIX: 123.456.789-09
        Nome: Dogão do Dimão
        Valor: R$${total.toFixed(2)}
    `;


    //Enviar o pedido
    const cartItems = cart.map((item) => {
        return `Produto: ${item.name}\nQuantidade: ${item.quatity}`;
    }).join("%0A%0A");  // Duas quebras entre itens

    const pedido = encodeURIComponent(numeroDoPedido);
    const message = encodeURIComponent(cartItems);
    const phone = "5521986559626";
    // const phone = "5521992192594";

        // Montar a mensagem final
    let finalMessage = `${message}%0A%0A`;
        finalMessage += `*Total do Pedido:* R$${total.toFixed(2)}%0A`;
        finalMessage += `*Forma de Pagamento:* ${paymentMethod}%0A`;
        
        // Adicionar informações do PIX se for selecionado
    if(paymentMethod === "Pix") {
        finalMessage += `%0A${encodeURIComponent(pixInfo)}%0A`;
    }
        
    finalMessage += `%0A*Endereço:* ${addressInput.value}%0A`;
    finalMessage += `*Número:* ${numberAddress.value}%0A`;
    finalMessage += `*Complemento:* ${complement.value}%0A`;
    finalMessage += `%0A*Meu Nome:* ${clientNameInput.value}%0A`;
    finalMessage += `*Número do Pedido:* ${pedido}%0A`;
    finalMessage += `*Observações:* ${observations.value}%0A`;
    finalMessage += `*Enviar o comprovante do pagamento aqui na mensagem*`;

    //Aviso de pedido realizado
    Toastify({
        text: "Pedido Enviado para o Whatsapp 😎",
        duration: 20000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#006600",
        },
        onClick: function(){} // Callback after click
      }).showToast();

    // window.open(`https://wa.me/${phone}?text=${finalMessage} | Forma de Pagamento: ${paymentMethod} | Total do Pedido: R$${total.toFixed(2)} | Endereço: ${addressInput.value} | Meu Nome: ${clientNameInput.value} | Numero do Pedido: ${pedido} | Observações: ${observations.value} | text=${finalMessage} `, "_blank");
    window.open(`https://wa.me/${phone}?text=${finalMessage}`, "_blank");

    cart = [];
    clientNameInput.value = "";
    addressInput.value = "";
    observations.value = "";
    updateCartModal();
    cartModal.style.display = "none";
})


//Verifica se o restaurante está aberto
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    console.log(hora);
    
    return hora >= 12 && hora < 24;
    //&& hora < 23; //Vai devolver como True (Restaurante está aberto)
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();


if(isOpen) {
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-yellow-600"); //Corrigir
} else {
    spanItem.classList.remove("bg-yellow-600");
    spanItem.classList.add("bg-red-600");
}