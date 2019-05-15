---
title: Stencil’de Bileşenler Arası Haberleşme
date: 2019-05-16 00:28:10
categories:
 - Web Components
tags:
 - stenciljs
 - stencil
 - web components
 - custom elements
---

![](https://cdn-images-1.medium.com/max/1000/1*JDAq9NYdpV5maeQ2jqzkyA.png)

Stencil aracının ne olduğuna [bir önceki yazımda](https://medium.com/t%C3%BCrkiye/stencile-giri%C5%9F-41e90e37595d) giriş seviyesinde değinmeye çalışmıştım. Şimdi biraz daha derinlerine inmeye çalışacağım. Bileşen temelli araçların hemen tümünde bileşenler arası haberleşme/etkileşim (component communication/interaction) önem arz eder. Bu nedenle değineceğim ilk konu bu olacak.
<!-- more -->
Stencil aracında bileşenler arasındaki haberleşme Üst Bileşenden Alt Bileşene (Parent to Child), Alt Bileşenden Üst Bileşene (Child to Parent) olmak üzere iki şekilde gerçekleşmektedir. Aşağıdaki hazırladığım görsel ile basit bir şekilde bu haberleşmeyi anlatmaya çalıştım.