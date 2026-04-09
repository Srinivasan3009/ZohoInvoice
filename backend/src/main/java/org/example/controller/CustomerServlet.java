package org.example.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.example.util.DBConnection;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.Map;

@WebServlet("/api/customers")
public class CustomerServlet extends HttpServlet {

    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws IOException {

        setCors(response);
        response.setContentType("application/json");

        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {

            String sql = "SELECT * FROM customers ORDER BY id DESC";
            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            JsonArray customers = new JsonArray();

            while (rs.next()) {
                JsonObject c = new JsonObject();
                c.addProperty("id", rs.getInt("id"));
                c.addProperty("name", rs.getString("name"));
                c.addProperty("email", rs.getString("email"));
                c.addProperty("phone", rs.getString("phone"));
                c.addProperty("address", rs.getString("address"));

                customers.add(c);
            }

            out.print(customers);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        setCors(response);
        response.setContentType("application/json");

        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {

            BufferedReader reader = request.getReader();

            Map<String, String> data =
                    gson.fromJson(reader, Map.class);

            String name = data.get("name");
            String email = data.get("email");
            String phone = data.get("phone");
            String address = data.get("address");

            String sql =
                    "INSERT INTO customers(name,email,phone,address) VALUES(?,?,?,?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, phone);
            ps.setString(4, address);

            ps.executeUpdate();

            out.print("{\"success\":true}");

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\":false}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request,
                             HttpServletResponse response) {
        setCors(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(response);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {
            BufferedReader reader = request.getReader();
            JsonObject json = com.google.gson.JsonParser.parseReader(reader).getAsJsonObject();

            int id = json.get("id").getAsInt();
            String name = json.get("name").getAsString();
            String email = json.get("email").getAsString();
            String phone = json.get("phone").getAsString();
            String address = json.get("address").getAsString();

            String sql = "UPDATE customers SET name=?, email=?, phone=?, address=? WHERE id=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, phone);
            ps.setString(4, address);
            ps.setInt(5, id);

            int rowsAffected = ps.executeUpdate();

            if (rowsAffected > 0) {
                out.print("{\"success\":true, \"message\":\"Customer updated\"}");
            } else {
                response.setStatus(404);
                out.print("{\"success\":false, \"message\":\"Customer not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\":false}");
        }
    }
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(response);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String idParam = request.getParameter("id");

        if (idParam == null) {
            response.setStatus(400);
            out.print("{\"success\":false, \"message\":\"ID is required\"}");
            return;
        }

        try (Connection con = DBConnection.getConnection()) {
            int id = Integer.parseInt(idParam);
            String sql = "DELETE FROM customers WHERE id=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, id);

            int rowsAffected = ps.executeUpdate();

            if (rowsAffected > 0) {
                out.print("{\"success\":true, \"message\":\"Customer deleted\"}");
            } else {
                response.setStatus(404);
                out.print("{\"success\":false, \"message\":\"Customer not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\":false, \"error\":\"Check if customer has existing invoices\"}");
        }
    }

    private void setCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
