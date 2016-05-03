createTotalScore = function(itemList, price, creatorHTML) {
    var itemListTotal = [];

    itemListTotal.push({
        count: 1,
        name: itemList[0]
    });

    itemList.splice(0, 1);

    itemList.forEach(function(item) {
        for (var i = 0; i < itemListTotal.length; i++) {
            if (itemListTotal[i].name === item) {
                itemListTotal[i].count++;
                var found = true;
                break;
            }
        };

        if (!found) {
            itemListTotal.push({
                count: 1,
                name: item
            });
        }
    });

    var itemsSummaryHTML = '';

    itemListTotal.forEach(function(item) {
        itemsSummaryHTML = itemsSummaryHTML + item.name + '(' + item.count + ')' + '<br>';
    });

    var creatorTotalHTML = creatorHTML + '<hr>Summary items:<br>' + itemsSummaryHTML + 'Summary price: $' + price;
    return creatorTotalHTML;
}