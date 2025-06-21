import { MercadoPagoConfig } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const body = req.body;

  try {
    const preference = await client.preference.create({
      body: {
        items: [
          {
            title: body.title,
            quantity: 1,
            unit_price: Number(body.price),
          },
        ],
      },
    });

    return res.status(200).json({ init_point: preference.init_point });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar preferência" });
  }
}
