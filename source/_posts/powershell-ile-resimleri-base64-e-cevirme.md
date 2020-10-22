---
title: İpucu - Powershell ile Resimleri Base64'e çevirme
date: 2020-10-22 12:31:12
categories:
  - Tips
tags:
  - powershell
  - base64
  - image
  - base64string
---

Fırsat buldukça bu tür küçük ipuçlarını paylaşmaya çalışacağım. Bugün paylaştığım ipuçunun hikayesi ise şu. Elimde fotoğraflardı vardı ve test etmek için hızlıca base64'e çevirmem gerekiyordu. İnternet ortamındaki online çeviricilere yükleyemeyeceğim bir içerikti. Bende bunu powershell ile yapabilir miyim diye araştırdım ve birazcık ekleme ile aşağıdaki basit ama etkili :) script ortaya çıktı.

```powershell
Param([String]$path)
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes($path))
```

Bu scripti bir .ps1 dosyası olarak kaydedin. Daha sonra aşağıdaki şekilde çağırdığımızda resmin yanında base64 string'ini içeren bir text dosyası oluşacaktır.

```powershell
PS C:\Users\sample\Desktop\example> .\b64.ps1 .\input.jpeg > output.txt
```

Faydalı olması dileğiyle. İyi çalışmalar diliyorum.