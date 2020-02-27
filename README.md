# l-waterfall

a equal-height row waterfall layout case
等高瀑布流布局方案

当图片为有限个数时，使用传统的等高布局可能会导致最后一行无法充满整行，使得页面不太美观。

因此针对这个问题提出的一种解决方式。


LWaterfall.create(option: object)

option配置：

param | desc
---|---
container | 瀑布流容器选择器
imgArr    | 图片数组，数组每项应该至少含有width,height
rowHeight | 自定义行高，但因为缩放所以最后的行高可能不会等于这个行高
pageSize  | 如果imgArr.length != pageSize，则不需要对最后一行进行缩放


```
///使用方式
let waterfall = LWaterfall.create({
    container: '.container', 
    imgArr: img, 
    rowHeight: 280, 
    pageSize: img.length
});
```

