---
title: Stencil'e Giriş
date: 2019-05-15 14:33:05
categories:
  - Web Components
tags:
  - stenciljs
  - web components
---

![Giriş Logosu](https://cdn-images-1.medium.com/max/1000/1*KtY9DFv1P2mC5JDWrgdeOQ.png)

### **Nedir?**

[Stencil](https://stenciljs.com) Ionic ekibi tarafından geliştirilen native web bileşenleri oluşturmak için hazırlanan bir araçtır. Bunun yanında sanal dom, reaktif veri aktarımı Typescript ve JSX gibi güçlü özellikleri ile uzun vade de oldukça iddialı ve umut verici görünüyor. İlk olarak [Polymer Summit 2017](https://www.youtube.com/watch?v=UfD-k7aHkQE) de duyurulan Stencil ben de dahil olmak üzere bir çok kişinin ilgisini çekmiş gibi görünüyor. Bu yazı ile kısa bir giriş yaparak basit bir örnek uygulama hazırlayacağız.

<!-- more -->

### **Neden?**

Ekip Ionic bileşenlerinin bir sonraki sürümünü Stencil ile geliştirecek. Bu Ionic ile geliştirilmiş olan uygulamalara ciddi bir hız katacak ve aynı zamanda ciddi bir paket boyutu avantajı sağlayacak gibi görünüyor. Bunun yanı sıra Angular 4 ile Ionic uygulamarı geliştirmek hala mümkün olacak ve daha da önemlisi ve bana çok cazip gelen tarafı Angular 4 dışında Vue, React ve hatta saf Javascript ile ionic uygulamaları geliştirmek mümkün hale gelecek. Yani kısacası framework yada kütüphane bağımsız bir bileşen setine dönüşecek. Gerçekten kulağa çok hoş geliyor.

> **Dikkat:** Stencil henüz alpha bile diyemeyeceğimiz çok ama çok erken bir sürümde. Bu nedenle ilk kararlı sürüm yayınlanana kadar dikkatli olunması ve değişimlerin iyi izlenmesi gerekmektedir. Çünkü bazı klavye bükücü anlamsız hatalar ve kararlı sürüme kadar bolca “breaking change” bizleri bekliyor olabilir.

### **Kurulum**

Şu anda Stencil çok erken bir aşamada olduğu için bir cli aracı bulunmuyor. Bu nedenle hızlıca bir göz atmanın en iyi yolu ekip tarafından github üzerindeki başlangıç uygulaması reposunu bilgisayarımıza klonlamak (git clone)olacaktır. O zaman başlayalım:

```shell
$ git clone https://github.com/ionic-team/stencil-starter.git ilk-stencil-ornegi
```

Klonlama işlemi tamamlandıktan sonra bağımlılıklar için klasör içerisine girip **npm** yada **yarn** ile yükleme işlemini tamamlıyoruz.

```shell
$ cd ilk-stencil-ornegi
$ npm install
#veya yarn için
$ yarn
```

Yükleme işlemi tamamlandıktan sonra projeyi yerel bir sunucu üzerinde ayağa kaldırmak için şu komutu çalıştırıyoruz:

```shell
$ npm start
# veya yarn için
$ yarn start
```

<center>
![Açılış öncesi kısa bir build işlemi gerçekleşiyor.](https://cdn-images-1.medium.com/max/800/1*esy1UK8XcT2giZ3CGhdV-w.png)
</center>

<center>
![Build işlemi sonrasında uygulama yükleniyor.](https://cdn-images-1.medium.com/max/800/1*0KoFL7uLIxPBLk36U1wZIg.png)
</center>

### **Hadi Başlayalım**

Stencil bileşenleri Typescript ve JSX kullanılarak oluşturuluyorlar. Bu hem Angular severlere hemde React severlere göz kırpıyor. Vue severler için zaten bir şey söylememe gerek yok. Kim gözünü nereye kırpsa sekip onlara geliyor. :) Bileşenler **/src/components/** klasöründe bulunuyor. Bir bileşenin yapısına kısaca bir göz atmak istersek (my-name.tsx):

```ts
import { Component, Prop } from "@stencil/core";
@Component({
  tag: "my-name",
  styleUrl: "my-name.scss"
})
export class MyName {
  @Prop() first: string;
  @Prop() last: string;
  render() {
    return (
      <p>
        Hello, my name is {this.first} {this.last}
      </p>
    );
  }
}
```

**@Component:** Bileşen için gereken meta verilerin tanımlanması için kullanılan dekorator. Bazı özellikleri **tag, styleUrl, styleUrls.**

**@Prop:** Bileşenin kabul ettiği öz niteliklerin değerlerini ele alırken kullanılan dekorator. Örneğin _@Prop() adi: string = ``;_

Bu bileşenin Stencil yapılandırma dosyasında tanımlanması gerekmektedir. Kontrol etmek için ana dizinde bulunan **stencil.config.js** dosyasına göz atalım:

```js
exports.config = {
  bundles: [{ components: ["my-name", "diger-bilesen"] }]
};
//...
```

Artık bileşeni **index.html** içerisinde tag adı ile kullanabiliriz:

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Stencil Starter App</title>
    <script src="build/app.js"></script>
  </head>
  <body>
    <my-name first="Stencil" last="JS"></my-name>
  </body>
</html>
```

### **Kendi Bileşenimizi Geliştirelim**

Öncelikle bileşeni geliştirmeye başlamadan önce ilk kez kullanacağımız 3 yeni kavrama bir göz atalım.

**@State() :** Bileşen içerisinde kullanacağımız değişkenleri belirttiğimiz dekarator. Örneğin, @State() deger: number;

**componentWillLoad :** Yaşam döngüsü kancalarından bir tanesi. Bileşen yüklenmeden önce çalıştırılır. Diğerleri, componentDidLoad ve componentDidUnload. componentDidLoad, bileşen yüklendikten sonra componentDidUnload ise bileşen kaldırıldığında çalıştırılır.

**onClick :** Buttona tıklama olayını ele alacağımız event. Örneğin, onClick={() => this.artir()}

Şimdi ilk olarak **/src/components/** dizinin içerisine ornek-sayac adında yeni bir bileşen dizini oluşturalım. Şimdi ise içerisine **ornek-sayac.tsx** ve **ornek-sayac.scss** dosyalarını oluşturalım. Son görünüm aşağıdaki gibi.

<center>
![Dizin ağaç yapısı](https://cdn-images-1.medium.com/max/800/1*32A_5VSRz8lVpPdI-RSbKQ.png)
</center>

Daha sonra yeni bileşenimizi stencil'e haber vermemiz gerekiyor. Bunun için **stencil.config.js** içerisindeki components string dizisine yeni bileşenimizi ekleyelim.

```js
exports.config = {
  bundles: [{ components: ["my-name", "ornek-sayac"] }]
};
//...
```

Şimdi **ornek-sayac.tsx** dosyasını açalım ve aşağıdaki şekilde düzenleyelim.

```ts
import { Component, Prop, State } from "@stencil/core";
@Component({
  tag: "ornek-sayac",
  styleUrl: "ornek-sayac.scss"
})
export class OrnekSayac {
  @Prop() baslangic: number = 1;
  @Prop() artismiktari: number = 5;
  @State() deger: number;
  componentWillLoad() {
    this.deger = this.baslangic;
  }

  render() {
    return (
      <p>
        <button onClick={() => this.azalt()}>Azalt</button>
        <span class="sonuc">{this.deger}</span>
        <button onClick={() => this.artir()}>Artır</button>
      </p>
    );
  }
  artir() {
    const yeniDeger = this.deger + this.artismiktari;
    this.deger = yeniDeger;
  }
  azalt() {
    const yeniDeger = this.deger - this.artismiktari;
    this.deger = yeniDeger;
  }
}
//...
```

Şimdi ise isteğe bağlı **olarak ornek-sayac.scss** dosyasını aşağıdaki gibi düzenleyebilirsiniz.

```scss
button {
  font-size: 20px;
}
.sonuc {
  padding: 0 10px 0 10px;
  font-size: 20px;
  font-weight: bold;
}
```

Ve bileşenimiz hazır durumda. Son olarak bileşeni **index.html**'e eklemeliyiz.

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Stencil Starter App</title>
    <script src="build/app.js"></script>
  </head>
  <body>
    <my-name first="Stencil" last="JS"></my-name>
    <ornek-sayac></ornek-sayac>
    <!-- <ornek-sayac baslangic="5" artismiktari="10"></ornek-sayac> -->
  </body>
</html>
```

Sonuç aşağıdaki gibi olmalı.

<center>
![Projenin son hali](https://cdn-images-1.medium.com/max/1000/1*CnWsqOQhTgH8q1EsE6pxAw.gif)
</center>

Bu yazı ile temel anlamda Stencil aracına bir giriş yapmış olduk. Yeni konularla bu yazı dizisini devam ettirmeye çalışacağım. Herkese iyi çalışmalar dilerim.
