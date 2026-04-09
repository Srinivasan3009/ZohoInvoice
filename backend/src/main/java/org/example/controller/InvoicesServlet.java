package org.example.controller;

import com.google.gson.*;
import jakarta.servlet.ServletException;
import org.example.util.DBConnection;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

@WebServlet("/api/invoices")
public class InvoicesServlet extends HttpServlet {

        protected void doPost(HttpServletRequest request,
                              HttpServletResponse response)
                throws IOException {

            response.setContentType("application/json");
            PrintWriter out = response.getWriter();

            try (Connection con = DBConnection.getConnection()) {

                con.setAutoCommit(false);
                BufferedReader reader = request.getReader();
                JsonObject json =
                        JsonParser.parseReader(reader).getAsJsonObject();

                int customerId =
                        json.get("customerId").getAsInt();

                JsonArray rows =
                        json.getAsJsonArray("rows");

                double totalAmount = 0;

                for (JsonElement e : rows) {
                    JsonObject row = e.getAsJsonObject();

                    int qty = row.get("qty").getAsInt();
                    double price = row.get("price").getAsDouble();

                    totalAmount += qty * price;
                }
                String invoiceSql =
                        "INSERT INTO invoices(customer_id, invoice_date, total_amount) VALUES (?, NOW(), ?)";

                PreparedStatement invoiceStmt =
                        con.prepareStatement(invoiceSql, Statement.RETURN_GENERATED_KEYS);

                invoiceStmt.setInt(1, customerId);
                invoiceStmt.setDouble(2, totalAmount);

                invoiceStmt.executeUpdate();

                ResultSet rs = invoiceStmt.getGeneratedKeys();
                rs.next();
                int invoiceId = rs.getInt(1);

                String itemSql =
                        "INSERT INTO invoice_items(invoice_id, item_id, quantity, price) VALUES (?,?,?,?)";

                PreparedStatement itemStmt =
                        con.prepareStatement(itemSql);

                for (JsonElement e : rows) {

                    JsonObject row = e.getAsJsonObject();

                    int itemId = row.get("itemId").getAsInt();
                    int qty = row.get("qty").getAsInt();
                    double price = row.get("price").getAsDouble();

                    itemStmt.setInt(1, invoiceId);
                    itemStmt.setInt(2, itemId);
                    itemStmt.setInt(3, qty);
                    itemStmt.setDouble(4, price);

                    itemStmt.addBatch();
                }

                itemStmt.executeBatch();

                con.commit();

                out.print("{\"success\":true}");

            } catch (Exception e) {
                e.printStackTrace();
                response.setStatus(500);
                out.print("{\"success\":false}");
            }

            out.flush();
        }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        String idParam = req.getParameter("id");

        try (Connection con = DBConnection.getConnection()) {
            if (idParam != null) {

                int invoiceId = Integer.parseInt(idParam);
                JsonObject invoiceData = new JsonObject();

                String sqlHeader = "SELECT i.*, c.name FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE i.id = ?";
                PreparedStatement psHeader = con.prepareStatement(sqlHeader);
                psHeader.setInt(1, invoiceId);
                ResultSet rsHeader = psHeader.executeQuery();

                if (rsHeader.next()) {
                    invoiceData.addProperty("id", rsHeader.getInt("id"));
                    invoiceData.addProperty("customerId", rsHeader.getInt("customer_id"));
                    invoiceData.addProperty("totalAmount", rsHeader.getDouble("total_amount"));

                    JsonArray rows = new JsonArray();
                    String sqlItems = "SELECT * FROM invoice_items WHERE invoice_id = ?";
                    PreparedStatement psItems = con.prepareStatement(sqlItems);
                    psItems.setInt(1, invoiceId);
                    ResultSet rsItems = psItems.executeQuery();

                    while (rsItems.next()) {
                        JsonObject item = new JsonObject();
                        item.addProperty("itemId", rsItems.getInt("item_id"));
                        item.addProperty("qty", rsItems.getInt("quantity"));
                        item.addProperty("price", rsItems.getDouble("price"));
                        rows.add(item);
                    }
                    invoiceData.add("rows", rows);
                    out.print(invoiceData);
                }
            } else {
                JsonArray invoiceArray = new JsonArray();
                String sql = "SELECT i.id, c.name AS customer_name, i.invoice_date, i.total_amount FROM invoices i JOIN customers c ON i.customer_id = c.id ORDER BY i.id DESC";
                PreparedStatement ps = con.prepareStatement(sql);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    JsonObject obj = new JsonObject();
                    obj.addProperty("id", rs.getInt("id"));
                    obj.addProperty("customerName", rs.getString("customer_name"));
                    obj.addProperty("invoiceDate", rs.getDate("invoice_date").toString());
                    obj.addProperty("totalAmount", rs.getDouble("total_amount"));
                    invoiceArray.add(obj);
                }
                out.print(invoiceArray);
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(500);
        }

    }
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {
            con.setAutoCommit(false);
            JsonObject json = JsonParser.parseReader(request.getReader()).getAsJsonObject();

            int invoiceId = json.get("id").getAsInt();
            int customerId = json.get("customerId").getAsInt();
            JsonArray rows = json.getAsJsonArray("rows");

            double totalAmount = 0;
            for (JsonElement e : rows) {
                JsonObject row = e.getAsJsonObject();
                totalAmount += row.get("qty").getAsInt() * row.get("price").getAsDouble();
            }

            String updateInvoiceSql = "UPDATE invoices SET customer_id = ?, total_amount = ? WHERE id = ?";
            PreparedStatement updateStmt = con.prepareStatement(updateInvoiceSql);
            updateStmt.setInt(1, customerId);
            updateStmt.setDouble(2, totalAmount);
            updateStmt.setInt(3, invoiceId);
            updateStmt.executeUpdate();

            String deleteItemsSql = "DELETE FROM invoice_items WHERE invoice_id = ?";
            PreparedStatement deleteStmt = con.prepareStatement(deleteItemsSql);
            deleteStmt.setInt(1, invoiceId);
            deleteStmt.executeUpdate();

            String insertItemsSql = "INSERT INTO invoice_items(invoice_id, item_id, quantity, price) VALUES (?,?,?,?)";
            PreparedStatement itemStmt = con.prepareStatement(insertItemsSql);
            for (JsonElement e : rows) {
                JsonObject row = e.getAsJsonObject();
                itemStmt.setInt(1, invoiceId);
                itemStmt.setInt(2, row.get("itemId").getAsInt());
                itemStmt.setInt(3, row.get("qty").getAsInt());
                itemStmt.setDouble(4, row.get("price").getAsDouble());
                itemStmt.addBatch();
            }
            itemStmt.executeBatch();

            con.commit();
            out.print("{\"success\":true, \"message\":\"Invoice updated\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\":false, \"error\":\"" + e.getMessage() + "\"}");
        }
    }
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String idParam = request.getParameter("id");

        if (idParam == null) {
            response.setStatus(400);
            out.print("{\"success\":false, \"message\":\"Missing invoice ID\"}");
            return;
        }

        try (Connection con = DBConnection.getConnection()) {
            con.setAutoCommit(false);
            int invoiceId = Integer.parseInt(idParam);

            String deleteItemsSql = "DELETE FROM invoice_items WHERE invoice_id = ?";
            PreparedStatement itemStmt = con.prepareStatement(deleteItemsSql);
            itemStmt.setInt(1, invoiceId);
            itemStmt.executeUpdate();

            String deleteInvoiceSql = "DELETE FROM invoices WHERE id = ?";
            PreparedStatement invoiceStmt = con.prepareStatement(deleteInvoiceSql);
            invoiceStmt.setInt(1, invoiceId);
            int affectedRows = invoiceStmt.executeUpdate();

            if (affectedRows > 0) {
                con.commit();
                out.print("{\"success\":true, \"message\":\"Invoice deleted\"}");
            } else {
                con.rollback();
                response.setStatus(404);
                out.print("{\"success\":false, \"message\":\"Invoice not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\":false}");
        }
    }
}