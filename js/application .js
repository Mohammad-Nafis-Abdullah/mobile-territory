const searchText = document.getElementById('search-field');
const spinner = document.getElementById('spinner');
const content = document.getElementById('content');


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
    })
}

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


const loadData = () => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText.value}`;
    getData(url,consoleData);
}

const consoleData = (data) => {
    loading('none');
    console.log(data);
}
