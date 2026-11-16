using System.Globalization;
using MySql.Data.MySqlClient;

namespace EmerichBurger.Admin;

public partial class Form1 : Form
{
    private const string ConexaoMySql =
        "Server=localhost;Port=3306;Database=emerich_burger;Uid=root;Pwd=SUA_SENHA;";

    public Form1()
    {
        InitializeComponent();
    }

    private void btnLimpar_Click(object sender, EventArgs e)
    {
        LimparCampos();
    }

    private void btnAdicionar_Click(object sender, EventArgs e)
    {
        string nome = txtNome.Text.Trim();
        string categoria = cboCategoria.Text.Trim();

        if (nome.Length < 2)
        {
            Aviso("Informe o nome do produto.");
            txtNome.Focus();
            return;
        }

        if (!TentarLerPreco(txtPreco.Text, out decimal preco) || preco <= 0)
        {
            Aviso("Informe um preço válido, por exemplo 39,99.");
            txtPreco.Focus();
            return;
        }

        if (categoria.Length == 0)
        {
            Aviso("Informe a categoria do produto.");
            cboCategoria.Focus();
            return;
        }

        try
        {
            using var conexao = new MySqlConnection(ConexaoMySql);
            conexao.Open();

            using var comando = new MySqlCommand(
                "INSERT INTO produtos (nome, preco, categoria) VALUES (@nome, @preco, @categoria)",
                conexao);

            comando.Parameters.AddWithValue("@nome", nome);
            comando.Parameters.AddWithValue("@preco", preco);
            comando.Parameters.AddWithValue("@categoria", categoria);
            comando.ExecuteNonQuery();

            MessageBox.Show(
                "Produto adicionado com sucesso!",
                "Emerich Burger",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);

            LimparCampos();
        }
        catch (MySqlException erro)
        {
            MessageBox.Show(
                "Não foi possível salvar no MySQL:\n" + erro.Message,
                "Erro",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
        }
    }

    private static bool TentarLerPreco(string valor, out decimal preco)
    {
        string texto = valor.Replace("R$", "").Trim();

        CultureInfo cultura = texto.Contains(',')
            ? new CultureInfo("pt-BR")
            : CultureInfo.InvariantCulture;

        bool ok = decimal.TryParse(texto, NumberStyles.Number, cultura, out preco);
        preco = Math.Round(preco, 2);

        return ok;
    }

    private void LimparCampos()
    {
        txtNome.Clear();
        txtPreco.Clear();
        cboCategoria.SelectedIndex = -1;
        cboCategoria.Text = "";
        txtNome.Focus();
    }

    private static void Aviso(string texto)
    {
        MessageBox.Show(
            texto,
            "Atenção",
            MessageBoxButtons.OK,
            MessageBoxIcon.Warning);
    }
}
