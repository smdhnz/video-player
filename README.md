# Local Video Player

A tiny, local-only video player built with **Next.js**.  
Everything is kept minimal: there are **no menus, no buttons**—just your video and a handful of keyboard shortcuts.

_You can drag-and-drop one **or many** video files; they will be treated as a playlist._

A thin seek-bar appears at the bottom and lets you click-to-seek.

## Keyboard Shortcuts (EN)

| Key       | Action                | Notes                                          |
| --------- | --------------------- | ---------------------------------------------- |
| **space** | Play / Pause          |                                                |
| **h**     | Rewind 5 s            |                                                |
| **l**     | Forward 5 s           |                                                |
| **k**     | Volume +5 %           |                                                |
| **j**     | Volume -5 %           |                                                |
| **f**     | Toggle fullscreen     |                                                |
| **r**     | Rotate +90° clockwise | Cycles through 0°→90°→180°→270°                |
| **p**     | Previous video        | Loops to the last video if you’re on the first |
| **n**     | Next video            | Loops to the first video if you’re on the last |

> **Initial volume is set to 0 %.**  
> The UI (seek-bar & overlays) auto-hides after 3 s of inactivity but re-appears on mouse movement.

---

## ローカルビデオプレイヤー

このアプリは **Next.js** で作られた、ローカル再生専用の超ミニマルなビデオプレイヤーです。  
メニューやボタンはなく、**キーボードショートカット**だけで操作します。

複数ファイルをドラッグアンドドロップすると、その順にプレイリストとして再生されます。  
画面下部にシークバーがあり、クリックで任意の位置へジャンプできます。

### キーボード操作 (JA)

| キー      | 動作            | 補足                           |
| --------- | --------------- | ------------------------------ |
| **space** | 再生 / 一時停止 |                                |
| **h**     | 5 秒戻る        |                                |
| **l**     | 5 秒進む        |                                |
| **k**     | 音量 +5 %       |                                |
| **j**     | 音量 -5 %       |                                |
| **f**     | 全画面切替      |                                |
| **r**     | 右回転 90°      | 0°→90°→180°→270° と循環        |
| **p**     | 前の動画へ      | 先頭で押すと最後の動画へループ |
| **n**     | 次の動画へ      | 最後で押すと先頭の動画へループ |

> **初期音量は 0 %** です。  
> UI（シークバー・オーバーレイ）は 3 秒操作がないと自動で隠れ、マウスを動かすと再表示されます。
