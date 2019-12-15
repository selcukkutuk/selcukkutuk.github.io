---
title: Vue 3 - Composition Api İncelemesi
date: 2019-12-16 01:22:45
categories:
  - VueJs
tags:
  - vuejs
  - compositionapi
---

# Vue 3.0 - Composition Api İncelemesi

## Giriş

Vue küçük ve orta ölçekli uygulamaların hayata geçirilmesi için çok hızlı üretim yapabilmemize olanak sağlayan ve öğrenme eğrisi yüksek bir çatıdır. Fakat projelerimizin omuzlarındaki yük arttıkça Vue 2.0’ın bize sunmuş olduğu Options Api’ı işleri zorlaştırmaya başlar. Hatta zamanımızın büyük bölümünü düzenleyicimizi yukarı aşağı kaydırarak geçirdiğimizi fark ederiz.
Genel olarak yaşanılan sorunları iki ana başlıkta toplayalım ve detaylandıralım.

**1 - Karmaşık bileşen kodları**

Basit bir Vue bileşeni yazarken Options Api bize çok pratik gelir. Fakat zaman içerisinde bileşenin kodlarının artması ile kod okumak ve mantığı anlamak kendi yazdığımız bölümlerde bile zor hale gelir. Eğer takım halinde çalışıyorsak bunu anlamak daha da zorlaşır. Bunun nedeni ise Options Api’ı bizi reactive değişkenleri(data), metotları(methods), hesaplanan değerleri(computed) vb. bir yerde yazmaya zorlamasıdır.

**2 - Ortak mantıkları ayırma ve yeniden kullanma sorunu**

Bileşenler arasında ortak kullanılan mantıkları organize etmenin basit bir yolunun bulunmuyor olması da işleri karmaşık hale getiren bir diğer unsur. Bu konuda çözüm olması açısından mixinler bulunuyor olsa da mixinlerin sayısı arttıkça bileşenlerdeki tanımlamar ile çakışma/karışma durumları da artıyor. Mixinlerin yol açtığı diğer bir sorun ise, her defasında hangi mixinde neyin yer aldığına bakılması ihtiyacıdır. Buda geliştirme süresini etkilemektedir.

Vue 3 tasarlanırken bu sorunlara çözüm olarak ortaya Composition Api çıktı. Öncelikle üzerinde tartışılan ve tam olarak tamamlanmış bir yapı olmadığını hatırlatmakta fayda var. Ve tam olarak ne zaman nasıl uygulanacağı konusu da henüz standart hale gelmiş değil.

Yine de erkenden bir göz atmakta fayda var diye düşünüyorum ve başlıyorum.

İlk olarak eğer kurulu değil ise vue-cli aracını kurarak başlayalım.

```bash
npm install –g @vue/cli
```

Kurulum tamamlandıktan sonra bir Vue uygulaması oluşturalım.

```bash
vue create vue-composition-app
```

Şimdi vue-cli uygulama şablonunu oluşturup paketleri yükleyecek.
Sıra geldi Composition Api’ı yüklemeye. Bunu da aşağıdaki komut ile yapıyoruz.

```bash
npm install @vue/composition-api
```

Artık kullanmaya hazırız. İlk olarak src altında yer alan main.js dosyamıza gidelim ve eklentimizi Vue’ya bildirelim.

```js
// ...

import VueCompositionApi from "@vue/composition-api";

Vue.use(VueCompositionApi);

// ...
```

Bu işlem ile Composition Api'ı kullanabilmemiz için tasarlanmış **setup()** adında yeni bir metot bileşenlerde kullanıma hazır hale gelmiş oldu.

```html
<template></template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {}
    setup(){
        //Composition Api'ı kullanmak için oluşturulan giriş noktası
    }
  };
</script>
```

## Kaynaklar

1. https://www.youtube.com/watch?v=V-xK3sbc7xI
2. https://css-tricks.com/an-early-look-at-the-vue-3-composition-api-in-the-wild/
3. https://vue-composition-api-rfc.netlify.com/
4. https://medium.com/javascript-in-plain-english/how-to-use-composition-api-in-vue-967fc9b8393c
