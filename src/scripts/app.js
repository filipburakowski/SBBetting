import '../styles/index.scss';

const menuNode = document.querySelector('.categories');
let menuArray = [];

const toggleMenu = (obj, parentCategory) => {
    let plusMinusElement = obj.querySelector('.menu_toggle');
    let subElements = obj.querySelectorAll(`div[parentCategory="${parentCategory}"]`);

    if (plusMinusElement.innerHTML === '+') {
        plusMinusElement.innerHTML = '-';
        for (let i = 0; i < subElements.length; i++) {
            subElements[i].classList.remove('hidden');
        }
    } else {
        plusMinusElement.innerHTML = '+';
        for (let i = 0; i < subElements.length; i++) {
            subElements[i].querySelector('.menu_toggle').innerHTML = '+';
            subElements[i].parentNode.querySelectorAll('[parentcategory]').forEach(node => {
                node.classList.add('hidden');
            });
        }
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

const buildMenu = (parent, items) => {
    items.forEach(obj => {
        if (obj) {
            let mainElement = document.createElement('div');
            let subElement = document.createElement('div');
            mainElement.classList.add(`lvl_${obj.item.level}`);
            subElement.classList.add(`menu_lvl_${obj.item.level}`);

            //hide if element is not first level of menu
            if (!subElement.classList.contains(`menu_lvl_1`)) {
                subElement.classList.add('hidden')
            }

            subElement.setAttribute('parentCategory', `${obj.item.parentCategory}`);
            subElement.setAttribute('categoryId', `${obj.item.categoryId}`);
            subElement.onclick = () => toggleMenu(mainElement, obj.item.categoryId);
            subElement.innerHTML = `<span class='item_description'>${obj.item.categoryName}</span><span class='event_count'><span class='menu_toggle'>+</span>${obj.item.eventsCount}</span>`;
            mainElement.appendChild(subElement);
            parent.appendChild(mainElement);

            // if there are sub-items call buildMenu to build sub menu
            if (obj.items && obj.items.length > 0) {
                buildMenu(mainElement, obj.items);
            }
        }
    });
};

const fetchMenuData = () => {
    return fetch('https://www.lionsbet.com/rest/market/categories')
        .then(response => {
            console.log(response);
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
    errorNode.innerHTML = `<div>There has been an error:<div>${error.message}</div></div>`;
};

fetchMenuData()
    .then(data => {
        menuArray = buildAndReturnMenuArray(data.data);
        buildMenu(menuNode, menuArray);
    })
    .catch(error => {
        handleDisplayError(error);
    });