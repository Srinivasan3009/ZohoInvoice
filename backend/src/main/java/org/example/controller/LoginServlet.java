package org.example.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {

            BufferedReader reader = request.getReader();
            JsonObject json =
                    JsonParser.parseReader(reader).getAsJsonObject();

            String email = json.get("email").getAsString();
            String password = json.get("password").getAsString();

            String sql =
                    "SELECT id FROM users WHERE email=? AND password=?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, email);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                out.print("{\"success\":true}");
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print("{\"success\":false,\"message\":\"Invalid credentials\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.print(e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false,\"message\":\"Server error\"}");
        }

        out.flush();
    }
}