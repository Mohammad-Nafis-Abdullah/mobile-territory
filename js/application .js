const searchText = document.getElementById('search-field');
const spinner = document.getElementById('spinner');
const content = document.getElementById('content');
const showBtn = document.getElementById('show-btn');
const detailsArea = document.getElementById('details-modal');
const counterArea = document.getElementById('counter-container').style;
const resultCount = document.getElementById('result-counter');
let newdataSet;

// active enter button for searching
searchText.addEventListener('keyup',(event)=>{
    if (event.key=='Enter') {
        sendUrl();
    }
})

// fetching data from url and pass to the calling function; url = api_url  && fn = function name, which is declare to recieve the fetching data for nxt operation;
const loadData = (url,fn) => {
    loading('flex');
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.status && searchText.value!=''){
            fn(data);
        }else{
            counterArea.display='none';
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
                <h5 class="card-title text-center">No Result Found !!</h5>
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
    loadData(url,countCard);
}

// count the result for a search operation
const countCard = (dataSet) => {
    loading('none');
    newdataSet = dataSet.data;

    // show quantity of searching result
    resultCount.innerText = newdataSet.length;
    counterArea.display='block';

    if (newdataSet.length > 20) {
        displayCard(newdataSet.slice(0,20),'grid');
    }
    else {
        displayCard(newdataSet,'none');
    }
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
                    <button onclick="loadDetails('${data.slug}')" type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Details
                    </button>
                </div>
            </div>
        `;
        content.appendChild(card);
    });
    toggleBtn(btnProperty);
}

// showAll() will be called if search result is more than 20
const showAll = () => {
    displayCard(newdataSet.slice(20),'none');
}

// load Details data for clicked card
const loadDetails = (id) => {
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    fetch(url)
    .then(response => response.json())
    .then(dataSet => setDetails(dataSet.data))
}


// set details data after clicking an individual card
const setDetails = (data) => {
    detailsArea.textContent = '';
    console.log(data);

        const details = document.createElement('div');
        details.classList.add('modal-content');

        details.innerHTML=`
            <div class="modal-header">
                <div>
                    <h4 class="modal-title" id="exampleModalLabel">${data.name}</h4>
                    <p class="modal-title text-secondary">${data.releaseDate!=''?data.releaseDate:"Unknown Release Date"}</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card border border-0">
                    <div class="card-img-top p-2 text-center mb-2" style="height: 200px;">
                        <img src="${data.image}" alt="..." style="max-width: 80%;">
                    </div>
                    <div class="card-body row mt-3">
                        <div id="features" class="col-12">
                        <p class="fs-5 mb-2 fw-bold">Main Features</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        detailsArea.appendChild(details);
        extractNestedObj(data.mainFeatures,'features');

        if (data.others!=undefined) {
            const p = document.createElement('p');
            p.innerText = 'Others';
            p.classList.add('fs-5');
            p.classList.add('mt-3');
            p.classList.add('mb-2');
            p.classList.add('fw-bold');
            document.getElementById('features').appendChild(p);

            extractNestedObj(data.others,'features')
        }
}

const extractNestedObj = (obj,id) => {
    const parent = document.getElementById(id);

    for (const key in obj) {
        // console.log(`${key} : ${obj[key]}`);
        const div = document.createElement('div');
        div.classList.add('d-flex');
        div.classList.add('justify-content-center');
        div.classList.add('flex-wrap');
        div.classList.add('align-items-stretch');
        div.classList.add('ps-2');

        if (key == 'sensors') {
            const sensorsName = obj[key].join(',\n');
            div.innerHTML=`
            <p class="text-dark fs-6" style="flex: 0 0 30%">${key} :</p>
            <p class="text-secondary fs-6" style="flex: 0 0 70%">${sensorsName}</p>
        `;
        }
        else{
            div.innerHTML=`
            <p class="text-dark fs-6" style="flex: 0 0 30%">${key} :</p>
            <p class="text-secondary fs-6" style="flex: 0 0 70%">${obj[key]}</p>
        `;
        }
        parent.appendChild(div);
    }
}
