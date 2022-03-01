const searchText = document.getElementById('search-field');
const spinner = document.getElementById('spinner');
const content = document.getElementById('content');
const showBtn = document.getElementById('show-btn');


// fetching data from url and pass to the calling function; url = api_url  && fn = function name, which is declare to recieve the fetching data for nxt operation;
const getData = (url,fn) => {
    loading('flex');
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.status && searchText.value!=''){
            fn(data);
        }else{
            loading('none');
            noResult();
        }
    });
};

// spinners show and hiding function with clearing the body of content
const loading = (dProperty) =>{
    content.textContent='';
    spinner.style.display = dProperty;
}

// no result mssg
const noResult = () => {
    const mssg = document.createElement('div');
    mssg.innerHTML=`
        <div class="card border-0 my-3">
            <div class="card-body text-danger d-inline-block mx-auto border border-danger rounded-3">
                <h5 class="card-title text-center">No Result Found For The Search !!</h5>
            </div>
        </div>
    `
    content.appendChild(mssg);
}

// show all button display function
const toggleBtn = btnProperty =>{
    showBtn.style.display=btnProperty;
}





// calling the function generating url against searching result and pass the url to a function to fetch
const sendUrl = () => {
    loading('none');
    toggleBtn('none')
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText.value}`;
    getData(url,countCard);
}

// display card in the content body
const displayCard = (array,btnProperty) => {
    array.forEach( data => {
        const card = document.createElement('div');
        card.classList.add('col-12');
        card.classList.add('col-md-4');

        card.innerHTML=`
            <div class="card border-1 rounded-1 pb-3" style="height: 400px;">
                <div class="card-img-top p-2 text-center" style="height: 200px;">
                    <img src="${data.image}" alt="..." style="max-width: 80%;">
                </div>
                <div class="text-center mt-auto">
                    <h5 class="card-title">${data.phone_name}</h5>
                    <p class="card-text">${data.brand}</p>
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Details
                    </button>
                </div>
            </div>
        `;
        content.appendChild(card);
    });
    toggleBtn(btnProperty);
}

// globally set for using in 2 function
let newdataSet;

// count the result for a search operation
const countCard = (dataSet) => {
    loading('none');
    newdataSet = dataSet.data;
    
    if (newdataSet.length > 20) {
        displayCard(newdataSet.slice(0,20),'grid');
    }
    else {
        displayCard(newdataSet,'none');
    }
}

// showAll() will be called if search result is more than 20
const showAll = () => {
    displayCard(newdataSet,'none');
}