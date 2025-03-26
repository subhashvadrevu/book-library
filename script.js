const book_data = document.getElementById('book_data')
const prev = document.getElementById("prevPage")
const next = document.getElementById("nextPage")
const currentPage = document.getElementById("currPage")
const searchBar = document.getElementById('searchBar')
let pageNumber = 1
let pageLimit = 5

const onListView = () => {
    book_data.classList.add('list-view')
    book_data.classList.remove('grid-view')
}

const onGridView = () => {
    book_data.classList.add('grid-view')
    book_data.classList.remove('list-view')
}


const getBookData = async(pp, np, filter, sorting) => {

    const url = `https://api.freeapi.app/api/v1/public/books?page=${pageNumber}&limit=${pageLimit}&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        let bookData = data.data.data


        // -1 means, a comes before b
        // 1 means, a will come after b
        // 0 is, a = b

        // sorting === 1 , means ascending order
        if(sorting === 1) {
            bookData = bookData.sort((a, b) => {
                if(a.volumeInfo.title < b.volumeInfo.title) {
                    return -1
                }
                else if(a.volumeInfo.title === b.volumeInfo.title) {
                    return 0
                }
                else {
                    return 1
                }
            })
        }

        // sorting === -1 , means descending order
        else if(sorting === -1) {
            bookData = bookData.sort((a, b) => {
                if(a.volumeInfo.title < b.volumeInfo.title) {
                    return 1
                }
                else if(a.volumeInfo.title === b.volumeInfo.title) {
                    return 0
                }
                else {
                    return -1
                }
            })
        }

        if(pageNumber>data.data.totalPages || pageNumber<1) {
            if(pp) {
                pageNumber++
            }
            if(np) {
                pageNumber--
            }
            return;
        }


        book_data.innerHTML = ""
        currentPage.innerHTML = pageNumber
        for(let i=0;i<pageLimit;i++) {
            const bookDetails = bookData[i]
            const authorName = bookDetails["volumeInfo"]["authors"]
            const bookLink = bookDetails.volumeInfo["canonicalVolumeLink"]
            const bookCategories = bookDetails.volumeInfo["categories"]
            const bookDescription = bookDetails.volumeInfo["description"]
            const bookCoverImage = bookDetails["volumeInfo"]["imageLinks"]["thumbnail"]
            const bookPublishedYear = bookDetails.volumeInfo.publishedDate
            const bookPublisher = bookDetails.volumeInfo.publisher
            const bookTitle = bookDetails["volumeInfo"]["title"]
            const bookSubtitle = bookDetails.volumeInfo.subtitle

            if(filter!=="" && !bookTitle?.toLowerCase().includes(filter.toLowerCase())) {
                continue;
            }

            const container = document.createElement("div")
            container.classList.add('container')
            const contentContainer = document.createElement("div")
            contentContainer.classList.add('contentContainer')
            
            const img = document.createElement('img')
            img.src = bookCoverImage
            img.alt = bookTitle
            const link = document.createElement('a')
            link.href = bookLink
            link.target = "blank"
            link.appendChild(img)

            const strongText = document.createElement('strong')
            strongText.innerHTML = "Name : "+bookTitle

            const author = document.createElement('span')
            author.innerHTML = "Author : "+(authorName === undefined ? "Anonymous" : authorName)
            
            const pub = document.createElement('span')
            pub.innerHTML = "Published By : "+(bookPublisher === undefined ? "Anonymous" : bookPublisher)
            
            const pubYear = document.createElement('span')
            pubYear.innerHTML = "Year of Publication : "+bookPublishedYear
            
            container.appendChild(link)
            contentContainer.appendChild(strongText)
            contentContainer.appendChild(author)
            contentContainer.appendChild(pub)
            contentContainer.appendChild(pubYear)
            
            const one_book_data = document.createElement("div")
            one_book_data.classList.add("one_book_data")
            one_book_data.appendChild(container)
            one_book_data.appendChild(contentContainer)

            book_data.append(one_book_data)
        }
    } 
    catch (error) {
        console.error(error);
    }
}


const goToPrevPage = () => {
    pageNumber--
    searchBar.value = ""
    getBookData(true, false, "", 0)
}

const goToNextPage = () => {
    pageNumber++
    searchBar.value = ""
    getBookData(false, true, "", 0)
}

const asc = () => {
    getBookData(false, false, "", 1)
}

const des = () => {
    getBookData(false, false, "", -1)
}

searchBar.addEventListener('input', () => {
    getBookData(false, false, searchBar.value)
})