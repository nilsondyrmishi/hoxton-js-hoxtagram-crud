// write your code here
const imgContainer = document.querySelector('.image-container')

const state = {
    images: []
}

function getImages(){
    return fetch("http://localhost:3000/images")
        .then(function(resp){
            return resp.json()
        })

}

function createCommentOnServer(imageId, content) {
    return fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            imageId: imageId,
            content: content
        })
    }).then(function (resp) {
        return resp.json();
    });
}

function updateLikes(image) {
    return fetch(`http://localhost:3000/images/${image.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(image)
    }).then((resp) => resp.json());
}



function deleteCommentsFromServer(id){
    return fetch(`http://localhost:3000/comments/${id}`, {
        method: "DELETE"
    });
}

function deleteImages(id){
    return fetch(`http://localhost:3000/images/${id}`, {
        method: "DELETE"
    });
}
function renderImgContainer(){
    imgContainer.innerHTML = ''
    for (const container of state.images){
        const articleEl = document.createElement('article')
        articleEl.setAttribute('class', 'image-card')

        const titleTextEl = document.createElement('h2')
        titleTextEl.textContent = container.title

        const imgEl = document.createElement('img')
        imgEl.setAttribute('class', 'image')
        imgEl.setAttribute('src', container.image)

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'X'
        deleteBtn.addEventListener('click', function(){
            state.images = state.images.filter((target) => target !== container)
            deleteImages(container.id)
            render()
        })

        const likesDiv = document.createElement('div')
        likesDiv.setAttribute ('class', 'likes-section')

        const spanEL = document.createElement('span')
        spanEL.setAttribute('class', 'likes')

        const LikesBtn = document.createElement('button')
        LikesBtn.setAttribute('class', 'like-button')
        LikesBtn.textContent = '♥'
        LikesBtn.addEventListener('click', function(){
            updateLikes(container)
            render()
        })

        const commentUl = document.createElement('ul')
        commentUl.setAttribute('class', 'comments')

        for (const comment of container.comments){
            const commentLi = document.createElement('li')
            commentLi.textContent = comment.content

            const deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'delete'
            deleteBtn.addEventListener('click', function () {


                container.comments = container.comments.filter((target) => target !== comment)
                deleteCommentsFromServer(comment.id)
                render()
            })
            commentLi.append(deleteBtn)
            commentUl.append(commentLi)
        }

        const commentForm = document.createElement('form')
        commentForm.setAttribute('class', 'comment-form')

        const commentInput = document.createElement('input')
        commentInput.setAttribute('class', 'comment-input')
        commentInput.setAttribute('type', 'text')
        commentInput.setAttribute('name', 'comment')
        commentInput.setAttribute('placeholder', 'Add a comment')

        const cometBtnPost = document.createElement('button')
        cometBtnPost.setAttribute('class','comment-button')
        cometBtnPost.setAttribute('type','submit')
        cometBtnPost.textContent = 'Post'

        commentForm.addEventListener('submit' ,function(event){
            event.preventDefault()

            const content = commentForm.comment.value
            createCommentOnServer(container.id, content).then(
                function(commentsFromServer){
                    container.comments.push(commentsFromServer)
                    render()
                    commentForm.reset()
                })
        })
        likesDiv.append(spanEL, LikesBtn)
        commentForm.append(commentInput, cometBtnPost)
        articleEl.append(titleTextEl, imgEl, likesDiv, commentUl, commentForm, deleteBtn)
        imgContainer.append(articleEl)
    }
}
function render(){
    renderImgContainer()
}
getImages().then(function(image){
    state.images = image
    render()
})
render()
