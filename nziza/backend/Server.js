const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "PMS",
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database Connected");

        db.query("SELECT COUNT(*) AS count FROM users", (countErr, countResult) => {
            if (countErr) {
                console.log("Unable to verify default user:", countErr);
                return;
            }

            if (countResult[0].count === 0) {
                const defaultUsername = "admin";
                const defaultPassword = "admin123";
                const defaultRole = "admin";

                db.query(
                    "INSERT INTO users (UserName, Password, Role) VALUES (?, ?, ?)",
                    [defaultUsername, defaultPassword, defaultRole],
                    (insertErr) => {
                        if (insertErr) {
                            console.log("Failed to create default user:", insertErr);
                        } else {
                            console.log("Default login created: admin / admin123");
                        }
                    }
                );
            }
        });
    }
});

// Create Vehicle
app.post("/vehicle", (req, res) => {
    const {
        Plate_Number,
        Brand,
        Model,
        Year,
        Vehicle_Type,
        Purchase_Price,
        Status,
        PlateNumber,
        VehicleType,
        PurchasePrice,
    } = req.body;

    const plateNumber = Plate_Number || PlateNumber;
    const vehicleType = Vehicle_Type || VehicleType;
    const purchasePrice = Purchase_Price || PurchasePrice;

    const sql = `
        INSERT INTO vehicle
        (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [plateNumber, Brand, Model, Year, vehicleType, purchasePrice, Status],
        (err, result) => {
            if (err) {
                console.error("Create vehicle error:", err);
                return res.status(500).send(err);
            }
            res.send("Vehicle Added");
        }
    );
});

// Read Vehicles
app.get("/vehicle", (req, res) => {
    db.query("SELECT * FROM vehicle", (err, result) => {
        if (err) {
            console.error("Read vehicles error:", err);
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// Update Vehicle
app.put("/vehicle/:id", (req, res) => {
    const id = req.params.id;
    const {
        Plate_Number,
        Brand,
        Model,
        Year,
        Vehicle_Type,
        Purchase_Price,
        Status,
        PlateNumber,
        VehicleType,
        PurchasePrice,
    } = req.body;

    const plateNumber = Plate_Number || PlateNumber;
    const vehicleType = Vehicle_Type || VehicleType;
    const purchasePrice = Purchase_Price || PurchasePrice;

    db.query(
        `UPDATE vehicle SET
            Plate_Number = ?,
            Brand = ?,
            Model = ?,
            Year = ?,
            Vehicle_Type = ?,
            Purchase_Price = ?,
            Status = ?
         WHERE VehicleId = ?`,
        [plateNumber, Brand, Model, Year, vehicleType, purchasePrice, Status, id],
        (err, result) => {
            if (err) {
                console.error("Update vehicle error:", err);
                return res.status(500).send(err);
            }
            res.send("Vehicle Updated");
        }
    );
});

// Delete Vehicle
app.delete("/vehicle/:id", (req, res) => {
    db.query(
        "DELETE FROM vehicle WHERE VehicleId = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error("Delete vehicle error:", err);
                return res.status(500).send(err);
            }
            res.send("Vehicle Deleted");
        }
    );
});

// Create Customer
app.post("/customer", (req, res) => {
    const {
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Status
    } = req.body;

    const createdAt = new Date().toISOString();
    const phone = PhoneNumber || 0;

    db.query(
        `INSERT INTO customer
        (FirstNme, LastName, Email, PhoneNumber, CreatedAt, Status)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [FirstName, LastName, Email, phone, createdAt, Status],
        (err, result) => {
            if (err) {
                console.error("Create customer error:", err);
                return res.status(500).send(err);
            }
            res.send("Customer Added");
        }
    );
});

// Read Customers
app.get("/customer", (req, res) => {
    db.query("SELECT * FROM customer", (err, result) => {
        if (err) {
            console.error("Read customers error:", err);
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// Update Customer
app.put("/customer/:id", (req, res) => {
    const id = req.params.id;
    const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;
    const phone = PhoneNumber || 0;

    db.query(
        `UPDATE customer SET
            FirstNme = ?,
            LastName = ?,
            Email = ?,
            PhoneNumber = ?,
            Status = ?
        WHERE customer_Id = ?`,
        [FirstName, LastName, Email, phone, Status, id],
        (err, result) => {
            if (err) {
                console.error("Update customer error:", err);
                return res.status(500).send(err);
            }
            res.send("Customer Updated");
        }
    );
});

// Delete Customer
app.delete("/customer/:id", (req, res) => {
    db.query(
        "DELETE FROM customer WHERE customer_Id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error("Delete customer error:", err);
                return res.status(500).send(err);
            }
            res.send("Customer Deleted");
        }
    );
});

// Create Promotion
app.post("/promotion", (req, res) => {
    const {
        Title,
        Description,
        Department,
        Discount_Type,
        Discount_Value,
        Start_Date,
        End_Date,
        Status,
        DiscountType,
        DiscountValue,
        StartDate,
        EndDate,
    } = req.body;

    const discountType = Discount_Type || DiscountType;
    const discountValue = Discount_Value || DiscountValue;
    const startDate = Start_Date || StartDate || new Date().toISOString().slice(0, 19).replace('T', ' ');
    const endDate = End_Date || EndDate || new Date().toISOString().slice(0, 19).replace('T', ' ');
    const department = Department || 'General';

    db.query(
        `INSERT INTO promotion
        (Title, Department, Discount_Type, Discount_Value, Start_Date, End_Date, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            Title,
            department,
            discountType,
            discountValue,
            startDate,
            endDate,
            Status
        ],
        (err, result) => {
            if (err) {
                console.error("Create promotion error:", err);
                return res.status(500).send(err);
            }
            res.send("Promotion Added");
        }
    );
});

// Read Promotions
app.get("/promotion", (req, res) => {
    db.query("SELECT * FROM promotion", (err, result) => {
        if (err) {
            console.error("Read promotions error:", err);
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// Update Promotion
app.put("/promotion/:id", (req, res) => {
    const id = req.params.id;
    const {
        Title,
        Description,
        Department,
        Discount_Type,
        Discount_Value,
        Start_Date,
        End_Date,
        Status,
        DiscountType,
        DiscountValue,
        StartDate,
        EndDate,
    } = req.body;

    const discountType = Discount_Type || DiscountType;
    const discountValue = Discount_Value || DiscountValue;
    const startDate = Start_Date || StartDate || new Date().toISOString().slice(0, 19).replace('T', ' ');
    const endDate = End_Date || EndDate || new Date().toISOString().slice(0, 19).replace('T', ' ');
    const department = Department || 'General';

    db.query(
        `UPDATE promotion SET
            Title = ?,
            Department = ?,
            Discount_Type = ?,
            Discount_Value = ?,
            Start_Date = ?,
            End_Date = ?,
            Status = ?
        WHERE PromotionId = ?`,
        [Title, department, discountType, discountValue, startDate, endDate, Status, id],
        (err, result) => {
            if (err) {
                console.error("Update promotion error:", err);
                return res.status(500).send(err);
            }
            res.send("Promotion Updated");
        }
    );
});

// Delete Promotion
app.delete("/promotion/:id", (req, res) => {
    db.query(
        "DELETE FROM promotion WHERE PromotionId = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error("Delete promotion error:", err);
                return res.status(500).send(err);
            }
            res.send("Promotion Deleted");
        }
    );
});

// Create User
app.post("/user", (req, res) => {
    const { Username, UserName, Password, Role } = req.body;
    const userName = UserName || Username;

    db.query(
        "INSERT INTO users(UserName,Password,Role) VALUES(?,?,?)",
        [userName, Password, Role],
        (err, result) => {
            if (err) {
                console.error("Create user error:", err);
                return res.status(500).send(err);
            }
            res.send("User Added");
        }
    );
});

// Read Users
app.get("/user", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.error("Read users error:", err);
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// Login
app.post("/login", (req, res) => {
    const { Username, UserName, Password } = req.body;
    const userName = UserName || Username;

    db.query(
        "SELECT UserId, UserName, Role FROM users WHERE UserName = ? AND Password = ?",
        [userName, Password],
        (err, result) => {
            if (err) {
                console.error("Login error:", err);
                return res.status(500).send(err);
            }
            if (!result || result.length === 0) {
                return res.status(401).send({ message: "Invalid username or password" });
            }
            res.send(result[0]);
        }
    );
});

app.listen(2000, () => {
    console.log("Server running on port 2000");
});