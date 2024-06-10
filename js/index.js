document.addEventListener("DOMContentLoaded", function() {

    const currUser = {"id":1, "username":"pouros"}

    fetch("http://localhost:3000/books")
    .then((r)=> r.json())
    .then((books)=>{
        books.forEach((book) => {
            displayTitle(book)
            
        })
    })

    
    function displayTitle(book){
        const book_list = document.querySelector("#list")
        const li = document.createElement("li")
    
        li.textContent = book.title

        book_list.append(li)
        
        li.addEventListener("click",()=> {
            displayBook(book)
        })
    }

    function displayBook(book){
        const book_info = document.querySelector("#show-panel")
        book_info.innerHTML = " "
        const img = document.createElement("img")
        const title = document.createElement("h3")
        const subTitle = document.createElement("h3")
        const author = document.createElement("p")
        const h3 = document.createElement("h3")
        const description = document.createElement("p")
        const button = document.createElement("button")
        
        title.textContent = book.title
        subTitle.textContent = book.subtitle
        author.textContent = book.author
        description.textContent = book.description
        h3.textContent = "Liked By: "
        img.src = book.img_url
        button.textContent = "Like"


        let inLikes = false
        for(let index in book.users){
            if(book.users[index].username === currUser.username){
                inLikes = true
            }
        }
        if(inLikes){
            button.textContent = "unLike"
        }
        else{
            button.textContent = "Like"
        }


        book_info.append(img,title,subTitle,author,description,h3)   

        book.users.forEach((user)=>{
            const userHtml = document.createElement("p")
            userHtml.textContent = user.username
            book_info.append(userHtml)
        })
       
        book_info.append(button)

        button.addEventListener("click",()=>{
            if(!inLikes){
                console.log("Adding")
                book.users.push(currUser)
                fetch(`http://localhost:3000/books/${book.id}`,{
                    method: "PATCH",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        users: book.users
                    })
                })
                .then(r=>r.json())
                .then(newBook =>{
                    console.log(newBook)
    
                    displayBook(newBook)
                })
            }
            else{
                book.users = book.users.filter((user)=>{
                    if(user.username === currUser.username){
                        return false
                    }
                    return true
                })
                fetch(`http://localhost:3000/books/${book.id}`,{
                    method: "PATCH",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        users: book.users
                    })
                })
                .then(r=>r.json())
                .then(newBook =>{
                    displayBook(newBook)
                })
            }
        })
    }
})

