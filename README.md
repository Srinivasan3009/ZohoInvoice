# Invoice Management System — Setup Guide

## 📌 Project Overview

This project is a **Full Stack Invoice Management System** built using:

* **Frontend:** React.js
* **Backend:** Java Servlets (Jakarta EE)
* **Server:** Apache Tomcat
* **Database:** MySQL
* **JSON Handling:** Gson

The application allows users to:

* Login
* Manage Items
* Manage Customers
* Create Invoices
* View Created Invoices

---

## 🧰 Technology Stack

| Layer        | Technology        |
| ------------ | ----------------- |
| Frontend     | React (Port 3000) |
| Backend      | Java Servlet      |
| Server       | Apache Tomcat 10+ |
| Database     | MySQL             |
| Build Tool   | Maven             |
| JSON Library | Gson              |

---

## 📁 Project Structure

```
project-root/
│
├── frontend/ (React App)
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── src/main/java/org/example/
│   │   ├── controller/
│   │   ├── util/
│   │   └── filter/
│   ├── webapp/WEB-INF/web.xml
│   └── pom.xml
```

---

## ⚙️ Prerequisites

Install the following:

* Node.js (v18+ recommended)
* Java JDK 17+
* Apache Tomcat 10+
* MySQL Server
* Maven
* IntelliJ IDEA (recommended)

---

## 🗄️ Database Setup

### 1️⃣ Create Database

```sql
CREATE DATABASE invoice_db;
USE invoice_db;
```

---

### 2️⃣ Create Tables

#### Users

```sql
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);
```

#### Customers

```sql
CREATE TABLE customers(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);
```

#### Items

```sql
CREATE TABLE items(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2)
);
```

#### Invoices

```sql
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    invoice_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);
```

#### Invoice Items

```sql
CREATE TABLE invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    item_id INT,
    quantity INT,
    price DECIMAL(10,2),

    FOREIGN KEY (invoice_id)
        REFERENCES invoices(id)
        ON DELETE CASCADE,

    FOREIGN KEY (item_id)
        REFERENCES items(id)
);
```

---

## 🔧 Backend Setup (Java + Tomcat)

### 1️⃣ Configure Database Connection

Edit:

```
DBConnection.java
```

```java
String url = "jdbc:mysql://localhost:3306/invoice_db";
String user = "root";
String password = "your_password";
```

---

### 2️⃣ Add Maven Dependencies

`pom.xml`

```xml
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.10.1</version>
</dependency>

<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>8.0.33</version>
</dependency>
```

---

### 3️⃣ Build Project

```bash
mvn clean package
```

Generated file:

```
backend-1.0-SNAPSHOT.war
```

---

### 4️⃣ Deploy to Tomcat

Copy WAR file to:

```
tomcat/webapps/
```

Start Tomcat:

```bash
./startup.sh
```

Backend runs at:

```
http://localhost:8080/backend-1.0-SNAPSHOT
```

---

## 🌐 Frontend Setup (React)

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React app:

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔐 CORS Configuration

A CORS Filter is added in backend to allow React requests.

Allowed Origin:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

| Feature        | Endpoint         |
| -------------- | ---------------- |
| Login          | `/api/login`     |
| Items          | `/api/items`     |
| Customers      | `/api/customers` |
| Create Invoice | `/api/invoices`   |
| Get Invoices   | `/api/invoices`  |

---

## ▶️ Running the Project

1. Start MySQL
2. Start Tomcat Server
3. Run Backend (WAR deployed)
4. Start React App

Open browser:

```
http://localhost:3000
```

---

## 🧪 Default Workflow

1. Login
2. Add Items
3. Add Customers
4. Create Invoice
5. View Invoices

---

## 🐞 Common Issues

### CORS Error

Ensure CORS filter is configured and Tomcat restarted.

### 404 Error

Check correct WAR name in URL.

### 500 Internal Server Error

Check Tomcat logs:

```
tomcat/logs/catalina.out
```

### Database Connection Error

Verify:

* MySQL running
* DB name correct
* Credentials correct

---



