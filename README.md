# Kubiyakubi DVD Bouncer

![Kubiyakubi](kubiyakubi.png)

kubiyakubi.pngを使用したDVDバウンシングアニメーションのウェブアプリです。四隅に当たるとゲーミング発光エフェクトが発動します！

## 🎮 機能

- **DVDバウンシング**: kubiyakubi.pngが画面内を跳ね回る
- **ゲーミング発光**: 四隅に当たると派手な発光エフェクト
- **レインボー背景**: コーナーヒット時の背景エフェクト
- **効果音**: コーナーヒット時の音響エフェクト（Web Audio API）
- **カラー変更**: 壁に当たるごとに色が変わる
- **スピード調整**: 複数の速度設定
- **レスポンシブ**: モバイル対応

## 🚀 デプロイ手順

### 1. 前提条件
- Node.js（v16以上）
- npm または yarn
- Cloudflareアカウント

### 2. セットアップ
```bash
# 依存関係をインストール
npm install

# Wranglerにログイン
npx wrangler login
```

### 3. 画像の設定
現在のworker.jsファイルでは、kubiyakubi.pngの配信部分がプレースホルダーになっています。実際にデプロイする際は、以下のいずれかの方法で画像を配信する必要があります：

#### オプション A: Base64エンコード（簡単）
```bash
# 画像をBase64エンコード
base64 kubiyakubi.png > kubiyakubi.base64
```

その後、worker.jsの`getImage()`関数を以下のように修正：
```javascript
async function getImage() {
  const base64Data = "data:image/png;base64,YOUR_BASE64_DATA_HERE";
  const response = await fetch(base64Data);
  return response.arrayBuffer();
}
```

#### オプション B: Cloudflare R2（推奨）
```bash
# R2バケット作成
npx wrangler r2 bucket create kubiyakubi-assets

# 画像アップロード
npx wrangler r2 object put kubiyakubi-assets/kubiyakubi.png --file=kubiyakubi.png
```

その後、wrangler.tomlに以下を追加：
```toml
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "kubiyakubi-assets"
```

worker.jsの`getImage()`関数を修正：
```javascript
async function getImage() {
  const object = await ASSETS.get("kubiyakubi.png");
  return object.arrayBuffer();
}
```

### 4. デプロイ
```bash
# 開発環境でテスト
npm run dev

# 本番環境にデプロイ
npm run deploy
```

## 🎯 操作方法

### PC
- **スペースキー**: リセット
- **上矢印キー**: スピード変更
- **Rキー**: リセット
- **ダブルクリック**: フルスクリーン切り替え

### モバイル
- **2本指タッチ**: リセット
- **ダブルタップ**: フルスクリーン切り替え

### ボタン
- **リセットボタン**: アニメーションをリセット
- **スピード変更ボタン**: スピード切り替え（0.5x～5x）

## 🌈 エフェクト

- **壁衝突**: 色が変わる
- **四隅ヒット**: 
  - ゲーミング発光エフェクト（1秒間）
  - レインボー背景回転
  - 効果音再生
  - スコアカウンター増加

## 🛠 カスタマイズ

### スピード変更
```javascript
const speeds = [0.5, 1, 1.5, 2, 3, 4, 5]; // 好きな速度を追加
```

### 色の変更
```javascript
this.colors = [
    '#ff0000', '#ff8000', '#ffff00', // お好みの色に変更
    // ...
];
```

### エフェクト時間の調整
```javascript
setTimeout(() => {
    // エフェクト解除
}, 1000); // ミリ秒で調整
```

## 📝 ファイル構成

```
├── index.html          # メインHTML
├── styles.css          # スタイルシート
├── script.js           # メインJavaScript
├── worker.js           # Cloudflare Workers スクリプト
├── wrangler.toml       # Wrangler設定
├── package.json        # npm設定
├── kubiyakubi.png      # アニメーション画像
└── README.md           # このファイル
```

## 🎨 技術詳細

- **フレームワーク**: バニラJavaScript
- **アニメーション**: requestAnimationFrame
- **音響**: Web Audio API
- **デプロイ**: Cloudflare Workers
- **レスポンシブ**: CSS Media Queries

## 🐛 トラブルシューティング

### 画像が表示されない
- worker.jsの`getImage()`関数が正しく実装されているか確認
- Base64データまたはR2設定が正しいか確認

### 音が出ない
- ブラウザの自動再生ポリシーにより、最初にユーザーインタラクションが必要
- ボタンをクリックしてからお試しください

### アニメーションがカクつく
- デバイスの性能に依存する場合があります
- スピードを下げてお試しください

## 📄 ライセンス

MIT License

## 🎉 楽しみ方

四隅に当たる瞬間を狙って見ているだけでも楽しいですが、なかなか当たらないのがこのアプリの醍醐味です！コーナーヒット数を競って友達と楽しんでください🎮 