'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false},
  ],
  checkFilter : false,
  searchVal : '',
};
  
// Below is the template html

function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <input type="text" name="edit-item" class="edit-item" placeholder="Edit item name">
        <button type="button" id="edit-item-button"> Edit </button>  
      </div>
    </li>`;
}


// Below is the function that executes the creation of html

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

// Below selects what is to be rendered
function renderShoppingList() {
  console.log('`renderShoppingList` ran');
  let printedShoppingList = STORE.items;
  if (STORE.checkFilter === true) {
    printedShoppingList = STORE.items.filter( item => item.checked === false);
    //checks if the filter for checked items is on
    //then will set the printedShoppingList array to the filtered array
  } else if(STORE.searchVal !== '' && STORE.checkFilter === false) {
    printedShoppingList = STORE.items.filter( item => item.name === STORE.searchVal);
    //will check if there is an input in the searchVal
    //then will filter the elements with the search value only
  }
  const finalShoppingList = generateShoppingItemsString(printedShoppingList);

  $('.js-shopping-list').html(finalShoppingList);
  // insert that HTML into the DOM
}

// Below here are for filtering through the items


// 1. These few blocks will check for filtering out checked items

function checkSTORECheck (checkProperty) { 
  if (checkProperty === true){
    STORE.checkFilter = true;
  } else {
    STORE.checkFilter = false;
  }
  console.log($('.hide-checked-items').prop('checked'));
}

function handleSortChecked(){
  $('#hide-checked-items').on('change', '.hide-checked-items', function (event) {
    event.preventDefault();
    checkSTORECheck($('.hide-checked-items').prop('checked'));
    console.log('handleSortChecked button has been clicked');
    console.log(STORE.checkFilter);
    renderShoppingList();
  });
}

//2. This will filter for the search value


function handleSearch () {
  $('#js-shopping-list-form').on('click', '.js-search-button', event => {
    event.preventDefault();
    console.log('Search button clicked.');
    STORE.searchVal = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    
    renderShoppingList();
  });
}



// Below here are for editing invidual elements 


// 1. adding new items: 
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

// 2. Making a checked item checked

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}

//    > gets the item's index from the html block created
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// 3. Delete an item from the list

function deleteList(itemIndex){
  STORE.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(e){
    const itemIndex = getItemIndexFromElement($(this));
    deleteList(itemIndex);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran');
}

// 4. Change the name of an item

function replaceItemName(newItemName,index){
  //passes newItemName and index
  STORE.items[index].name = newItemName; 
  //look into index of item array, access the name property of the obj, change to new value
}

function handleEditItem(){
  $('.js-shopping-list').on('click', '#edit-item-button', event => {
    const newItemName = $(event.currentTarget).closest('li').find('.edit-item').val();
    // takes the value from the input
    const index = $(event.currentTarget).closest('li').data('item-index');
    //takes the value from the class and converts it to a number to index in array w/ function above
    replaceItemName(newItemName,index);
    renderShoppingList();
  });
}



function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleSortChecked();
  handleEditItem();
  handleSearch ();
}

$(handleShoppingList);