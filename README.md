# GitHub 上でのリアクションを Slack に通知する

[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)

自分が作った Issue・Pull Request や自分のコメントに対して、GitHub での絵文字リアクションが付いたら、Slack に通知を飛ばしたい。

例: 「このコメントに :smile: リアクションがありました。」

## 必要な準備

### 1. GitHub Personal Access Token の取得

1. GitHub の Settings > Developer settings > Personal access tokens へアクセス
2. 「Generate new token」をクリック
3. 以下のスコープを選択：
   - `repo` (プライベートリポジトリを含む場合)
   - `public_repo` (パブリックリポジトリのみの場合)
4. トークンを生成してコピー

### 2. Slack Webhook URL の取得

1. Slack App Directory で「Incoming Webhooks」を検索
2. ワークスペースに追加
3. 通知を送信したいチャンネルを選択
4. Webhook URL をコピー

## セットアップ手順

### 1. Google Apps Script プロジェクトの作成

1. [Google Apps Script](https://script.google.com) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名を「GitHub Reaction Notifier」などに変更

### 2. コードのデプロイ

1. 依存関係をインストール：

   ```bash
   npm install
   ```

2. Google Apps Script プロジェクトを作成し、Script ID を取得

3. `.clasp.json`ファイルを作成（`.clasp.json.example`をコピー）：

   ```bash
   cp .clasp.json.example .clasp.json
   ```

4. `.clasp.json`ファイルの`scriptId`を実際のScript IDに更新：

   ```json
   {
     "scriptId": "YOUR_ACTUAL_SCRIPT_ID",
     "rootDir": "./dist"
   }
   ```

5. clasp でログイン：

   ```bash
   npx clasp login
   ```

6. TypeScript をビルドしてデプロイ：
   ```bash
   npm run deploy
   ```

### 開発環境での作業

#### ローカルでの開発

1. TypeScript のビルド：

   ```bash
   npm run build
   ```

2. ファイル変更を監視してビルド：

   ```bash
   npm run watch
   ```

3. リンターの実行：

   ```bash
   npm run lint
   ```

4. テストの実行：
   ```bash
   npm test
   ```

#### ファイル構成

- `src/`: TypeScript ソースファイル
  - `main.ts`: メイン処理
  - `github.ts`: GitHub API 関連
  - `slack.ts`: Slack 通知関連
  - `setup.ts`: 初期設定とトリガー管理
  - `types.ts`: 型定義
- `dist/`: ビルド済み JavaScript ファイル（clasp でデプロイされる）
- `test/`: テストファイル

### 3. スクリプトプロパティの設定

1. GAS エディタで `setupScriptProperties()` 関数を実行
2. プロジェクトの設定 > スクリプト プロパティ で以下を設定：
   - `GITHUB_TOKEN`: 取得した GitHub Personal Access Token
   - `SLACK_WEBHOOK_URL`: 取得した Slack Webhook URL
   - `GITHUB_USERNAME`: あなたの GitHub ユーザー名

### 4. 定期実行の設定

1. GAS エディタで `createTimeTrigger()` 関数を実行
2. 60 分ごとに自動実行されるようになります

## 動作確認

1. GitHub で自分の Issue や PR にリアクションをつけてもらう
2. 60 分以内に Slack に通知が来ることを確認

## トラブルシューティング

### 通知が来ない場合

1. GAS の実行ログを確認（表示 > ログ）
2. スクリプトプロパティが正しく設定されているか確認
3. GitHub Token と Slack Webhook URL が有効か確認

### エラーが出る場合

- GitHub API の rate limit に達している可能性があります
- トークンの権限が不足している可能性があります

### TypeScript/clasp 関連のエラー

#### ビルドエラーが出る場合

1. 型定義の問題：`npm run build` でエラーが出る場合、型定義ファイルが正しく配置されているか確認
2. 依存関係の問題：`npm install` で依存関係を再インストール

#### デプロイエラーが出る場合

1. clasp の認証：`npx clasp login` で再ログイン
2. Script ID の確認：`.clasp.json` の `scriptId` が正しいか確認
3. ビルドファイルの確認：`dist/` ディレクトリにビルド済みファイルがあるか確認

## GitHub Actions

### CI/CD パイプライン

このプロジェクトでは以下のGitHub Actionsワークフローが設定されています：

#### 1. CI（継続的インテグレーション）

**トリガー**: Pull Request作成時、mainまたはdevelopブランチへのPush時

- コードフォーマットチェック
- ESLintによる静的解析
- Jestによるテスト実行
- TypeScriptのビルド
- 型チェック
- セキュリティ監査

#### 2. デプロイ

**トリガー**: mainブランチへのPush時、手動実行

- テスト実行
- TypeScriptビルド
- Google Apps Scriptへのデプロイ
- デプロイタグの作成

#### 3. PR管理

**トリガー**: Pull Request作成・更新時

- 自動ラベル付与
- マージコンフリクトチェック

### 自動デプロイの設定

#### 前提条件

1. GitHub リポジトリにコードをプッシュ
2. Google Apps Script プロジェクトを作成し、Script ID を取得

#### 設定手順

1. GitHub リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定：
   - `CLASPRC_JSON`: clasp の認証情報（`~/.clasprc.json`の内容）
   - `CLASP_JSON`: プロジェクト設定（`.clasp.json`の内容、実際の Script ID を含む）

2. `.clasprc.json`の取得方法：

   ```bash
   npx clasp login
   cat ~/.clasprc.json
   ```

3. `.clasp.json`の設定例：

   ```json
   {
     "scriptId": "YOUR_ACTUAL_SCRIPT_ID",
     "rootDir": "./dist"
   }
   ```

4. main ブランチにプッシュすると自動的にテスト・ビルド・デプロイが実行されます

## 利用可能なコマンド

| コマンド           | 説明                                                 |
| ------------------ | ---------------------------------------------------- |
| `npm run build`    | TypeScript をビルドして `dist/` に出力               |
| `npm run watch`    | ファイル変更を監視して自動ビルド                     |
| `npm run push`     | clasp でファイルを Google Apps Script にアップロード |
| `npm run deploy`   | ビルド後に clasp でデプロイ                          |
| `npm run lint`     | ESLint でコードをチェック                            |
| `npm run lint:fix` | ESLint でコードを自動修正                            |
| `npm test`         | Jest でテストを実行                                  |

## カスタマイズ

### 通知間隔の変更

`setup.ts`の`createTimeTrigger()` 関数内の `.everyHours(1)` を変更：

- `.everyMinutes(10)`: 10 分ごと
- `.everyMinutes(30)`: 30 分ごと
- `.everyHours(2)`: 2 時間ごと

### 通知対象の変更

`github.ts`の`fetchUserIssuesAndPRs()` 関数内の検索クエリを変更することで、通知対象を調整できます。
