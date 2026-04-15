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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;

@WebServlet("/api/items")
public class ItemsServlet extends HttpServlet {

    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        PrintWriter out = response.getWriter();
        JsonArray itemsArray = new JsonArray();
        String userId = request.getParameter("userId");

        try (Connection con = DBConnection.getConnection()) {
            String sql;
            PreparedStatement ps;

            if (userId != null && !userId.isEmpty()) {
                sql = "SELECT * FROM items WHERE user_id = ?";
                ps = con.prepareStatement(sql);
                ps.setInt(1, Integer.parseInt(userId));
            } else {
                sql = "SELECT * FROM items WHERE user_id = -1";
                ps = con.prepareStatement(sql);
            }

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JsonObject item = new JsonObject();
                item.addProperty("id", rs.getInt("id"));
                item.addProperty("name", rs.getString("name"));
                item.addProperty("description", rs.getString("description"));
                item.addProperty("price", rs.getDouble("price"));
                itemsArray.add(item);
            }

            out.print(itemsArray.toString());
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"error\":\"Internal Server Error\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {

            BufferedReader reader = request.getReader();

            Map<String, String> data =
                    gson.fromJson(reader, Map.class);
            String name = data.get("name");
            String description = data.get("description");
            String price = data.get("price");
            String userIdStr = data.get("userId");
            String sql =
                    "INSERT INTO items(name, description, price,user_id) VALUES(?,?,?,?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, name);
            ps.setString(2, description);
            ps.setDouble(3, Double.parseDouble(price));
            ps.setInt(4, Integer.parseInt(userIdStr));

            ps.executeUpdate();

            out.print("{\"success\": true}");

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\": false}");
        }
    }
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws  IOException {

        setCors(response);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {
            BufferedReader reader = request.getReader();
            JsonObject json = com.google.gson.JsonParser.parseReader(reader).getAsJsonObject();

            int id = json.get("id").getAsInt();
            String name = json.get("name").getAsString();
            String description = json.get("description").getAsString();
            double price = json.get("price").getAsDouble();

            String sql = "UPDATE items SET name=?, description=?, price=? WHERE id=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, name);
            ps.setString(2, description);
            ps.setDouble(3, price);
            ps.setInt(4, id);

            int rows = ps.executeUpdate();
            if (rows > 0) {
                out.print("{\"success\":true, \"message\":\"Item updated\"}");
            } else {
                response.setStatus(404);
                out.print("{\"success\":false, \"message\":\"Item not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\":false}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        setCors(response);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String idParam = request.getParameter("id");

        if (idParam == null) {
            response.setStatus(400);
            out.print("{\"success\":false, \"message\":\"ID required\"}");
            return;
        }

        try (Connection con = DBConnection.getConnection()) {
            int id = Integer.parseInt(idParam);
            String sql = "DELETE FROM items WHERE id=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, id);

            int rows = ps.executeUpdate();
            if (rows > 0) {
                out.print("{\"success\":true, \"message\":\"Item deleted\"}");
            } else {
                response.setStatus(404);
                out.print("{\"success\":false}");
            }

        } catch (java.sql.SQLIntegrityConstraintViolationException e) {
            response.setStatus(409);
            out.print("{\"success\":false, \"message\":\"Cannot delete item: It is linked to an invoice.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"success\":false}");
        }
    }

    private void setCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

}
