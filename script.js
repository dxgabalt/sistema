document.addEventListener("DOMContentLoaded", function () {
    const inventoryElement = document.getElementById("inventory");
    const productNameInput = document.getElementById("product-name");
    const productQuantityInput = document.getElementById("product-quantity");
    const productPriceInput = document.getElementById("product-price");
    const addProductButton = document.getElementById("add-product");
    const scanButton = document.getElementById("scan-button");

    // Inicializa QuaggaJS para escanear códigos de barras
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#camera'),
        },
        decoder: {
            readers: ["code_128_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    // Array para almacenar productos
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    // Función para mostrar la lista de productos
    function renderInventory() {
        inventoryElement.innerHTML = "";
        inventory.forEach((product, index) => {
            const productItem = document.createElement("div");
            productItem.innerHTML = `
                <strong>${product.name}</strong> - 
                Cantidad: ${product.quantity} - 
                Precio: $${product.price.toFixed(2)}
                <button onclick="editProduct(${index})">Editar</button>
                <button onclick="removeProduct(${index})">Eliminar</button>`;
            inventoryElement.appendChild(productItem);
        });
    }

    // Función para agregar o editar un producto en el inventario
    function addOrUpdateProduct() {
        const name = productNameInput.value;
        const quantity = parseInt(productQuantityInput.value);
        const price = parseFloat(productPriceInput.value);

        if (name && quantity > 0 && price >= 0) {
            const product = { name, quantity, price };
            const index = inventory.findIndex(p => p.name === name);

            if (index !== -1) {
                // Si ya existe, actualiza el producto
                inventory[index] = product;
            } else {
                // Si no existe, agrega el producto
                inventory.push(product);
            }

            // Limpia los campos de entrada
            productNameInput.value = "";
            productQuantityInput.value = "";
            productPriceInput.value = "";

            // Actualiza el almacenamiento local y muestra el inventario
            localStorage.setItem("inventory", JSON.stringify(inventory));
            renderInventory();
        }
    }

    // Función para editar un producto
    function editProduct(index) {
        const product = inventory[index];
        productNameInput.value = product.name;
        productQuantityInput.value = product.quantity;
        productPriceInput.value = product.price;
    }

    // Función para eliminar un producto del inventario
    function removeProduct(index) {
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
    }

    // Escuchar eventos de botones
    addProductButton.addEventListener("click", addOrUpdateProduct);
    scanButton.addEventListener("click", () => {
        Quagga.start();
    });

    // Mostrar el inventario al cargar la página
    renderInventory();
});
