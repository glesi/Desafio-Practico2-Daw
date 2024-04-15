'use strict'
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    document.getElementById('budget-title').textContent = `Presupuesto de ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    let totalIngresos = 0;
    let totalEgresos = 0;

    addTransaction('ingreso', 100);
    addTransaction('ingreso', 50);
    addTransaction('ingreso', 50);
    addTransaction('ingreso', 350);
    addTransaction('egreso', 300);

    function addTransaction(type, amount) {
        if (type === 'ingreso') {
            totalIngresos += amount;
        } else if (type === 'egreso') {
            totalEgresos += amount;
        }
        updateDisplay();
    }

    function updateDisplay() {
        document.getElementById('total-income').textContent = `INGRESOS: + $${totalIngresos.toFixed(2)}`;
        document.getElementById('total-expense').textContent = `EGRESOS: - $${totalEgresos.toFixed(2)}`;
        let balance = totalIngresos - totalEgresos;
        document.getElementById('balance').textContent = balance >= 0 ? `+ $${balance.toFixed(2)} ` : ` - $${Math.abs(balance).toFixed(2)}`;
        let expensePercentage = (totalEgresos * 100) / totalIngresos;
        document.getElementById('expense-percentage').textContent = `${expensePercentage.toFixed(0)}%`;
    }
//Enlace de formulario e historial de transacciones.

    const form = document.getElementById("transactionForm");
    form.addEventListener("submit",function(event){
        event.preventDefault();
        let transactionFormData = new FormData(form);
        let transactionObj = convertFormDataToTransactionObj(transactionFormData)
        saveTransactionObj(transactionObj)
        insertRowInTransactionTable(transactionObj)
        
        
    })

    function convertFormDataToTransactionObj(transactionFormData){
        let transactionType = transactionFormData.get("transactionType");
        let transactionDescription = transactionFormData.get("transactionDescription");
        let transactionAmount = transactionFormData.get("transactionAmount");
        return{
            "transactionType" : transactionType,
            "transactionDescription" : transactionDescription,
            "transactionAmount" : transactionAmount,

        }
    }

    function insertRowInTransactionTable(transactionObj){

        let transactionTableRef = document.getElementById("transactionTable");
        let newTransactionRowRef = transactionTableRef.insertRow(-1);

        let newTypeCellRef = newTransactionRowRef.insertCell(0);
        newTypeCellRef.textContent = transactionObj["transactionType"];

        newTypeCellRef = newTransactionRowRef.insertCell(1);
        newTypeCellRef.textContent =transactionObj["transactionDescription"];

        newTypeCellRef = newTransactionRowRef.insertCell(2);
        newTypeCellRef.textContent = "$"+ transactionObj["transactionAmount"];
    }
    function saveTransactionObj(transactionObj){
        let transactionObjJSON = JSON.stringify(transactionObj);
        localStorage.setItem("transactionData",transactionObjJSON);
    }

});