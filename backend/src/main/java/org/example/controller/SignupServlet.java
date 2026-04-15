package org.example.controller;

import com.google.gson.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.example.util.DBConnection;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/api/signup")
public class SignupServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        try (Connection con = DBConnection.getConnection()) {
            JsonObject json = JsonParser.parseReader(request.getReader()).getAsJsonObject();
            String user = json.get("name").getAsString();
            String email = json.get("email").getAsString();
            String pass = json.get("password").getAsString(); // Note: In real apps, hash this password!

            String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, user);
            ps.setString(2, email);
            ps.setString(3, pass);
            
            ps.executeUpdate();
            out.print("{\"success\":true}");
        } catch (Exception e) {
            response.setStatus(500);
            out.print("{\"success\":false}");
        }
    }
}