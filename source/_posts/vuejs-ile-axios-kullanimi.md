---
title: VueJs ile Axios Kullanımı
date: 2019-12-01 09:21:14
categories:
  - VueJs
tags:
  - vuejs
  - axios
  - interceptor
---

![Giriş Logosu](https://cdn-images-1.medium.com/max/1000/1*nLHZ75RCadRtigFj2beCrA.png)

Çok az sayıda framework/library yerleşik bir http API'si bulundurur. Örneğin AngularJs ile birlikte **$http**, Angular 2+ da ise **HttpModule** ve **HttpClientModule** (HttpModule Angular 9 ile tamamen kaldırılacak.), JQuery tarafında ise **$.ajax** yerleşik olarak bulunuyordu. VueJs 2.0'a kadar ise benzer şekilde **vue-resource** ile işlemlerimizi yerleşik olarak yapabiliyorduk. Fakat VueJs ekibi bunun VueJs 2.0 ile birlikte ayrılması gerektiğine ve 3. parti kütüphanelerin buna daha iyi hizmet edebileceğine karar verdiler. Bunun için en çok önerilen ise **Axios**'tur.

<!-- more -->

Axios ile http işlemlerinizi çok basit ve etkili bir şekilde çözebilirsiniz. Varsayılan olarak Promise kullanır. Hem istemcide hemde sunucuda çalışır (SSR için uygun). VueJs ile kullanımı da oldukça basittir. Aynı zamanda async/await ile birlikte tertemiz bir kullanım sağlar. O zaman kurulum ile başlayalım incelemeye.

> **Not:** VueJs uygulamasının zaten olduğu varsayılmıştır.

```bash
#Yarn
$ yarn add axios

#NPM
npm i axios
```

Kurulum tamamlandıktan sonra en temel iki metot olan GET ve POST olaylarını inceleyelim. Uygulamada API olarak [jsonplaceholder](https://jsonplaceholder.typicode.com/) kullanılmıştır.

### **axios.get()**

```html
<template>
  <div id="axios-get">
    <ul>
      <li v-for="post of posts" :key="post.id">{{ post.title }}</li>
    </ul>
    <ul v-if="errors && errors.length">
      <li v-for="(error, index) of errors" :key="index">
        {{ index + 1 }} - {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    created() {
      this.getPosts();
    },
    data() {
      return {
        posts: [],
        errors: []
      };
    },
    methods: {
      getPosts() {
        axios
          .get("https://jsonplaceholder.typicode.com/posts")
          .then(response => (this.posts = response.data))
          .catch(error => {
            this.errors.push(error);
          });
      }
    }
  };
</script>
```

### **axios.post()**

```html
<template>
  <div id="axios-post">
    <form @submit.prevent="sendNewPost">
      <label for="title">Başlık:</label>
      <input name="title" type="text" v-model="newPost.title" />
      <button type="submit" :disabled="inProgress">Kaydet</button>
    </form>
    <div v-if="sendNewPostResult">
      Oluşan Post
      <pre>{{ sendNewPostResult }}</pre>
    </div>
    <ul v-if="errors && errors.length">
      <li v-for="(error, index) of errors" :key="index">
        {{ index + 1 }} - {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    data() {
      return {
        inProgress: false,
        errors: [],
        newPost: {
          title: ""
        },
        sendNewPostResult: null
      };
    },
    methods: {
      sendNewPost() {
        this.inProgress = true;
        axios
          .post("https://jsonplaceholder.typicode.com/posts", this.newPost)
          .then(response => (this.sendNewPostResult = response.data))
          .catch(error => {
            this.errors.push(error);
          })
          .finally(() => (this.inProgress = false));
      }
    }
  };
</script>
```

### **Axios async/await kullanma**

Axios **Promise** kullandığı için await anahtarı ile sonucunu bekletebiliriz. Aşağıda daha önce yaptığımız get örneğini async/await ile birlikte nasıl kullanabileceğimizi göstermeye çalıştım. Burada unutulmaması gereken **await** anahtarı kullanılabilmesi için metodun **async** anahtarı ile işaretlenmiş olması.

```html
<template>
  <div id="axios-get">
    <ul>
      <li v-for="post of posts" :key="post.id">{{ post.title }}</li>
    </ul>
    <ul v-if="errors && errors.length">
      <li v-for="(error, index) of errors" :key="index">
        {{ index + 1 }} - {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    async created() {
      await this.getPostsAsync();
    },
    data() {
      return {
        posts: [],
        errors: []
      };
    },
    methods: {
      async getPostsAsync() {
        try {
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/posts"
          );
          this.posts = response.data;
        } catch (error) {
          this.errors.push(error);
        }
      }
    }
  };
</script>
```

### **Axios'u Global olarak kullanma**

Axios'u global olarak etkili bir şekilde kullanmak için Vue örneğinin prototype'ine yeni bir property tanımlayacağız. Bunu farklı şekillerde yapabilsekte kafa karışmaması adına main.js içerisinde direkt olarak yapacağız.

> **Not:** Daha temiz görünmesi için ayrı bir script dosyasında yapılandırabilir ve main.js içerisinden import edebilirdik.

```js
import Vue from "vue";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/"
});

Vue.prototype.$axios = axiosInstance;
```

Bu yapılandırmadan sonra artık axios'a bileşenlerimizden **this.$axios** ile ulaşabileceğiz. Aşağıdaki örneği inceleyelim.

```html
<template>
  <div id="axios-global">
    <ul>
      <li v-for="post of posts" :key="post.id">{{ post.title }}</li>
    </ul>
    <ul v-if="errors && errors.length">
      <li v-for="(error, index) of errors" :key="index">
        {{ index + 1 }} - {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    async created() {
      await this.getPostsAsync();
    },
    data() {
      return {
        posts: [],
        errors: []
      };
    },
    methods: {
      async getPostsAsync() {
        try {
          const response = await this.$axios.get("/posts");
          this.posts = response.data;
        } catch (error) {
          this.errors.push(error);
        }
      }
    }
  };
</script>
```

#### Global olarak kullanma typescript detayı

Eğer VueJs uygulamanızı typescript ile geliştiriyorsanız bu küçük kod ile global olarak kullanırken vscode gibi editörler için intellisense desteği ekleyebilirsiniz. src klasörü altında **shims-axios.d.ts** adı ile bir dosya oluşturun ve aşağıdaki kod parçasını içerisine ekleyin.

```ts
import { AxiosInstance } from "axios";

declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosInstance;
  }
}
```

### **Axios request/response interceptor**

Interceptor araya giren anlamında bir kelime. Peki bu ne anlama geliyor. Bir http isteği oluşturulduğunda sunucuya gitmeden önce yada istek sonucu döndükten hemen sonra merkezi bir noktada son bir dokunuş yapmamız gerekebilir. Ben çok ihtiyaç duyulan iki örnek ile bunu anlatmaya çalışacağım.

#### **Request Interceptor**

Bir istek yapacaksınız ama istek sunucuya gitmeden hemen önce header'a **Authorization** bilgisi eklemek istiyorsunuz. Request interceptor bunun için biçilmiş kaftandır.Örneği inceleyelim.

```js
import Vue from "vue";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/"
});

Vue.prototype.$axios = axiosInstance;

axiosInstance.interceptors.request.use(config => {
  //Tabiki burada token değerini local yada session storage gibi bir yerden okumamız gerekebilir
  config.headers["Authorization"] = "Bearer eyxxxx";
  return config;
});
```

Artık tüm isteklerin header'ına bu değer ekleniyor olacak.

#### **Response Interceptor**

Buradaki örneğimizde ise mesela sunucudan cevap döndüğünde eğer bir hata var ise bir toast mesajı göstermek isteyebilirsiniz. Diğer bir örnek ise istek sonucunda 401 hata kodu aldığımızda token'ı yenilemek yada kullanıcıyı giriş sayfasına yönlendirmek isteyebiliriz. Çözüm işte tam burası.

```js
import Vue from "vue";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/"
});

Vue.prototype.$axios = axiosInstance;

axiosInstance.interceptors.response.use(config => {
  if (config.status === 401) {
    alert("Oturum süreniz sona erdi");
  }
  return config;
});
```

### **Bitirirken**

Bu yazı ile vue ile axios kütüphanesinin en sık ihtiyaç duyulan bölümlerini ele almaya çalıştım. Gerçekten çok başarılı bir kütüphane olduğunu belirtmekte fayda var. Tüm yapılandırma seçeneklerini incelemek için github deposunu ziyaret etmekte fayda var. Herkese iyi çalışmalar dilerim.

#### **Örnek Github Adresi:** https://github.com/selcukkutuk/vue-axios-examples

### **Kaynaklar**

1. https://github.com/axios/axios
2. https://alligator.io/vuejs/rest-api-axios/
