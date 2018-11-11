import '../styles/index.scss';

const menuNode = document.querySelector('.categories');
let menuArray = [];

const toggleMenu = (obj,parentCategory) => {
    let subElements = obj.querySelectorAll(`div[parentCategory="${parentCategory}"]`);
    for (let i = 0; i<subElements.length; i++) {
        subElements[i].classList.toggle('hidden')
    }
};

const buildAndReturnMenuArray = (data) => {
    let menuArray = [];
    let workArray = [];

    data.forEach(obj => {
        const item = obj;
        const parentCategory = item.parentCategory;
        const categoryId = item.categoryId;

        if (workArray[parentCategory]) {
            const menuItem = {
                parentCategory,
                item,
            };
            if (!workArray[parentCategory].items) {
                workArray[parentCategory].items = [];
            }
            workArray[parentCategory].items.push(menuItem);
            workArray[categoryId] = menuItem;
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

const buildMenu = (parent,items) => {
    items.forEach(obj => {
        if (obj) {
            let element = document.createElement('div');
            element.classList.add(`lvl_${obj.item.level}`);
            element.classList.add(`item`);
            element.setAttribute('parentCategory',`${obj.item.parentCategory}`);
            element.onclick = () => toggleMenu(element,obj.item.categoryId);
            element.innerHTML = `<span class='item_description'>${obj.item.categoryName}</span><span class='menu_toggle'>+<span>${obj.item.eventsCount}</span></span>`;
            parent.appendChild(element);

            // if there are sub-items call buildMenu to build sub menu
            if (obj.items && obj.items.length > 0) {
                let subElement = document.createElement('div');
                subElement.classList.add(`menu_lvl_${obj.item.level+1}`);
                element.appendChild(subElement);
                buildMenu(subElement, obj.items);
            }
        }
    });
};

const fetchMenuData = () => {
    return fetch('https://www.lionsbet.com/rest/market/categories')
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else
                throw new Error('Something went wrong :(');
        })
};

const handleDisplayError = (error) => {
    let errorNode = document.createElement('div');
    errorNode.classList.add('error_message');
    errorNode.innerHTML = `<p>There has been an error:<div>${error.message}</div></p>`;
};

fetchMenuData()
    .then(data => {
        menuArray = buildAndReturnMenuArray(data.data);
        buildMenu(menuNode,menuArray);
        console.log(menuArray);
    })
    .catch(error => {
        handleDisplayError(error);
    });




