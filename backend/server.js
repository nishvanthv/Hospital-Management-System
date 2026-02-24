const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE CONFIG =================
const dbConfig = {
    user: "system",
    password: "090706",
    connectString: "localhost/XEPDB1"
};

// ================= PATIENT =================

// ADD PATIENT
app.post("/add-patient", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const { name, age } = req.body;

        await connection.execute(
            `INSERT INTO PATIENT (name, age)
             VALUES (:name, :age)`,
            { name, age },
            { autoCommit: true }
        );

        res.json({ message: "Patient added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error inserting patient" });
    } finally {
        if (connection) await connection.close();
    }
});

// GET PATIENTS
app.get("/patients", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT patient_id, name, age
             FROM PATIENT
             ORDER BY patient_id`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching patients" });
    } finally {
        if (connection) await connection.close();
    }
});

// DELETE PATIENT
app.delete("/delete-patient/:id", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const id = req.params.id;

        await connection.execute(
            `DELETE FROM PATIENT WHERE patient_id = :id`,
            { id },
            { autoCommit: true }
        );

        res.json({ message: "Patient deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting patient" });
    } finally {
        if (connection) await connection.close();
    }
});


// ================= DOCTOR =================

// ADD DOCTOR
app.post("/add-doctor", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const { name, specialization, phone } = req.body;

        await connection.execute(
            `INSERT INTO DOCTOR (name, specialization, phone)
             VALUES (:name, :specialization, :phone)`,
            { name, specialization, phone },
            { autoCommit: true }
        );

        res.json({ message: "Doctor added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error inserting doctor" });
    } finally {
        if (connection) await connection.close();
    }
});

// GET DOCTORS
app.get("/doctors", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT doctor_id, name, specialization, phone
             FROM DOCTOR
             ORDER BY doctor_id`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching doctors" });
    } finally {
        if (connection) await connection.close();
    }
});

// DELETE DOCTOR
app.delete("/delete-doctor/:id", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const id = req.params.id;

        await connection.execute(
            `DELETE FROM DOCTOR WHERE doctor_id = :id`,
            { id },
            { autoCommit: true }
        );

        res.json({ message: "Doctor deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting doctor" });
    } finally {
        if (connection) await connection.close();
    }
});


// ================= APPOINTMENT =================

// ADD APPOINTMENT
app.post("/add-appointment", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const { patient_id, doctor_id, appointment_date } = req.body;

        await connection.execute(
            `INSERT INTO APPOINTMENT
             (patient_id, doctor_id, appointment_date)
             VALUES (:patient_id, :doctor_id,
                     TO_DATE(:appointment_date, 'YYYY-MM-DD'))`,
            { patient_id, doctor_id, appointment_date },
            { autoCommit: true }
        );

        res.json({ message: "Appointment booked successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error booking appointment" });
    } finally {
        if (connection) await connection.close();
    }
});

// GET APPOINTMENTS
app.get("/appointments", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT 
                A.appointment_id,
                P.name AS patient_name,
                D.name AS doctor_name,
                A.appointment_date
             FROM APPOINTMENT A
             JOIN PATIENT P ON A.patient_id = P.patient_id
             JOIN DOCTOR D ON A.doctor_id = D.doctor_id
             ORDER BY A.appointment_id`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching appointments" });
    } finally {
        if (connection) await connection.close();
    }
});

// DELETE APPOINTMENT
app.delete("/delete-appointment/:id", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const id = req.params.id;

        await connection.execute(
            `DELETE FROM APPOINTMENT WHERE appointment_id = :id`,
            { id },
            { autoCommit: true }
        );

        res.json({ message: "Appointment deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting appointment" });
    } finally {
        if (connection) await connection.close();
    }
});


// ================= BILLING =================

// ADD BILL
app.post("/add-bill", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const { patient_id, consult_fee, medicine_cost, other_cost } = req.body;

        const total_amount =
            Number(consult_fee) +
            Number(medicine_cost) +
            Number(other_cost);

        await connection.execute(
            `INSERT INTO BILL
             (patient_id, consult_fee, medicine_cost, other_cost, total_amount, bill_date)
             VALUES (:patient_id, :consult_fee, :medicine_cost, :other_cost, :total_amount, SYSDATE)`,
            { patient_id, consult_fee, medicine_cost, other_cost, total_amount },
            { autoCommit: true }
        );

        res.json({ message: "Bill generated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error generating bill" });
    } finally {
        if (connection) await connection.close();
    }
});

// GET BILLS
app.get("/bills", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT 
                B.bill_id,
                P.name AS patient_name,
                B.total_amount,
                B.bill_date
             FROM BILL B
             JOIN PATIENT P ON B.patient_id = P.patient_id
             ORDER BY B.bill_id`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching bills" });
    } finally {
        if (connection) await connection.close();
    }
});

// DELETE BILL
app.delete("/delete-bill/:id", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const id = req.params.id;

        await connection.execute(
            `DELETE FROM BILL WHERE bill_id = :id`,
            { id },
            { autoCommit: true }
        );

        res.json({ message: "Bill deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting bill" });
    } finally {
        if (connection) await connection.close();
    }
});


// ================= SERVER START =================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});