package modelo;

public class clsKardex {
    public int IdKardex;
    public String Curso;
    public int Semestre;
    public int Nota;
    
    public clsKardex( ) {
        this.IdKardex = 0;
        this.Curso = "";
        this.Semestre = 0;
        this.Nota = 0;
    }

    public clsKardex(int IdKardex, String Curso, int Semestre, int Nota) {
        this.IdKardex = IdKardex;
        this.Curso = Curso;
        this.Semestre = Semestre;
        this.Nota = Nota;
    }

    public int getIdKardex() {
        return IdKardex;
    }

    public void setIdKardex(int IdKardex) {
        this.IdKardex = IdKardex;
    }

    public String getCurso() {
        return Curso;
    }

    public void setCurso(String Curso) {
        this.Curso = Curso;
    }

    public int getSemestre() {
        return Semestre;
    }

    public void setSemestre(int Semestre) {
        this.Semestre = Semestre;
    }

    public int getNota() {
        return Nota;
    }

    public void setNota(int Nota) {
        this.Nota = Nota;
    }
}
