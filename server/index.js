require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
} = require('plaid');

const app = express();
app.use(cors());
app.use(express.json());

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV ?? 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

// ── Create link token ─────────────────────────────────────────────────────────
app.post('/api/create-link-token', async (req, res) => {
  try {
    const { data } = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.body.userId ?? 'fina-user-001' },
      client_name: 'Fina',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    res.json({ link_token: data.link_token });
  } catch (err) {
    console.error(err.response?.data ?? err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Exchange public token → access token ──────────────────────────────────────
app.post('/api/exchange-token', async (req, res) => {
  try {
    const { data } = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    res.json({ access_token: data.access_token, item_id: data.item_id });
  } catch (err) {
    console.error(err.response?.data ?? err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Get account balances ──────────────────────────────────────────────────────
app.post('/api/accounts', async (req, res) => {
  try {
    const { data } = await plaidClient.accountsGet({
      access_token: req.body.access_token,
    });
    res.json({ accounts: data.accounts });
  } catch (err) {
    console.error(err.response?.data ?? err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Fetch last 30 days of transactions ───────────────────────────────────────
app.post('/api/transactions', async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 30);

    const { data } = await plaidClient.transactionsGet({
      access_token: req.body.access_token,
      start_date: start.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
    });
    res.json({ transactions: data.transactions, accounts: data.accounts });
  } catch (err) {
    console.error(err.response?.data ?? err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fina server listening on :${PORT}  [${process.env.PLAID_ENV ?? 'sandbox'}]`);
});
