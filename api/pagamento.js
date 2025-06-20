const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN, // nunca coloque o token direto no código!
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { valor, descricao } = req.body;

  try {
    const preference = {
      items: [
        {
          title: descricao,
          unit_price: Number(valor),
          quantity: 1,
        },
      ],
      back_urls: {
        success: "seuapp://pagamento-sucesso",
        failure: "seuapp://pagamento-falha",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    return res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
};