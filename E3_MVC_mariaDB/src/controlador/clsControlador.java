
package controlador;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.List;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import modelo.clsKardex;
import modelo.clsKardexDAO;
import vista.frmVista;

public class clsControlador implements ActionListener, MouseListener{
    clsKardex oC = new clsKardex();
    clsKardexDAO dao = new clsKardexDAO();
    frmVista vista = new frmVista();
    DefaultTableModel modelo = new DefaultTableModel();
    
    public clsControlador(frmVista pVista) {
        this.vista =pVista;
        this.vista.btnNuevo.addActionListener(this);
        this.vista.btnAgregar.addActionListener(this);
        this.vista.btnModificar.addActionListener(this);
        this.vista.btnEliminar.addActionListener(this);
        this.vista.btnListar.addActionListener(this);
        this.vista.btnSalir.addActionListener(this);
        this.vista.tabla.addMouseListener(this);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if(e.getSource() == vista.btnNuevo){
            vista.txtIdKardex.setText("--");
            vista.txtCurso.setText("**");
            vista.txtSemestre.setText("??");
            vista.txtNota.setText("---");
        }
        if(e.getSource() == vista.btnListar){
            limpiarTabla();
            listar(vista.tabla);
        }
        
        if(e.getSource() == vista.btnAgregar){
            agregar();
            limpiarTabla();
            listar(vista.tabla);
            vista.txtCurso.setText("");
            vista.txtSemestre.setText("");
            vista.txtNota.setText("");
        }
        if(e.getSource() == vista.btnModificar){
            Modificar();
            limpiarTabla();
            listar(vista.tabla);
            
        }
        if(e.getSource() == vista.btnEliminar){
            eliminar();
            limpiarTabla();
            listar(vista.tabla);
        }
        if(e.getSource() == vista.btnSalir){
            int nOpcion = 0;
            nOpcion = JOptionPane.showConfirmDialog(null,"Seguro de Salir", "Confimar", JOptionPane.YES_OPTION, JOptionPane.QUESTION_MESSAGE);
            if(nOpcion ==JOptionPane.YES_OPTION){
                System.exit(0);
            }
        }
            
    }

    private void agregar() {
       String cCurso = vista.txtCurso.getText();
       int nSemestre = Integer.parseInt(vista.txtSemestre.getText());
       int dNota = Integer.parseInt(vista.txtNota.getText());
       oC.setCurso(cCurso);
       oC.setSemestre(nSemestre);
       oC.setNota(dNota);
       int nRes = dao.AgregarDAO(oC);
        if (nRes == 1) {
            JOptionPane.showMessageDialog(vista,"Rgistro agregado con EXITO");
        }else{
            JOptionPane.showMessageDialog(vista,"ERROR: al agregado registro");
        }
    }
    private void Modificar() {
         int nIdKardex = Integer.parseInt(vista.txtIdKardex.getText());
         String cCurso = vista.txtCurso.getText();
         String cSemestre = vista.txtSemestre.getText();
         String cNota = vista.txtNota.getText();
         oC.setIdKardex(nIdKardex);
         oC.setCurso(cCurso);
         oC.setSemestre(Integer.parseInt(cSemestre));
         oC.setNota(Integer.parseInt(cNota));
         int nRes = dao.ModificarDAO(oC);
         if(nRes == 1){
             JOptionPane.showMessageDialog(vista, "Registro modificado EXITOSAMEMTE");
         }else{
             JOptionPane.showMessageDialog(vista, "ERROR: al modificar Registro");
         }
    }
    private void eliminar(){
        int nFila = vista.tabla.getSelectedRow();
        if(nFila == -1){
            JOptionPane.showMessageDialog(vista, "Seleciona una fila");
        }else{
            int nIdCuenta = Integer.parseInt((String)vista.tabla.getValueAt(nFila, 0).toString());
            dao.EliminarDAO(nIdCuenta);
            JOptionPane.showMessageDialog(vista,"Registro [ "+(nIdCuenta)+"]eliminar");
        }
   }


    private void limpiarTabla() {
     for(int i = 0; i < vista.tabla.getRowCount(); i++){
            modelo.removeRow(i);
            i = i -1;
         
     }
    }

    private void listar(JTable tabla) {
       modelo = (DefaultTableModel)tabla.getModel();
       List<clsKardex> listaKardex = dao.listarDAO();
       Object[] objeto = new Object[4];
        for (int i = 0; i < listaKardex.size() ; i++) {
            objeto[0] = listaKardex.get(i).getIdKardex();
            objeto[1] = listaKardex.get(i).getCurso();
            objeto[2] = listaKardex.get(i).getSemestre();
            objeto[3] = listaKardex.get(i).getNota();
            modelo.addRow(objeto);
        }
        vista.tabla.setModel(modelo);
        
       
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if(e.getSource() == vista.tabla){
            int nFila = vista.tabla.getSelectedRow();
            if(nFila == -1){
                JOptionPane.showMessageDialog(vista, "Elije una fila");
            }else{
                int nIdKardex = Integer.parseInt((String) vista.tabla.getValueAt(nFila, 0).toString());
                String cCurso = (String) vista.tabla.getValueAt(nFila, 1);
                int nSemestre = Integer.parseInt((String) vista.tabla.getValueAt(nFila, 2).toString());
                double dNota = Double.parseDouble((String)vista.tabla.getValueAt(nFila, 3).toString());
                vista.txtIdKardex.setText(""+nIdKardex);
                vista.txtCurso.setText(cCurso);
                vista.txtSemestre.setText(""+nSemestre);
                vista.txtNota.setText(""+dNota);
            }
        }
       
    }
    //hasta aqui

    @Override
    public void mousePressed(MouseEvent e) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void mouseEntered(MouseEvent e) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void mouseExited(MouseEvent e) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
