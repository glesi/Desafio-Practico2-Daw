'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Obtiene la fecha actual
    const now = new Date();
    // Array de nombres de meses en español
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    // Establece el título del presupuesto con el mes y el año actual
    document.getElementById('budget-title').textContent = `Presupuesto de ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    // Variables para almacenar los totales de ingresos y egresos
    let totalIngresos = 0;
    let totalEgresos = 0;

    // Función para agregar una transacción (ingreso o egreso)
    function addTransaction(type, amount) {
        if (type === 'ingreso') {
            totalIngresos += amount;
        } else if (type === 'egreso') {
            totalEgresos += amount;
        }
        // Actualiza la pantalla con los nuevos totales
        updateDisplay();
    }

    // Función para actualizar la pantalla con los totales y el saldo
    function updateDisplay() {
        document.getElementById('total-income').textContent = `INGRESOS: + $${totalIngresos.toFixed(2)}`;
        document.getElementById('total-expense').textContent = `EGRESOS: - $${totalEgresos.toFixed(2)}`;
        let balance = totalIngresos - totalEgresos;
        document.getElementById('balance').textContent = balance >= 0 ? `+ $${balance.toFixed(2)}` : `- $${Math.abs(balance).toFixed(2)}`;
        let expensePercentage = totalIngresos !== 0 ? (totalEgresos * 100) / totalIngresos : 0;
        document.getElementById('expense-percentage').textContent = `${expensePercentage.toFixed(0)}%`;
    }

// Event listener para el envío del formulario de transacción
const form = document.getElementById("transactionForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtiene el valor seleccionado del tipo de transacción
    const transactionType = document.getElementById("transactionType").value;

    // Verifica si se ha seleccionado una opción válida
    if (transactionType === 'ingreso' || transactionType === 'egreso') {
        // Si se selecciona una opción válida, procede con la validación de los demás campos
        const transactionDescription = document.getElementById("transactionDescription").value;
        const transactionAmount = parseFloat(document.getElementById("transactionAmount").value);

        // Verifica si el monto es mayor o igual a cero
        if (isNaN(transactionAmount) || transactionAmount < 0) {
            // Muestra una alerta de SweetAlert si el monto no es válido
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor ingresa un monto válido (mayor o igual a cero)',
            });
        } else if (transactionDescription.trim() === '') {
            // Verifica si la descripción está vacía
            // Muestra una alerta de SweetAlert si la descripción está vacía
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor completa todos los campos',
            });
        } else {
            // Si todos los campos están completos y el monto es válido, procede con la inserción de la transacción
            let transactionFormData = new FormData(form);
            let transactionObj = convertFormDataToTransactionObj(transactionFormData);
            saveTransactionObj(transactionObj);
            insertRowInTransactionTable(transactionObj);

            // Reiniciar el formulario para limpiar los campos
            form.reset();
        }
    } else {
        // Muestra una alerta de SweetAlert indicando que se debe seleccionar una opción válida
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor selecciona un tipo de transacción válido (Ingreso o Egreso)',
        });
    }
});





    // Función para convertir los datos del formulario en un objeto de transacción
    function convertFormDataToTransactionObj(transactionFormData) {
        let transactionType = transactionFormData.get("transactionTipo");
        let transactionDescription = transactionFormData.get("transactionDescription");
        let transactionAmount = parseFloat(transactionFormData.get("transactionAmount"));
        return {
            "transactionType": transactionType,
            "transactionDescription": transactionDescription,
            "transactionAmount": transactionAmount,
        };
    }
    

    // Función para insertar una nueva fila en la tabla de transacciones
    function insertRowInTransactionTable(transactionObj) {
        let transactionTableRef = document.getElementById("transactionTable");
        let newTransactionRowRef = transactionTableRef.insertRow(-1);

        let newTypeCellRef = newTransactionRowRef.insertCell(0);
        newTypeCellRef.textContent = transactionObj["transactionType"];

        newTypeCellRef = newTransactionRowRef.insertCell(1);
        newTypeCellRef.textContent = transactionObj["transactionDescription"];

        newTypeCellRef = newTransactionRowRef.insertCell(2);
        newTypeCellRef.textContent = "$" + transactionObj["transactionAmount"].toFixed(2);

        // Llama a la función addTransaction para actualizar los totales
        addTransaction(transactionObj["transactionType"], transactionObj["transactionAmount"]);
    }

    // Función para guardar la transacción (no implementada actualmente)
    function saveTransactionObj(transactionObj) {
        // Aquí puedes implementar el almacenamiento de la transacción, por ejemplo, en localStorage
        // let transactionObjJSON = JSON.stringify(transactionObj);
        // localStorage.setItem("transactionData", transactionObjJSON);
        // Este es solo un ejemplo, asegúrate de implementarlo según tus necesidades
    }

    // Ejemplo de transacciones predefinidas
    addTransaction('ingreso', 100);
    addTransaction('ingreso', 50);
    addTransaction('ingreso', 50);
    addTransaction('ingreso', 350);
    addTransaction('egreso', 300);
});

// Event listeners para los botones de radio
document.getElementById("option1").addEventListener("click", function() {
    document.getElementById("option1Label").classList.add("active");
    document.getElementById("option2Label").classList.remove("active");
});

document.getElementById("option2").addEventListener("click", function() {
    document.getElementById("option2Label").classList.add("active");
    document.getElementById("option1Label").classList.remove("active");
});
