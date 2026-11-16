namespace EmerichBurger.Admin;

partial class Form1
{
    private System.ComponentModel.IContainer components = null;

    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }

        base.Dispose(disposing);
    }

    private void InitializeComponent()
    {
        lblNome = new Label();
        txtNome = new TextBox();
        lblPreco = new Label();
        txtPreco = new TextBox();
        lblCategoria = new Label();
        cboCategoria = new ComboBox();
        btnLimpar = new Button();
        btnAdicionar = new Button();
        SuspendLayout();

        lblNome.AutoSize = true;
        lblNome.Location = new Point(20, 20);
        lblNome.Name = "lblNome";
        lblNome.Text = "Nome do produto";

        txtNome.Location = new Point(20, 44);
        txtNome.MaxLength = 100;
        txtNome.Name = "txtNome";
        txtNome.Size = new Size(380, 30);
        txtNome.TabIndex = 0;

        lblPreco.AutoSize = true;
        lblPreco.Location = new Point(20, 88);
        lblPreco.Name = "lblPreco";
        lblPreco.Text = "Preço (R$)";

        txtPreco.Location = new Point(20, 112);
        txtPreco.MaxLength = 12;
        txtPreco.Name = "txtPreco";
        txtPreco.Size = new Size(180, 30);
        txtPreco.TabIndex = 1;

        lblCategoria.AutoSize = true;
        lblCategoria.Location = new Point(20, 156);
        lblCategoria.Name = "lblCategoria";
        lblCategoria.Text = "Categoria";

        cboCategoria.DropDownStyle = ComboBoxStyle.DropDown;
        cboCategoria.Items.AddRange(new object[] { "Hambúrguer", "Acompanhamento", "Bebida", "Sobremesa" });
        cboCategoria.Location = new Point(20, 180);
        cboCategoria.MaxLength = 50;
        cboCategoria.Name = "cboCategoria";
        cboCategoria.Size = new Size(380, 31);
        cboCategoria.TabIndex = 2;

        btnLimpar.Location = new Point(20, 235);
        btnLimpar.Name = "btnLimpar";
        btnLimpar.Size = new Size(130, 40);
        btnLimpar.TabIndex = 3;
        btnLimpar.Text = "Limpar tudo";
        btnLimpar.UseVisualStyleBackColor = true;
        btnLimpar.Click += btnLimpar_Click;

        btnAdicionar.Location = new Point(270, 235);
        btnAdicionar.Name = "btnAdicionar";
        btnAdicionar.Size = new Size(130, 40);
        btnAdicionar.TabIndex = 4;
        btnAdicionar.Text = "Adicionar";
        btnAdicionar.UseVisualStyleBackColor = true;
        btnAdicionar.Click += btnAdicionar_Click;

        AcceptButton = btnAdicionar;
        AutoScaleDimensions = new SizeF(8F, 20F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new Size(420, 295);
        Controls.Add(lblNome);
        Controls.Add(txtNome);
        Controls.Add(lblPreco);
        Controls.Add(txtPreco);
        Controls.Add(lblCategoria);
        Controls.Add(cboCategoria);
        Controls.Add(btnLimpar);
        Controls.Add(btnAdicionar);
        Font = new Font("Segoe UI", 10F);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        Name = "Form1";
        StartPosition = FormStartPosition.CenterScreen;
        Text = "Emerich Burger - Cadastro de Produtos";
        ResumeLayout(false);
        PerformLayout();
    }

    private Label lblNome;
    private TextBox txtNome;
    private Label lblPreco;
    private TextBox txtPreco;
    private Label lblCategoria;
    private ComboBox cboCategoria;
    private Button btnLimpar;
    private Button btnAdicionar;
}
