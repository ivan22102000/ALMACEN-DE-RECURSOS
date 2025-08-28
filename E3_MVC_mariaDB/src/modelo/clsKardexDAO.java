
package modelo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class clsKardexDAO {
    //operaciones BD
    clsConexion conectar = new clsConexion();
    Connection con;
    PreparedStatement ps;
    ResultSet rs;
    
    public  List<clsKardex> listarDAO()//Read
    {
        List<clsKardex> listaDatos = new ArrayList<>();
        String sql= "SELECT IdKardex, Curso, Semestre, Nota FROM Kardex";
        try {
            con = conectar.getConectar();
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            while (rs.next()) {                
                clsKardex oC = new clsKardex();
                oC.setIdKardex(rs.getInt(1));
                oC.setCurso(rs.getString(2));
                oC.setSemestre(rs.getInt(3));
                oC.setNota(rs.getInt(4));
                listaDatos.add(oC);
            }
        } catch (Exception e) {
        }
         return  listaDatos;
    }
    
    public int AgregarDAO(clsKardex poC)//Create
    {
        String sql= "INSERT INTO Kardex (Curso, Semestre, Nota) VALUES (?, ?, ?)";
        try {
            con = conectar.getConectar();
            ps = con.prepareStatement(sql);
            ps.setString(1, poC.getCurso());
            ps.setInt(2, poC.getSemestre());
            ps.setInt(3, poC.getNota());
            ps.executeUpdate();
            
        } catch (Exception e) {
        }
        return 1;
    }
    
    public int ModificarDAO(clsKardex poC)//Update
    {
        int res = 0;
        String sql = "UPDATE Kardex SET Curso=?, Semestre=?, Nota=? WHERE IdKardex = ?";
        try {
            con = conectar.getConectar();
            ps = con.prepareStatement(sql);
            ps.setString(1, poC.getCurso());
            ps.setInt(2, poC.getSemestre());
            ps.setInt(3, poC.getNota());
            ps.setInt(4, poC.getIdKardex());
            res = ps.executeUpdate();
        } catch (Exception e) {
        }
        return res;
    }
    
    public void EliminarDAO(int pIKardex)//Delete
    {
        String sql = "DELETE FROM Kardex WHERE IdKardex = "+ pIKardex;
        try {
            con = conectar.getConectar();
            ps= con.prepareStatement(sql);
            ps.executeUpdate();
        } catch (Exception e) {
        }   
    }
    
}
