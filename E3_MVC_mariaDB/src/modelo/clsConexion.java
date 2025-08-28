/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo;

import java.sql.Connection;
import java.sql.DriverManager;
import javax.swing.JOptionPane;

/**
 *
 * @author Hp
 */
public class clsConexion {
    Connection conectar;

    public Connection getConectar() {
        String url= "jdbc:mysql://localhost:3306/dbSistema";
        String usr= "root";
        String Pass= "";
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conectar = DriverManager.getConnection(url, usr, Pass);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
        return conectar;
    }
}
