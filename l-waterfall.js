class LWaterfall{

    constructor(){}

    /**
     * @param container //瀑布流容器选择器
     * @param imgArr //图片数组，数组每项应该至少含有width,height
     * @param rowHeight //自定义行高，但因为缩放所以最后的行高可能不会等于这个行高
     * @param pageSize //如果imgArr.length != pageSize，则不需要对最后一行进行缩放
     */
    static create({container, imgArr, rowHeight, pageSize}){
        const img = imgArr;
        // let rowMinHeight = 260, rowMaxHeight = 320;//每行有个行高范围260-320px
        let imgCustom = 280;//图片自定义高度，最终每行的行高会在这个值上下波动

        //传统木桶布局，当一行放不下后，开始下一行，容器行宽
        let containerDOM = document.querySelector(container);
        let waterfallContainerWidth = parseInt(this.getStyle(containerDOM).width) - parseInt(this.getStyle(containerDOM).paddingLeft) - parseInt(this.getStyle(containerDOM).paddingRight);
        let imgRow = [];//二维数组，存放每行图片
        let row = [];//当前行
        let rowShowWidths = 0;//当前加入的图片等比缩放后的宽之和
        let addRatio = 1;///设当前行小于addRatio*waterfallContainerWidth时，可以加图片
        let rowIndex = 0;//行号
        const gap = 10;//图片之间的间隔

        //将图片放入行中
        let addTime = 0;
        rowHeight = rowHeight || 260;//先定一个基准行高，所有图片以rowHeight为基准，图片真实宽高比进行缩放，得到等高的图片
        img.forEach((item, index, thisImg) => {
            if(rowShowWidths >= waterfallContainerWidth * addRatio){
                imgRow.push({rowIndex:rowIndex, row, rowShowWidths});
                row = [];
                rowShowWidths = 0;//重置为0
                rowIndex++;
            }
            if(rowShowWidths < waterfallContainerWidth * addRatio){
                thisImg[index].wh = item.width / item.height;//图片宽高比
                thisImg[index].showHeight = rowHeight;//图片显示的高度
                thisImg[index].showWidth = rowHeight * thisImg[index].wh;//图片显示的宽度
                rowShowWidths += thisImg[index].showWidth;
                addTime++;
                row.push(item);
            }
        });
        if(row.length != 0){
            row[row.length - 1].marginRight = 0;
            imgRow.push({rowIndex:rowIndex, row, rowShowWidths});
            row = [];
            rowShowWidths = 0;//重置为0
            rowIndex++;
        }

        //判断最后一行，这里校验
        let lastRow = imgRow[imgRow.length - 1];
        
        let lastRowWidth = lastRow.rowShowWidths;
        let scaleRatio = 0.7;///如果最后一行的宽度lastRowWidth >= scaleRatio * waterfallContainerWidth且图片的数量等于页面的容量（说明是满页），则最后一行可以缩放，否则拆分
        //将最后一行的图片依次加到前面行宽最小
        if(img.length === pageSize && lastRowWidth < waterfallContainerWidth * scaleRatio){
            //以rowShowWidths从小到大来排序， 最后一行不参与排序
            let img2 = imgRow.map(item=>item);
            img2.length -= 1;
            img2.sort((a,b)=>a.rowShowWidths-b.rowShowWidths);
            
            //取出最后一行的所有图片，并把图片加入到之前的行中，重新对加入的图片进行缩放，更新rowShowWidths
            for(let i = 0; i<lastRow.row.length;++i){
                let curRowHeight = imgRow[img2[i % img2.length].rowIndex].row[0].showHeight;
                lastRow.row[i].showHeight = curRowHeight;
                lastRow.row[i].showWidth = lastRow.row[i].wh * curRowHeight;
                imgRow[img2[i % img2.length].rowIndex].rowShowWidths += lastRow.row[i].showWidth;
                imgRow[img2[i % img2.length].rowIndex].row.push(lastRow.row[i]);
            }
            imgRow.pop();//删除最后一行
        }

        //最后对所有行的图片进行缩放， 
        imgRow.forEach((item, index, thisImgRow) => {
            let rowWidthSum =0;
            let imgArr = item.row;//取出图片
            let rowShowWidths = item.rowShowWidths;
            ///rowShowWidths / waterfallContainerWidth = rowHeight / newRowHeight
            let ratio = rowShowWidths / (waterfallContainerWidth - (imgArr.length - 1) * gap);
            let newRowHeight = rowHeight / ratio;

            //缩放每行的每张图片
            imgArr.forEach((img, i, thisImgArr) => {
                thisImgArr[i].showHeight = newRowHeight;
                thisImgArr[i].showWidth = Math.floor(thisImgArr[i].showHeight * thisImgArr[i].wh);
                if(i != imgArr.length - 1){
                    thisImgArr[i].marginRight = gap;
                }else{
                    thisImgArr[thisImgArr.length - 1].marginRight = 0;
                }
                rowWidthSum += thisImgArr[i].showWidth;
            });
            rowWidthSum += (imgArr.length - 1) * gap;
            if(rowWidthSum < waterfallContainerWidth){
                imgArr[imgArr.length - 1].showWidth += waterfallContainerWidth - rowWidthSum;
                rowWidthSum += waterfallContainerWidth - rowWidthSum;
            }
            thisImgRow[index].rowShowWidths = rowWidthSum;
        });

        return imgRow;
    }

    static getStyle(dom){
        return window.getComputedStyle(dom, null);
    }

}
