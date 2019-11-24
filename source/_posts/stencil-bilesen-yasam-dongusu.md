---
title: Stencil Bileşen Yaşam Döngüsü
date: 2019-11-24 12:29:56
categories:
  - Web Components
tags:
  - stenciljs
  - web components
  - lifecycle methods
---

## **Giriş**

Yaşam döngüsü her framework yada library de olduğu gibi Stenciljs'de de önem arz etmektedir. Bir bileşenin yaşam döngüsünü iyi bilmeliyiz ki herhangi bir t anında bileşene müdahale etmek gerekirse bunu nerede yapabileceğimizi kestirebilelim. Toplamda 8 tane olan bu metotları aşağıda çağrılma sıralarını dikkate almadan açıklamaya çalışacağım. Sonraki başlıkta ise farklı senaryolarda tam olarak hangi sıra ile çalıştıklarını belirtiyor olacağım. O zaman başlayalım.

- ### **connectedCallback()**

  Bu metot bileşen DOM'a her bağlandığında çalıştırılır. Bileşenin DOM'a her bağlandığında yapmasını istediğimiz işlemler burada yer alabilir.

  **Not:** Bileşen DOM'a ilk bağlandığında **connectedCallback()** metodu **componentWillLoad()** metodundan önce çağrılır. Uygulamada bir bileşenin çok kez DOM'a eklenebileceğini yada kaldırılabileceğini dolayısıyla bu metodun defalarca kez çağrılabileceğini unutmamak gerekir.

- ### **disconnectedCallback()**

  Bu metot bileşenin DOM ile bağlantısı her kesildiğinde çağrılır. **connectedCallback()** metodunda olduğu gibi bir çok kez çağrılabileceğini unutmamak gerekir.

- ### **componentWillLoad()**
  Bileşen DOM'a ilk kez bağlandıktan hemen sonra çağrılır. Burada geriye bir **Promise** return edilerek ilk render işlemi bekletilebilir. Özellikle bileşenin oluşturulması için bir API'ye istek yapılması gerekiyorsa, işlem burada gerçekleştirilebilir.
- ### **componentDidLoad()**
  Bileşen DOM'a tam olarak yüklendikten ve render işlemi tamamlandıktan sonra bir kez çağrılır.
- ### **componentWillRender()**
  Her render işlemi öncesinde çağrılır. **componentWillLoad()** metodunda olduğu gibi geriye bir **Promise** return ederek render işlemi bekletilebilir.
- ### **componentDidRender()**
  Her render işlemi sonrasında çağrılır.
- ### **componentWillUpdate()**

  Prop() veya State() değerleri değiştiğinde bileşen güncellenmeden hemen önce çağrılır. **componentWillLoad()** metodunda olduğu gibi geriye bir **Promise** return ederek render işlemi bekletilebilir.

  **Not:** Bileşen DOM'a ilk kez eklendiğinde bu metot çağrılmaz.

- ### **componentDidUpdate()**

  Bileşen güncellendikten hemen sonra çağrılır.

  **Not:** Bileşen DOM'a ilk kez eklendiğinde bu metot çağrılmaz.

- ### **componentDidUnload()**
  Bu metot bileşen DOM'dan kaldırıldığında çağrılır. Bileşen oluştuğunda örneğin **setInterval** ile bir timer oluşturduysanız bu metotda clearInterval ile gereksiz çalışmasına (bellek tüketmesine/sürpriz sonuçlar oluşturmasına) engel olabilirsiniz.

## **Farklı Senaryolarda Metotların Çalıştırılma Sırası**

Diyelim bileşeniniz bütün yöntemleri içeriyor olsun. Bu bileşeni DOM'a eklediğinizde, DOM'dan kaldırdığınızda ve tekrar DOM'a eklediğinizde nasıl br sıralama oluyor aşağıdan inceleyelim.

- ### **Bileşen DOM'a İlk Eklendiğinde**

  1. connectedCallback()
  2. componentWillLoad()
  3. componentWillRender()
  4. componentDidRender()
  5. componentDidLoad()

- ### **Bileşen DOM'dan Kaldırıldığında**

  1. disconnectedCallback()

- ### **Bileşen DOM'a İkinci Kez Eklendiğinde**

  1. connectedCallback()

- ### **Bileşende Güncelleme Olduğunda**
  1. componentWillUpdate()
  2. componentWillRender()
  3. componentDidRender()
  4. componentDidUpdate()

## İç İçe Bileşenlerde Yaşam Döngüsü

```html
<bilesen-a>
  <bilesen-b>
    <bilesen-c></bilesen-c>
  </bilesen-b>
</bilesen-a>
```

İç içe bileşen kullanımında ise aşağıdaki gibi bir sıra ile metotlar çağırılmaktadır.

1. <span style="color:#2BD9FE">bilesen-a-componentWillLoad()</span>
2. <span style="color:#2BD9FE">bilesen-a-componentWillRender()</span>
3. <span style="color:#52AA5E">bilesen-b-componentWillLoad()</span>
4. <span style="color:#52AA5E">bilesen-b-componentWillRender()</span>
5. <span style="color:#985F99">bilesen-c-componentWillLoad()</span>
6. <span style="color:#985F99">bilesen-c-componentWillRender()</span>
7. <span style="color:#985F99">bilesen-c-componentDidRender()</span>
8. <span style="color:#985F99">bilesen-c-componentDidLoad()</span>
9. <span style="color:#52AA5E">bilesen-b-componentDidRender()</span>
10. <span style="color:#52AA5E">bilesen-b-componentDidLoad()</span>
11. <span style="color:#2BD9FE">bilesen-a-componentDidRender()</span>
12. <span style="color:#2BD9FE">bilesen-a-componentDidLoad()</span>

> **Not:** Bazı bileşenler önceden yüklenmiş olsada metot çağırma sırası yine yukarıdaki gibi olmaktadır.

## Zaman Uyumsuz Yaşam Döngüsü Metotları

Yazının bazı bölümlerinde **componentWillLoad()** ve bazı diğer metotların geriye bir Promise return edebildiğinden bahsetmiştik. Şimdi bunu bir örnek ile daha iyi anlamaya çalışalım. Örneğin bileşen ilk kez render edilmeden önce bileşenin oluşumunda sunucudan gelen verilerin kullanılması gerekiyor. Aşağıdaki örneği inceleyelim.

```ts
componentWillLoad() {
  return fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(todos => {
      this.todos = todos;
    });
}
```

Bileşenin **componentWillLoad()** metodu geriye bir Promise return ediyor. Dolayısıyla istek sonuçlanana kadar bileşen render edilmeyecek.

## Bitirirken
Bu yazı ile stenciljs için önemli bir konu olan yaşam döngüsü metotlarını incelemeye çalıştım. Bir sonraki yazıda görüşmek üzere.

## Kaynaklar

1. https://stenciljs.com/docs/component-lifecycle
