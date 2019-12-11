---
title: NuxtJs Uygulamanızı Github Actions ile Surge.sh’a Deploy Etme
date: 2019-12-08 15:19:04
categories:
 - DevOps
tags:
  - nuxtjs
  - githubactions
  - surgesh
---

![Giris Resmi](https://miro.medium.com/max/1000/1*PL9rzQIpoQZ-tJog9CbOxg.png)

Github Actions duyurulduğunda hemen kayıt oldum ve heyecanla beklemeye başladım. Hesabım için aktif olduğunda ise bir deneme fırsatı bulamadım. Bugün temel anlamda basit bir nuxtjs uygulaması nasıl deploy ediliyor diye baktım. Burada örneği nuxtjs ile yapıyor olmamın aslında hiçbir önemi bulunmuyor. Bugün nuxtjs ile bir PoC yapıyordum ve bunu Github Actions ile nasıl deploy edebilirim dedim ve başladım. O zaman adım adım ne yapıyoruz birlikte inceleyelim.
<!-- more -->
## **Surgesh için token oluşturalım**

Deploy etmek için kullanacağımız servis surge.sh olacak. Bu nedenle deploy aşamasında kullanacağımız bir token almamız gerekiyor. Tabi bu işlemi yapabilmemiz için surge cli’ı kurmamız gerekli. Bunu aşağıda yer alan komut ile gerçekleştiriyoruz.

```bash
npm install -g surge
```

Şimdi sıra geldi token almaya. Bunu da aşağıda yer alan komut ile gerçekleştiriyoruz. Alttaki resimde doğrudan token verildiğini göreceksiniz. Eğer surge cli’ı ilk kez çalıştırıyorsanız cli sizden bir kullanıcı adı ve şifre talep edecek ve sonrasında token alabileceksiniz.

```bash
surge token
```

![Surge.sh token alma](https://miro.medium.com/max/605/1*W5WHnRxku1n11kay5C-OCw.png)

## **NuxtJs uygulamamızı oluşturalım**

Şimdi bir nuxtjs uygulaması oluşturalım ve bunu github depomuza gönderelim.

> **Not:** NuxtJs uygulaması oluşturma adımlarını hızlıca geçiyor olacağım. NuxtJs kurulum sayfasından detaylı bilgi edinilebilir. Buradaki asıl amacım bunun Github Actions ile nasıl deploy edildiğidir.

NuxtJs takımının bize sunmuş olduğu scaffolding tool ile uygulamamızı oluşturalım.

```bash
npx create-nuxt-app nuxt-github-actions-surge
```

Github hesabımızda yeni bir depo oluşturalım ve kodumuzu oraya gönderelim. NuxtJs uygulamasının ana dizininde aşağıdaki komutları çalıştırıyoruz.

```bash
#Uygulamada değişiklik yaptıysanız bunları index'e ekliyoruz.
git add .

#Değişiklikleri yerel depodaki HEAD'e ediyoruz
git commit -m 'init'

#Depomuza uzak sunucu adresi ekliyoruz
git remote add origin https://github.com/username/repo-name.git

#Değişiklikleri sunucudaki master dalımıza gönderiyoruz
git push -u origin master
```

Artık kodlarımız Github depomuza gittiğine göre askiyona başlayalım. :)

## **Github Actions**

Artık bit git deposu ve içerisinde bir nuxtjs uygulamamız bulunuyor. Bizim bunu surge.sh tarafına göndermekte dahil olmak üzere yapmamız gereken bir işlemler dizisi bulunuyor. İşte bu işlemler dizisine workflow yani iş akışı diyoruz. O zaman bir tane de kendi depomuz için oluşturalım.

![İş akışı oluşturma ilk adım](https://miro.medium.com/max/1767/1*ZPoAes6KWTvpj1sKL_Qtww.png)

“Set up a workflow yourself” butonuna tıklayarak yeni bir iş akışı ayarlamaya başlayalım. Bizi ikinci adımda aşağıdaki ekran karşılayacak.

![İş akışı tanımlama](https://miro.medium.com/max/1907/1*DPy8zf57x-s3QALfRbTIJA.png)

Kırmızı içerisine aldığım bölüm iş akışı tanımını yapacağımız düzenleyici. Şimdi o bölümü aşağıdaki bölüm ile değiştirelim.

```yaml
name: Deploy Website

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    name: Deploying to surge
    steps:
      - uses: actions/checkout@v1
      - name: Install surge and fire deployment
        uses: actions/setup-node@v1
        with:
          node-version: 8
      - run: npm install -g surge
      - run: npm install
      - run: npm run generate
      - run: surge ./dist/ ${{ secrets.SURGE_DOMAIN }} --token ${{ secrets.SURGE_TOKEN }}
```

1.satırdaki name bizim iş akış adımız. 3. satırda yer alan bölüm ise bu aksiyon ne zaman devreye gireceği. Biz burada depoya bir push işlemi olduğunda çalışacak şekilde ayarladık. 5. satırda işlerimizi tanımlayacağımızı 6. satırda ise bu işlerden birinin build olacağını 7. satırda bu build işleminin ubuntu’nun son sürümü üzerinde çalışacağını 8. satırda build işleminin adının ne olacağını belirttik. 9. satırda ise adımlarının ne olacağını 10. satırda actions/checkout@v1 kullanılarak deponun elde edileceğini 11. satırda yeni bir adım isim tanımı yapıldı. 12. satırda actions/setup-node@v1 kullanılarak nodejs yapılandırıldı ve 14. satırda hangi sürüm olacağı belirtildi. 15. satır surge cli’ının iş akışımızı çalıştıracak olan ubuntu üzerine kurmayı 16. satır nuxtjs uygulamamızın paketlerini kurmayı 17. satır ise nuxt uygulamamızı deploy etmeye hazır hale getirip ana dizinde dist klasörüne yerleştirmemizi sağlıyor.

Peki gelelim 18. satıra. Aslında diğer run komutlarından hiçbir farkı bulunmuyor. Temelde aslında surge cli ile belirli bir klasörü (./dist/) belirleyeceğimiz(uygun olduğundan emin olmalıyız) domaine almış olduğumuz token ile yayınlamayı sağlıyor diyor ve geçiyor olacaktım. Ama orada farklı olan birşey var. **\${{ secrets.SURGE_DOMAIN }}** ve **\${{ secrets.SURGE_TOKEN }}**

Bunlar Github Actions içerisinde kullanacağımız ama halka açmamamız gereken alanlar. O zaman nereden tanımlanıyor gelin ona bir bakalım.

![İş akışı tanımlama](https://miro.medium.com/max/1332/1*pW6dH9rC5UZc_mK2arTAnw.png)

Secret alanları tanımlama
Yukarıdan resimden takip ederek buraya ulaşabilirsiniz. Çok basit bir anahtar-değer ikilisi şeklinde gizli verilerimizi tutmamıza yardımcı oluyor. Daha sonra ise iş akışı dosyamızda bunlara **\${{ secrets.ANAHTAR}}** şeklinde erişebiliyoruz. İhtiyacımız olan iki sırrı :) buraya tanımlayalım.

> **Not:** SURGE_DOMAIN için örneğin benim-ornek-nuxt-appim.surge.sh gibi olabildiğince benzersiz bir değer vermeye çalışın. O alan adı boşta değilse hata almamız kaçınılmaz.

Artık bu depoya bir push yapıldığında bu iş akışı devreye girecek ve uygulamamız surge.sh’a gönderilecek.

![İş akışı tanımlama](https://miro.medium.com/max/1916/1*Ji6CWv_3w5F45wZ06oUj2g.png)

## **Bitirirken**

NuxtJs özelinde bir uygulamanın Github Actions ile Surge.sh’a nasıl deploy edilebileceğini dilim döndüğünce anlatmaya çalıştım. Bu süreçleri kurgulamak oldukça keyiflidir. Umarım sizde deneyimlerken ve okurken keyif alırsınız. İyi çalışmalar diliyorum.
