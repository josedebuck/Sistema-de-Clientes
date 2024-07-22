let totalAmount = 0;

// Cargar la fecha almacenada al iniciar
window.onload = function() {
    const storedDate = localStorage.getItem('storedDate');
    if (storedDate) {
        document.getElementById('date').value = storedDate;
    }
};

function addEntry() {
    const clientName = document.getElementById('clientName').value;
    const clientType = document.getElementById('clientType').value;
    const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
    const date = document.getElementById('date').value;

    // Almacenar la fecha seleccionada
    localStorage.setItem('storedDate', date);

    const tableBody = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();

    newRow.insertCell(0).innerText = clientName;
    newRow.insertCell(1).innerText = clientType;
    newRow.insertCell(2).innerText = paymentAmount.toFixed(2);
    newRow.insertCell(3).innerText = date;

    const deleteCell = newRow.insertCell(4);
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Eliminar';
    deleteButton.style.backgroundColor = '#e74c3c';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.padding = '5px 10px';
    deleteButton.style.borderRadius = '4px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.onclick = function() {
        deleteEntry(newRow, paymentAmount);
    };
    deleteCell.appendChild(deleteButton);

    totalAmount += paymentAmount;
    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    document.getElementById('calculationForm').reset();
    document.getElementById('date').value = date; // Mantener la fecha después de reiniciar el formulario
}

function deleteEntry(row, amount) {
    const tableBody = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    tableBody.removeChild(row);

    totalAmount -= amount;
    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const table = document.getElementById('entriesTable');
    const totalAmount = document.getElementById('totalAmount').innerText;
    
    doc.text('Planilla de Cálculos', 20, 20);
    doc.autoTable({ html: table, startY: 30 });
    doc.text(`Total Generado: $${totalAmount}`, 20, doc.autoTable.previous.finalY + 20);
    doc.save('planilla_calculos.pdf');
}

function clearData() {
    // Borrar las filas de la tabla
    const tableBody = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Restablecer el total generado
    totalAmount = 0;
    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    // Borrar la fecha almacenada
    localStorage.removeItem('storedDate');
    document.getElementById('date').value = "";

    // Restablecer el formulario
    document.getElementById('calculationForm').reset();
}
