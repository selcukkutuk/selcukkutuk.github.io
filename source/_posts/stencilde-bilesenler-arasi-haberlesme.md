---
title: Stencil’de Bileşenler Arası Haberleşme
date: 2019-05-16 00:28:10
categories:
  - Web Components
tags:
  - stenciljs
  - web components
  - bileşen iletişimi
---

<center>
![Giriş Logosu](https://cdn-images-1.medium.com/max/1000/1*JDAq9NYdpV5maeQ2jqzkyA.png)
</center>

Stencil aracının ne olduğuna [bir önceki yazımda](https://selcukkutuk.com/2019/05/15/stencil-e-giris/) giriş seviyesinde değinmeye çalışmıştım. Şimdi biraz daha derinlerine inmeye çalışacağım. Bileşen temelli araçların hemen tümünde bileşenler arası haberleşme/etkileşim (component communication/interaction) önem arz eder. Bu nedenle değineceğim ilk konu bu olacak.

<!-- more -->

Stencil aracında bileşenler arasındaki haberleşme Üst Bileşenden Alt Bileşene (Parent to Child), Alt Bileşenden Üst Bileşene (Child to Parent) olmak üzere iki şekilde gerçekleşmektedir. Aşağıdaki hazırladığım görsel ile basit bir şekilde bu haberleşmeyi anlatmaya çalıştım.

<center>
![Bileşenler arası heberleşme](https://cdn-images-1.medium.com/max/800/1*VWfiCojQK8hEkpLrfyz2QQ.png)
</center>

### **Üst Bileşen’den Alt Bileşene (Parent to Child)**

Bileşenler arasındaki haberleşmenin en anlaşılır ve kolay olanıdır. Alt bileşen içerisinde bir **@Prop()** tanımlanır ve özellik olarak değer ataması yapılır. Basit bir örnek ile gösterecek olursak :

> **Not:** Örnek dilini belki makaleyi yabancı okurlarda inceleyebilir diye affınıza sığınarak İngilizce tutmaya çalışacağım.

```ts
//*** profile-image.tsx
@Prop() imageUrl: string = '';
render(){
 return(<img src={this.imageUrl} alt="My profile image" />)
}
//***
```

Alt bileşenimiz de **imgUrl** adında bir özellik alabileceğimizi belirtiyoruz. Ve gelen veriyi img tagının src’sine aktarıyoruz. Daha sonra bu bileşeni kullanacak olan profile bileşenini düzenliyoruz:

```ts
//*** profile.tsx
@State() currentUser: any = {
name:'Selçuk Kütük',
image:'http://localhost:3333/img/profileimg.jpeg'
}
render(){
return (

   <div>
    <h3>Hello {this.currentUser.name}</h3>
    <hr />
    <profile-image image-url={this.currentUser.image}></profile-image>
 )
}
//***
```

Profile bileşenin içerisinde profile-image bileşenini kullanırken bu bileşenin image-url özelliğine profile bileşeninde bulunan currentUser nesnesinin image özelliğini gönderiyoruz.

> **Not:** Süslü parantez (curly braces) “{}” JSX söz diziminde Javascript’e geçtiğinizi belirtmek için kullanılır. Böylece bileşen içerisinde yer alan bir değişkenin değerini bir html özelliğine aktarabiliriz.

```html
<profile></profile>
```

<center>
![Elde edilecek yaklaşık sonuç](https://cdn-images-1.medium.com/max/800/1*zCALNRycUtO1q9wq163FVg.png)
</center>

### **Alt Bileşen’den Üst Bileşene (Child to Parent)**

Mantığı basit olmasına karşın anlaşılması ilk haberleşme şekline göre biraz daha zordur. Öncelikle sorunu bir tanımlayalım. Bu haberleşmede amiyane tabirle bileşen elimizin altında değil. Aksi gibi elimizin üstünde :). Bu nedenle Alt bileşende gerçekleşen bir **olaydan haberdar olmak** ve varsa gerçekleşen olayın sonucunda oluşan değeri de elde etmek istiyoruz. İşte tam burada 3 yeni kavram karşımıza çıkıyor. @Event() ve @Listen() dekarator’ü, EventEmitter arayüzü.

**@Event():** Tanımlanacak değişkenin üst bileşenlere haber göndereceğini işaretlemeye yarayan dekarator. Örneğin, @Event() profileImageUpdated: EventEmitter;

**EventEmitter:** Tanımlanan değişkenin tipini ifade eder. İçerisinde bulunan emit methodu ile Üst bileşenlere haber ve gerekirse veri gönderir. Örneğin, profImgUpd.emit(‘newprofileimg.jpeg’)

**@Listen():** Üst bileşende işaretlenen method ile Alt bileşendeki gerçekleşen bir olaydan haberdar olunmasını sağlayan dekarator. Örneğin, @Listen(‘profileImageUpdated’) showInfo(event: CustomEvent){console.log(event.detail)}

O zaman ilk örneğimizi bu yeni konu ile genişletelim:

> **Not:** Event, EventEmitter, Listen @stencil/core kütüphanesinde yer almaktadır. Dahil etmeyi unutmayın.

```ts
import {Event, EventEmitter, Listen} from ‘@stencil/core’;
```

Şimdi profile-image bileşeninde ki işlemleri gerçekleştirelim.

```ts
//*** profile-image.tsx
@Prop() imageUrl: string = '';
@Event() profileImageUpdated: EventEmitter;
updateProfileImage(){
 let newProfileImageUrl = '...';
 this.profileImageUpdated(newProfileImageUrl);
}
render(){
 return(
  <button onClick={() => this.updateProfileImage()}>Update</button>
  <img src={this.imageUrl} alt="My profile image" />
 )
}
//***

```

Şimdi ise profile bileşeninde ki işlemleri gerçekleştirelim.

```ts
//*** profile.tsx
@State() currentUser: any = {
  name:'Selçuk Kütük',
  image:'http://localhost:3333/img/profileimg.jpeg'
}
@State() newProfileUrl: string = '';
@Listen('profileImageUpdated')

profileImageUpdatedHandler(event: CustomEvent){
  this.newProfileUrl = event.detail;
}

render(){
  return (
    {
      this.imageUrl !== '' &&
      <span>
        Profile image updated.
        New image: <img src={this.newProfileUrl} alt="New image" />
      </span>
    }
    <h3>Hello {this.currentUser.name}</h3>
    <hr />
    <profile-image image-url={this.currentUser.img}></profile-image>
  )
}
//***
```

Şimdi haberleşmenin keyfini çıkaralım.

<center>
![Projenin bitmiş hali](https://cdn-images-1.medium.com/max/800/1*EK7tA9bVlyHaGKAvcEjM3Q.gif)
</center>

Stencil yazı dizisinin ikincisinde bileşenler arasındaki haberleşmeyi ele almaya çalıştım. Bir sonraki konuda görüşmek üzere. Herkese iyi çalışmalar dilerim.
