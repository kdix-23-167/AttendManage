const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// メモリ内で予約情報を保持するオブジェクト（本番環境ではデータベースの使用を推奨）
const reservations = {};

// 予約の作成エンドポイント
app.post('/reserve', (req, res) => {
    const { userId, password, seat } = req.body;
    if (!reservations[seat]) {
        reservations[seat] = { userId, password };
        res.status(200).json({ message: "予約が完了しました。" });
    } else {
        res.status(400).json({ message: "この座席は既に予約されています。" });
    }
});

// 予約のキャンセルエンドポイント
app.post('/cancel', (req, res) => {
    const { userId, password, seat } = req.body;
    if (reservations[seat] && reservations[seat].userId === userId && reservations[seat].password === password) {
        delete reservations[seat];
        res.status(200).json({ message: "予約が解除されました。" });
    } else {
        res.status(400).json({ message: "予約解除に失敗しました。" });
    }
});

// 予約情報を取得するエンドポイント
app.get('/reservations', (req, res) => {
    res.status(200).json(reservations);
});

// サーバーの起動
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



