# 携帯版の復旧

2026年10月2日の変更前の全ファイルは `backup/mobile-before-20261002` ブランチに保全しています。

携帯版を戻す場合は、そのブランチから次の3ファイルを main へ復元します。

- index.html
- manifest.webmanifest
- sw.js

復旧時は sw.js の CACHE 名を新しい固有名へ変更し、端末の古いキャッシュを更新してください。
PC版は今回の変更対象に含まれていません。

現在の携帯版は pc/assets の盤面・液晶・タイトル画像と pc/love.css を共有し、mobile.css、mobile-layout.js、mobile-lesson.js で携帯端末の表示・用語説明を調整しています。
