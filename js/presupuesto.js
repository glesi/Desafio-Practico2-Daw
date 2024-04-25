'use strict';

document.addEventListener('DOMContentLoaded', function () {
    
    let transactions = [];
    
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
    form.addEventListener("submit", function (event) {
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
                transactions.push(transactionObj); // Almacena la transacción aquí
                addTransaction(transactionObj["transactionType"], transactionObj["transactionAmount"]); // Actualiza totales
                updateView(); // Actualiza la vista basándose en el tab activo

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
    function insertRowInTransactionTable(transactionObj, tbody) {
        let newTransactionRowRef = tbody.insertRow(-1);

        let newTypeCellRef = newTransactionRowRef.insertCell(0);
        newTypeCellRef.textContent = transactionObj["transactionType"];

        let newDescriptionCellRef = newTransactionRowRef.insertCell(1);
        newDescriptionCellRef.textContent = transactionObj["transactionDescription"];

        let newAmountCellRef = newTransactionRowRef.insertCell(2);
        newAmountCellRef.textContent = "$" + transactionObj["transactionAmount"].toFixed(2);
    }

    // Event listeners para los botones de radio
    function showIngresos() {
        const ingresos = transactions.filter(t => t.transactionType === 'ingreso');
        updateTransactionTable(ingresos);
    }

    function showEgresos() {
        const egresos = transactions.filter(t => t.transactionType === 'egreso');
        updateTransactionTable(egresos);
    }

    // Actualiza la tabla de transacciones con las transacciones filtradas
    function updateTransactionTable(filteredTransactions) {
        const transactionTableRef = document.getElementById("transactionTable").getElementsByTagName('tbody')[0];
        transactionTableRef.innerHTML = ''; // Limpia la tabla actual

        filteredTransactions.forEach(transaction => {
            insertRowInTransactionTable(transaction, transactionTableRef);
        });
    }

    // Event listeners para los tabs
    document.getElementById("showIngresos").addEventListener("click", function (event) {
        event.preventDefault();
        setActiveTab(this);
        showIngresos();
    });

    document.getElementById("showEgresos").addEventListener("click", function (event) {
        event.preventDefault();
        setActiveTab(this);
        showEgresos();
    });

    function setActiveTab(activeTabElement) {
        document.querySelector('.nav-link.active').classList.remove('active');
        activeTabElement.classList.add('active');
    }

    // Actualiza la tabla al cargar la página y cada vez que se añade una transacción
    function updateView() {
        if (document.querySelector('#showIngresos').classList.contains('active')) {
            showIngresos();
        } else {
            showEgresos();
        }
    }

    // Inicia la vista con las transacciones ingresos por defecto
    setActiveTab(document.getElementById("showIngresos"));
    showIngresos();
    updateView();
});