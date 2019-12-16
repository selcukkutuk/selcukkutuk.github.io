---
title: Vue 3 - Composition Api İncelemesi
date: 2019-12-16 16:45:45
categories:
  - VueJs
tags:
  - vuejs
  - compositionapi
---

![Giriş](..\images\vue3-composition-api-inceleme\intro.png)

Vue küçük ve orta ölçekli uygulamaların hayata geçirilmesi için çok hızlı üretim yapabilmemize olanak sağlayan ve öğrenme eğrisi yüksek bir çatıdır. Fakat projelerimizin omuzlarındaki yük arttıkça Vue 2.0’ın bize sunmuş olduğu Options Api’ı işleri zorlaştırmaya başlar. Hatta zamanımızın büyük bölümünü düzenleyicimizi yukarı aşağı kaydırarak geçirdiğimizi fark ederiz.
Genel olarak yaşanılan sorunları iki ana başlıkta toplayalım ve detaylandıralım.

<!-- more -->

**1 - Karmaşık bileşen kodları**

Basit bir Vue bileşeni yazarken Options Api bize çok pratik gelir. Fakat zaman içerisinde bileşenin kodlarının artması ile kod okumak ve mantığı anlamak kendi yazdığımız bölümlerde bile zor hale gelir. Eğer takım halinde çalışıyorsak bunu anlamak daha da zorlaşır. Bunun nedeni ise Options Api’ı bizi reactive değişkenleri(data), metotları(methods), hesaplanan değerleri(computed) vb. bir yerde yazmaya zorlamasıdır.

**2 - Ortak mantıkları ayırma ve yeniden kullanma sorunu**

Bileşenler arasında ortak kullanılan mantıkları organize etmenin basit bir yolunun bulunmuyor olması da işleri karmaşık hale getiren bir diğer unsur. Bu konuda çözüm olması açısından mixinler bulunuyor olsa da mixinlerin sayısı arttıkça bileşenlerdeki tanımlamar ile çakışma/karışma durumları da artıyor. Mixinlerin yol açtığı diğer bir sorun ise, her defasında hangi mixinde neyin yer aldığına bakılması ihtiyacıdır. Buda geliştirme süresini etkilemektedir.

Vue 3 tasarlanırken bu sorunlara çözüm olarak ortaya Composition Api çıktı. Öncelikle üzerinde tartışılan ve tam olarak tamamlanmış bir yapı olmadığını hatırlatmakta fayda var.

Vue 2.x ile kullanabilmek için **@vue/composition-api** paketi bulunuyor. O zaman adım adım bir uygulama oluşturalım ve neler getiriyor bakalım.

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

Artık kullanmaya hazırız. İlk olarak src altında yer alan **main.js** dosyamıza gidelim ve eklentimizi Vue’ya bildirelim.

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

Şimdi sırasıyla örnek uygulamamızı **Options Api**, **Composition Api** ve **Reuseable Composition Api** ile düzenleyelim ve farklılıklarını inceleyelim.

Uygulamanın işlevleri;

1. Ürün ekleme listeleme
2. Kullanıcı hareketsizlik süresini takip etme
3. Uygulamanın belirli bölümlerini gösterip gizleme

### **Options Api**

Bu varsayılan olarak kullandığımız api.

```html
<template>
  <div class="row mt-5">
    <div class="col-md-12 text-center">
      Hareketsiz kalınan süre
      <span class="badge badge-pill badge-warning">{{idleTime}}</span> saniye
    </div>
    <div class="col-md-12 text-right mb-2">
      <button class="btn btn-info mr-1" @click="toggleShow">
        Ürün Listesini Göster/Gizle
        <span class="badge badge-pill badge-dark">{{productCount}}</span>
      </button>
      <button class="btn btn-success" @click="addProduct">Ürün Ekle</button>
    </div>
    <div class="col-md-12" v-if="show">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>No</th>
            <th>Adı</th>
            <th>Fiyatı</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{product.id}}</td>
            <td>{{product.name}}</td>
            <td>
              <i class="fas fa-lira-sign"></i>
              {{product.price}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      this.products.push({ id: 1, name: "Ürün 1", price: (10).toFixed(2) });
      this.intervalIdleTime = setInterval(() => this.idleTime++, 1000);
      this.activityEvents.forEach(eventName => {
        document.addEventListener(eventName, this.activity, true);
      });
    },
    destroyed() {
      this.activityEvents.forEach(eventName => {
        document.removeEventListener(eventName, this.activity, true);
      });
      clearInterval(this.intervalIdleTime);
    },
    data() {
      return {
        activityEvents: [
          "mousedown",
          "mousemove",
          "keydown",
          "scroll",
          "touchstart"
        ],
        show: true,
        products: [],
        idleTime: 0,
        intervalIdleTime: null
      };
    },
    methods: {
      toggleShow() {
        this.show = !this.show;
      },
      addProduct() {
        this.products.push({
          id: this.products.length + 1,
          name: "Ürün " + (this.products.length + 1).toString(),
          price: Math.ceil(Math.random() * 100).toFixed(2)
        });
      },
      activity() {
        this.idleTime = 0;
      }
    },
    computed: {
      productCount() {
        return this.products.length;
      }
    }
  };
</script>
```

### **Composition Api**

![Options Api <-> Composition Api](../images/vue3-composition-api-inceleme/option-vs-composition.png)

#### **Önemli yeni kavramlar**

1. **reactive:** Düz bir nesneyi reaktif bir nesneye dönüştürür.

2. **ref:** Bir özelliği reaktif hale getirmek için kullanıyoruz.

3. **isRef:** Bir özellik reaktif mi diye kontrol etmek için kullanıyoruz.

4. **toRefs:** Reaktif bir nesnenin özelliklerini birer reaktif özellik olarak alabilmemizi sağlar. Büyük reaktif nesneleri return ederken kullanışlıdır.

Api hakkında daha detaylı bilgiyi [buradan](https://vue-composition-api-rfc.netlify.com/api.html) alabilirsiniz.

#### **Uygulanması**

Aynı işlevin dağılmış parçaları birleştirelim ve birer fonksiyon haline getirelim. Örneğin ürün işlemlerinin özelliklerini, metotlarını, yaşam döngüsü metotlarını **useProduct()** fonksiyonu ile bir araya toplayalım. Bu sayede artık ürün işlemleri ile ilgili bir gözden geçirme yapacağımız zaman nereye bakmamız gerektiiğini kolayca anlayabiliriz. Daha sonra **useProduct()** metodununun return ettiklerini **setup()** içerisinden [destructuring assignment](https://medium.com/@thrkardak/javascript-harikalar%C4%B1-3-destructuring-assignment-64cbb9fe3355) ile alalım ve bizde **setup()** içerisinden Vue'nun kullanabilmesi için return edelim.

```html
<template>
  <div class="row mt-5">
    <div class="col-md-12 text-center">
      Hareketsiz kalınan süre
      <span class="badge badge-pill badge-warning">{{idleTime}}</span> saniye
    </div>
    <div class="col-md-12 text-right mb-2">
      <button class="btn btn-info mr-1" @click="toggleShow">
        Ürün Listesini Göster/Gizle
        <span class="badge badge-pill badge-dark">{{productCount}}</span>
      </button>
      <button class="btn btn-success" @click="addProduct">Ürün Ekle</button>
    </div>
    <div class="col-md-12" v-if="show">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>No</th>
            <th>Adı</th>
            <th>Fiyatı</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{product.id}}</td>
            <td>{{product.name}}</td>
            <td>
              <i class="fas fa-lira-sign"></i>
              {{product.price}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, onUnmounted, computed } from "@vue/composition-api";
  export default {
    setup() {
      const { show, toggleShow } = useToggleShow();
      const { products, productCount, addProduct } = useProduct();
      const { idleTime } = useActivityTracker();
      return {
        show,
        toggleShow,
        products,
        productCount,
        addProduct,
        idleTime
      };
    }
  };

  function useToggleShow(def = true) {
    const show = ref(def);
    const toggleShow = () => {
      show.value = !show.value;
    };
    return { show, toggleShow };
  }

  function useProduct() {
    const products = ref([]);
    const productCount = computed(() => products.value.length);

    const addProduct = () => {
      products.value.push({
        id: products.value.length + 1,
        name: "Ürün " + (products.value.length + 1).toString(),
        price: Math.ceil(Math.random() * 100).toFixed(2)
      });
    };
    onMounted(() => {
      products.value.push({ id: 1, name: "Ürün 1", price: (10).toFixed(2) });
    });
    return { products, productCount, addProduct };
  }

  function useActivityTracker() {
    let intervalIdleTime = null;
    const idleTime = ref(0);
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart"
    ];
    function activity() {
      idleTime.value = 0;
    }
    intervalIdleTime = setInterval(() => idleTime.value++, 1000);
    onMounted(() => {
      activityEvents.forEach(eventName => {
        document.addEventListener(eventName, activity, true);
      });
    });
    onUnmounted(() => {
      activityEvents.forEach(eventName => {
        document.removeEventListener(eventName, activity, true);
      });
      clearInterval(intervalIdleTime);
    });
    return {
      idleTime
    };
  }
</script>
```

### **Reuseable Composition Api**

İşlevleri bir araya topladık ve artık ne için nereye bakmamız gerektiğini biliyoruz. Fakat bu örnek için **hareketsizlik süresi izleme** ve **belirli bölümleri açıp kapatma** işlevleri daha sonra uygulamanın diğer bölümlerinde de kullanılabilir gibi duruyor. O halde bu bölümleri farklı bir dosyaya çıkarmamız daha uygun olacaktır. Bu sayede ihtiyacımız olan parçaları diğer bileşenlerimizden de çağırabilir kullanabiliriz.

> Burada benim izlediğim ve diğer okuduğum makalelerde de tercih edilen yöntem, bileşen ile sıkı sıkıya bağlı olan bölümlerin bileşen içerisinde bırakılması, tekrar kullanılabileceği öngörülen bölümlerin ayrı dosyaya çıkarılmasıdır.

```html
<template>
  <div class="row mt-5">
    <div class="col-md-12 text-center">
      Hareketsiz kalınan süre
      <span class="badge badge-pill badge-warning">{{idleTime}}</span> saniye
    </div>
    <div class="col-md-12 text-right mb-2">
      <button class="btn btn-info mr-1" @click="toggleState">
        Ürün Listesini Göster/Gizle
        <span class="badge badge-pill badge-dark">{{productCount}}</span>
      </button>
      <button class="btn btn-success" @click="addProduct">Ürün Ekle</button>
    </div>
    <div class="col-md-12" v-if="state">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>No</th>
            <th>Adı</th>
            <th>Fiyatı</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{product.id}}</td>
            <td>{{product.name}}</td>
            <td>
              <i class="fas fa-lira-sign"></i>
              {{product.price}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, computed } from "@vue/composition-api";
  import { useActivePassive } from "../composable/active-passive";
  import { useActivityTracker } from "../composable/activity-tracker";
  export default {
    setup() {
      const { state, toggleState } = useActivePassive();
      const { products, productCount, addProduct } = useProduct();
      const { idleTime } = useActivityTracker();
      return {
        state,
        toggleState,
        products,
        productCount,
        addProduct,
        idleTime
      };
    }
  };

  function useProduct() {
    const products = ref([]);
    const productCount = computed(() => products.value.length);

    const addProduct = () => {
      products.value.push({
        id: products.value.length + 1,
        name: "Ürün " + (products.value.length + 1).toString(),
        price: Math.ceil(Math.random() * 100).toFixed(2)
      });
    };
    onMounted(() => {
      products.value.push({ id: 1, name: "Ürün 1", price: (10).toFixed(2) });
    });
    return { products, productCount, addProduct };
  }
</script>
```

**active-passive.js**

```js
import { ref } from "@vue/composition-api";

export function useActivePassive(def = true) {
  const state = ref(def);
  const toggleState = () => {
    state.value = !state.value;
  };
  return { state, toggleState };
}
```

**activity-tracker.js**

```js
import { ref, onMounted, onUnmounted } from "@vue/composition-api";

export function useActivityTracker() {
  let intervalIdleTime = null;
  const idleTime = ref(0);
  const activityEvents = [
    "mousedown",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart"
  ];
  function activity() {
    idleTime.value = 0;
  }
  intervalIdleTime = setInterval(() => idleTime.value++, 1000);
  onMounted(() => {
    activityEvents.forEach(eventName => {
      document.addEventListener(eventName, activity, true);
    });
  });
  onUnmounted(() => {
    activityEvents.forEach(eventName => {
      document.removeEventListener(eventName, activity, true);
    });
    clearInterval(intervalIdleTime);
  });
  return {
    idleTime
  };
}
```

## Bitirirken

Vue 2.x ile Composition Api ile yaşadığım deneyimi anlatmaya çalıştım. Tam olarak hangi şekilde uygulanması daha doğru olur gibi soruların net bir cevabı bulunmuyor. 2020 yılında Vue 3.0'ın yayınlanması ve kullanım oranının artması ile desenler daha belirgin hale gelecektir. Typescript için makale içerisinde kod örneği eklemedim. Fakat aşağıdaki bağlantıda verdiğim github deposunda her iki örneğin çalışır halini bulabilrisiniz. İyi çalışmalar diliyorum.

**Örnek Github Adresi:** [https://github.com/selcukkutuk/vue-composition-api-examples](https://github.com/selcukkutuk/vue-composition-api-examples)

## Kaynaklar

1. https://www.youtube.com/watch?v=V-xK3sbc7xI
2. https://css-tricks.com/an-early-look-at-the-vue-3-composition-api-in-the-wild/
3. https://vue-composition-api-rfc.netlify.com/
4. https://medium.com/javascript-in-plain-english/how-to-use-composition-api-in-vue-967fc9b8393c
