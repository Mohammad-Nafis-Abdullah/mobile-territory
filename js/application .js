const searchText = document.getElementById('search-field');
const spinner = document.getElementById('spinner');


// fetching data from url and pass to the calling function
const getData = (url,fn) => {
    loading('flex');
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.status && searchText.value!=''){
            fn(data);
        }else{
            console.log('no data found');
            loading('none');
        }
    })
}

// spinners show and hiding function
const loading = (dProperty) =>{
    spinner.style.display = dProperty;
}

const loadData = () => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText.value}`;
    getData(url,consoleData);
}

const consoleData = (data) => {
    loading('none');
    console.log(data);
}
