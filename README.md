<div align="center" style="vertical-align: center;">
  <img src="https://cdn.rpaka.dev/icon/poica.png" height="80px" />
  <h1>POICA-WEB</h1>
  <h1>電子ポイントカード作成サービス</h1>
  <h2>フロントエンド</h2><br / >
  <img src="https://cdn.rpaka.dev/logo/nodejs.svg" height="80px" style="padding-right: 15px;" />
  <img src="https://cdn.rpaka.dev/logo/mysql.svg" height="80px" style="padding-right: 15px;" />
  <img src="https://cdn.rpaka.dev/logo/puppeteer.svg" height="80px" style="padding-right: 15px;" />
  <br / ><br / >
</div>

![動作イメージ](https://cdn.rpaka.dev/useimage/poica/0_top.png)

<div align="center" style="vertical-align: center;">
<a href="https://github.com/ritsu2891/POICA-WEB">POICA-WEB(フロントエンド)</a> | <b>POICA-CORE(バックエンド)</b>
</div>

<div align="center" style="vertical-align: center;">
<a href="https://poica.rpaka.dev">poica.rpaka.dev</a>（試験公開）
</div>

# 概要
電子ポイントカードを作成できるサービスです。ロゴ画像と配色でオリジナルデザインの電子ポイントカードを作成し、SNS等で共有することにより配布できます。現在はポイントの付与しかできませんが、ポイントを利用することもできるようにしたいと考えています。

# 背景・考え
PayPayやLINEペイ等のQRコード決済の登場によって電子決済が急速に普及しましたよね。便利に使ってるんですが、今まで現金という実物に価値を委ねていたのが画面上に表示される目には見えない電子的な値に委ねる形に変わって、価値を委ねるのに実物は必要ないんだなと言う事が認識させられました。つまり現金に価値があるのは、現金という対象に対して皆が価値がある物として認めているからであって別に実体がなくたって構わないという事ですよね。
別にお金じゃなくても似たような物があって、それはお店とかがやってる「ポイント」なんじゃないでしょうか。その店と店の利用者の間でのみ価値があるという認識があり、成り立っている物という見方が出来ます。ただ、ポイントはお金のように国全体で普遍的に価値が認められていないという「範囲」の違いでしかないのだと思います。

このように、価値を代替する存在としてのお金やポイントですが、あまり価値を代替する存在としての認識は薄いですよね。まぁ生活をしていくのに何の気なしに使ってるので、それも当然と思います。一方でこの「価値を代替する存在」という側面は興味深いところがあります。価値は目に見えませんが、価値を代替する存在たる現金やポイントは「数値として」はっきりと目に見える形にすることが出来ます。

上記のような考えの基、お店のような商業的な利用でなくとも、感謝や頑張りなどに感じた「価値」を目に見える形、すなわち「ポイント」で共有できれば･･･と思い、個人レベルでも簡単に利用できる電子ポイントカードサービスを作成したという次第であります。お金のような広範囲にはならずとも狭い範囲での経済圏ができるかもしれませんね。

**※POICAの機能は[POICA-WEB](https://github.com/ritsu2891/POICA-WEB)のREADMEで主に紹介します**

# 利用

本サービスは私の趣味のサービスですので、商用利用は想定しておりません。また、私以外の方がWEB上にサービスとして公開することは辞めてください。

本サービスはPOICA-WEB（フロントエンド）との利用を想定しています。

POICA-COREはPOICAのバックエンドプログラムです。DBへのデータの読み書きや認証・認可、OGP用画像の生成、REST APIの提供などを行います。

# 構成

## 動作環境
- Ubuntu 20.04 LTS
- Node.js v14.16.0
- npm 6.14.11
- MySQL 8.0.23

## 利用ライブラリ
- async-lock 1.2.4
- cookie-parser 1.4.5
- dotenv 8.2.0
- express 4.17.1
- express-session 1.17.1
- jest 25.5.1
- multer 1.4.2
- mustache-express 1.3.0
- mysql2 2.1.0
- passport 0.4.1
- passport-google-oauth 2.0.0
- puppeteer-core 3.0.4
- rand-token 1.0.1
- sequelize 5.21.7

REST APIの構築に**Express**、OAuth認証に**Passport**、ORMに**Sequelize**、単体テストに**Jest**を利用しています。**Puppeteer**はポイントカードのOGP画像生成用に使っています。

# 導入
(1) Node.js、MySQLを導入しPOICA-COREが読み書きする為のユーザを用意する。POICA-COREはデータベースを一つ使用するので、任意の名前のデータベースを作成してフルアクセス権限を与える。

(2) `config` > `.env.example` をコピーする。開発用は `.env.development`、本番環境用は `.env.production` という名前にする。


|項目|内容|例|
|---|---|---|
|DB_HOST|データベースのホスト|localhost|
|DB_NAME|データベース名|poica|
|DB_USER|MySQLユーザ名|root|
|DB_PSWD|MySQLパスワード|abcdefg12345|
|GOOGLE_CLIENT_ID|Google認証のClient ID|xxxxx.apps.googleusercontent.com
|GOOGLE_CLIENT_SECRET|Google認証のClient Secret|xxxxxxxxxxxxxxxxxxxxxxxx
|WEB_APP_FQDN|POICA-WEBのホスト名|localhost:3000|
|SELF_FQDN|POICA-COREのホスト名|localhost:4000|
|WEB_APP_URL|POICA-WEBのHTTP URL|http://localhost:3000|
|SELF_URL|POICA-COREのHTTP URL|http://localhost:4000|
|BROWSER_EXECUTABLE|Google Chromeの実行ファイルのパス|/usr/bin/google-chrome
|UPLOAD_PATH|アップロードされたファイルの格納パス|/opt/poica/uploads|

(3) アップロードフォルダの初期化のため `Setup.sh` を実行
```
$ zsh Setup.sh
```

(4) データベースの初期化のため `UpDB.sh` を実行
```
$ zsh UpDB.sh
```

# 実行
## 一時的に実行
```
$ zsh run.sh [stage]
```
`[stage]` には `development` (開発用) または `production` (本番用) を指定する

## UbuntuのServiceとして登録
`POICA-CORE.service` 内の `ExecStart` のパスを `run.sh` のフルパスに変更後以下を実行する。
```
$ zsh Install.sh
```

## テストの実行
導入の手順が全て終わっている状態で以下を実行
```
$ npm run test
```

# フォルダの説明
- `app` : アプリケーションを構成する中核的なプログラムが入っています
  - `api` : REST APIを定義し、HTTPリクエストの処理とレスポンスの生成を行うプログラムが入っています。アップロードファイルの処理などもここで行っています。
  - `controllers` : DBの読み書きを実行するプログラムが入っています。
  - `models` : ORMのモデルが入っています。
  - `views` : フロントの表示を定義するファイルが入っています。認証でのみ利用します。
- `config` : 設定ファイルとHTTPレスポンスを処理するExpressのミドルウェアが入っています。
- `test` : 単体テストが入っています。

# API定義
正直、あんまり綺麗じゃなくて分かりにくいですね。

|エンドポイント|メソッド|認証|内容|
|------------|------|---|---|
|/cards/list|GET|必要|ログイン中のユーザが所持しているポイントカードの一覧|
|/cards/add|POST|必要|ポイントカードを発行してログイン中のユーザが所持|
|/cards/remove|POST|必要|ログイン中のユーザが所持しているポイントカードを廃棄|
|/cardmasters/list|GET|必要|ログイン中のユーザが管理しているポイントカードの一覧|
|/cardmasters/add|POST|必要|ポイントカードを新規作成してログイン中のユーザを管理者にする|
|/cardmasters/remove|GET|必要|ログイン中のユーザが管理しているポイントカードを削除|
|/cardmasters/byID|GET|不要|ポイントカードをIDで検索|
|/cardmasters/byRegToken|GET|不要|ポイントカードを登録用トークンで検索|
|/point/give|POST|必要|ログイン中のユーザが管理しているポイントカードについてポイントを付与|
|/point/receive|POST|必要|ログイン中のユーザが所持しているポイントカードについてポイント付与トークンによりポイントを受け取る <<未使用>>|
|/user/checkIdDupl|POST|必要|設定しようとしているユーザIDが既に登録されていないかを確認|
|/user/myProfile|GET|必要|ログイン中のユーザのプロフィール情報を取得|
|/user/byUserId|GET|不要|ユーザIDでユーザを検索して情報を取得|
|/user/byDisplayName|GET|不要|表示名でユーザを検索して情報を取得|
|/auth/google|GET|不要|Google OAuth2認証の認可エンドポイントへ飛ばす|
|/auth/google/done|GET|不要|Google OAuth2認証完了のリダイレクト|

## 認証
HTTPリクエストヘッダ内の `X-POICA-Access-Token` を照合してログイン中のユーザを認証しています。`/auth/google/done` で[ウィンドウ間メッセージ](https://developer.mozilla.org/ja/docs/Web/API/Window/postMessage)により、Googleアカウントでの認証後に生成したトークンを渡しています。

# データベース定義
|テーブル名|内容|
|--------|----|
|CardMasters|ポイントカードのひな形|
|Card|発行されたポイントカード|
|Users|ユーザ|
|PointOpReq|ポイント操作要求 <<未使用>>|

# 課題
- ヘッドレスChromeの制御が適当なためか、OGP画像生成が安定しない。
- 認証がトークンでやっているので、総当たりで調べて偽装できていますかも。
- ユーザ送信データの検証が不足している。

# 自己評価・感想
ひとまずの作成なので、ポイントがただ増減するだけのポイントカードしか表現できていないですが、カスタマイズ可能なポイントカードを作成して簡単に共有できるという自分の考えの一番コアな部分は実装できていると思います。