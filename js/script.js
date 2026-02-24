// ================== BASE URL ==================
const BASE_URL = "http://localhost:3000";


// ================== PATIENT ==================

async function addPatient() {
    const name = document.getElementById("name")?.value.trim();
    const age = document.getElementById("age")?.value.trim();

    if (!name || !age) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${BASE_URL}/add-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age })
    });

    document.getElementById("name").value = "";
    document.getElementById("age").value = "";

    loadPatients();
    loadPatientsForDropdown();
}

async function loadPatients() {
    const table = document.getElementById("patientTable");
    if (!table) return;

    const response = await fetch(`${BASE_URL}/patients`);
    const data = await response.json();

    table.innerHTML = "";

    data.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.NAME}</td>
                <td>${p.AGE}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deletePatient(${p.PATIENT_ID})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function deletePatient(id) {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    await fetch(`${BASE_URL}/delete-patient/${id}`, {
        method: "DELETE"
    });

    loadPatients();
    loadPatientsForDropdown();
}


// ================== DOCTOR ==================

async function addDoctor() {
    const name = document.getElementById("docName")?.value.trim();
    const specialization = document.getElementById("specialization")?.value.trim();
    const phone = document.getElementById("docPhone")?.value.trim();

    if (!name || !specialization || !phone) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${BASE_URL}/add-doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, specialization, phone })
    });

    document.getElementById("docName").value = "";
    document.getElementById("specialization").value = "";
    document.getElementById("docPhone").value = "";

    loadDoctors();
    loadDoctorsForDropdown();
}

async function loadDoctors() {
    const table = document.getElementById("doctorTable");
    if (!table) return;

    const response = await fetch(`${BASE_URL}/doctors`);
    const data = await response.json();

    table.innerHTML = "";

    data.forEach(d => {
        table.innerHTML += `
            <tr>
                <td>${d.NAME}</td>
                <td>${d.SPECIALIZATION}</td>
                <td>${d.PHONE}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteDoctor(${d.DOCTOR_ID})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function deleteDoctor(id) {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    await fetch(`${BASE_URL}/delete-doctor/${id}`, {
        method: "DELETE"
    });

    loadDoctors();
    loadDoctorsForDropdown();
}


// ================== APPOINTMENT ==================

async function addAppointment() {
    const patientId = document.getElementById("patientSelect")?.value;
    const doctorId = document.getElementById("doctorSelect")?.value;
    const date = document.getElementById("appointmentDate")?.value;

    if (!patientId || !doctorId || !date) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${BASE_URL}/add-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            patient_id: patientId,
            doctor_id: doctorId,
            appointment_date: date
        })
    });

    loadAppointments();
}

async function loadAppointments() {
    const table = document.getElementById("appointmentTable");
    if (!table) return;

    const response = await fetch(`${BASE_URL}/appointments`);
    const data = await response.json();

    table.innerHTML = "";

    data.forEach(a => {
        table.innerHTML += `
            <tr>
                <td>${a.PATIENT_NAME}</td>
                <td>${a.DOCTOR_NAME}</td>
                <td>${new Date(a.APPOINTMENT_DATE).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteAppointment(${a.APPOINTMENT_ID})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function deleteAppointment(id) {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    await fetch(`${BASE_URL}/delete-appointment/${id}`, {
        method: "DELETE"
    });

    loadAppointments();
}


// ================== BILLING ==================

async function generateBill() {
    const patientId = document.getElementById("billPatient")?.value;
    const consultFee = document.getElementById("consultFee")?.value;
    const medicineCost = document.getElementById("medicineCost")?.value;
    const otherCost = document.getElementById("otherCost")?.value;

    if (!patientId || !consultFee || !medicineCost || !otherCost) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${BASE_URL}/add-bill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            patient_id: patientId,
            consult_fee: consultFee,
            medicine_cost: medicineCost,
            other_cost: otherCost
        })
    });

    document.getElementById("consultFee").value = "";
    document.getElementById("medicineCost").value = "";
    document.getElementById("otherCost").value = "";
    document.getElementById("liveTotal").innerText = 0;

    loadBills();
}

async function loadBills() {
    const table = document.getElementById("billTable");
    if (!table) return;

    const response = await fetch(`${BASE_URL}/bills`);
    const data = await response.json();

    table.innerHTML = "";

    data.forEach(b => {
        table.innerHTML += `
            <tr>
                <td>${b.PATIENT_NAME}</td>
                <td>₹ ${b.TOTAL_AMOUNT}</td>
                <td>${new Date(b.BILL_DATE).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteBill(${b.BILL_ID})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function deleteBill(id) {
    if (!confirm("Are you sure you want to delete this bill?")) return;

    await fetch(`${BASE_URL}/delete-bill/${id}`, {
        method: "DELETE"
    });

    loadBills();
}


// ================== DROPDOWNS ==================

async function loadPatientsForDropdown() {
    const response = await fetch(`${BASE_URL}/patients`);
    const data = await response.json();

    const patientSelect = document.getElementById("patientSelect");
    const billSelect = document.getElementById("billPatient");

    if (patientSelect) {
        patientSelect.innerHTML = "<option value=''>Select Patient</option>";
        data.forEach(p => {
            patientSelect.innerHTML += `
                <option value="${p.PATIENT_ID}">${p.NAME}</option>
            `;
        });
    }

    if (billSelect) {
        billSelect.innerHTML = "<option value=''>Select Patient</option>";
        data.forEach(p => {
            billSelect.innerHTML += `
                <option value="${p.PATIENT_ID}">${p.NAME}</option>
            `;
        });
    }
}

async function loadDoctorsForDropdown() {
    const select = document.getElementById("doctorSelect");
    if (!select) return;

    const response = await fetch(`${BASE_URL}/doctors`);
    const data = await response.json();

    select.innerHTML = "<option value=''>Select Doctor</option>";

    data.forEach(d => {
        select.innerHTML += `
            <option value="${d.DOCTOR_ID}">${d.NAME}</option>
        `;
    });
}


// ================== LIVE TOTAL ==================

function calculateLiveTotal() {
    const consult = parseFloat(document.getElementById("consultFee")?.value) || 0;
    const medicine = parseFloat(document.getElementById("medicineCost")?.value) || 0;
    const other = parseFloat(document.getElementById("otherCost")?.value) || 0;

    document.getElementById("liveTotal").innerText = consult + medicine + other;
}


// ================== ON LOAD ==================

window.onload = function () {
    loadPatients();
    loadDoctors();
    loadAppointments();
    loadBills();
    loadPatientsForDropdown();
    loadDoctorsForDropdown();
};