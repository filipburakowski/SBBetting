let menuArray = [];

const buildAndReturnMenuArray = function (data) {
    let menuArray = [];
    let workArray = [];

    data.forEach(obj => {
        var item = obj;
        var parentCategory = item["parentCategory"];
        var categoryId = item["categoryId"];

        if (workArray[parentCategory]) {
            var item = {
                parentCategory,
                item,
            };
            if (!workArray[parentCategory].items) {
                workArray[parentCategory].items = [];
            }
            workArray[parentCategory].items.push(item);
            workArray[categoryId] = item;
        }
        else {
            workArray[categoryId] = {
                parentCategory,
                item,
            };
            menuArray.push(workArray[categoryId]);
        }
    });
    return menuArray;
};

function fetchMenuData () {
    return fetch('https://www.lionsbet.com/rest/market/categories')
        .then(response => response.json())
}

fetchMenuData()
    .then(data => {
        console.log(data.data);
        menuArray = buildAndReturnMenuArray(data.data);
        console.log(menuArray);
    });




