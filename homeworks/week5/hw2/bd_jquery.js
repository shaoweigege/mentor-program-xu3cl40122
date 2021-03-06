function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function delete_cookie(cookie_name){
  var cookie_date = new Date ( );  // current date & time
  cookie_date.setTime (cookie_date.getTime() - 1);
  document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
} 

const dq = (n) =>{
    return document.querySelector(n)
}
const dqa = (n) =>{
    return document.querySelectorAll(n)
}

const addMainComment = (commentText) =>{
    $.ajax({
        url: 'addComment.php',
        type: 'POST',
        data:{
            content : commentText,
            parent_id : 0
        },
        success:function(resp){
            //res = JSON.parse(resp)
            $('.mainComment').val('')
            $('.row').prepend(`
                <div class="col">
                    <div class="inf">
                        <p class="whoComment">${resp.user}</p>
                        <p class="time">${resp.time}</p>
                    </div>
                    <input type="hidden" value=${resp.id}>
                    <p class="commentContent">${commentText}</p>
                    <div class="modify_button"  tabindex="100">...</div>
                    <div class="modify_navList">
                            <ul>
                                <li class="edit_button"><i class="fa fa-pencil icon"></i>編輯</li>
                                <li class="delete_button"><i class="fa fa-times icon"></i>刪除</li>
                            </ul>
                        </div>
                    <div class="replyContainer">
                    <div class="replyFormContainer">
                        <form class="replyForm">
                            <textarea  class="replyComment" placeholder="想說什麼嗎?"></textarea>
                            <input type="submit" name="" class="submit_button">
                            <input type="hidden" name="comment_id" value=${resp.id}>
                        </form>
                    </div>
                    <div class="replyButton">reply</div>
                    </div>
                </div>`)
        },
        error: function(){
            alert('error')
        }
    })

}

const addReplyComment = (commentText,parent_id)=>{
    $.ajax({
        url: 'addComment.php',
        type: 'POST',
        data: {
            content : commentText,
            parent_id : parent_id
        },
        success : (resp)=>{
            document.location.href = 'board.php'
        },
        error: function(){
            alert('error')
        }
    })
}

const editComment =(commentText,comment_id)=>{
    $.ajax({
        url: 'editComment.php',
        type: 'POST',
        data: {
            content : commentText,
            comment_id : comment_id,
            type : 'edit'
        },
        success : (resp)=>{
            if (resp.result == 'notYour'){
                alert('無權限修改該留言')
                document.location.href = 'board.php'
            }else{
                document.location.href = 'board.php'
            }
        },
        error: function(){
            alert('error')
        }
    })
    
}

const deleteComment = (comment_id)=>{
    $.ajax({
        url: 'editComment.php',
        type: 'POST',
        data: {
            comment_id : comment_id,
            type : 'delete'
        },
        success : (resp)=>{
            if (resp.result == 'notYour'){
                alert('無權限刪除該留言')
            }else{
                document.location.href = 'board.php'
            }
        },
        error: function(resp){
            alert('error')
        }
    })
}

$(document).ready(()=>{
     // --- 回覆表單toggle ---
    $(document).on('click','.replyButton',(e)=>{
        $(e.target).prev().toggleClass('display-block')
    })

    // --- 修改留言button UI ---
    $(document).on('click','.modify_button',(e)=>{
        $(e.target).next().toggleClass('display-block')
    })
     $(document).on('focusout','.modify_button',(e)=>{
        setTimeout(()=>{
            $(e.target).next().toggleClass('display-block')
        },400)
    })
    // --- 修改留言 ---
    $(document).on('click','.edit_button',(e)=>{
        let beForm = $(e.target).parent().parent().parent().children('p.commentContent').text()
        let comment_id = $(e.target).parent().parent().parent().children('input[type="hidden"]').val()
        $(e.target).parent().parent().parent().children('p.commentContent').html(`
            <form class="editForm">
                    <textarea  class="replyComment">${beForm}</textarea>
                    <input type="submit" name="" class="submit_button">
                    <input type="hidden" name="comment_id" value="${comment_id}">
                </form> `
            )
    })
    // --- log out ---
    dq('.logout').addEventListener('click',()=>{
        delete_cookie("board_random_id")
        document.location.href='signup.html'
    })

    // 送出留言
    $(document).on('submit',(e)=>{
        e.preventDefault()
        // if 是主留言
        if($(e.target).hasClass('mainComment_form')){
            if($(e.target).find('textarea').val() != ''){
                addMainComment($(e.target).find('textarea').val())
            }
        }
        // if 是回覆
        else if($(e.target).hasClass('replyForm')){
            let comment_id = $(e.target).find("input[name='comment_id']").val()
            let commentText = $(e.target).find('textarea').val()
            if(commentText !=''){
                addReplyComment(commentText,comment_id)
            }
        }
        // if 是修改留言
        else if($(e.target).hasClass('editForm')){
            let commentText = $(e.target).find('textarea').val()
            let comment_id = $(e.target).find("input[name='comment_id']").val()
            editComment(commentText,comment_id)
        }
    })

    // --- 刪除留言 ---
    $(document).on('click','.delete_button',(e)=>{
        let comment_id = $(e.target).parent().parent().parent().children('input[type="hidden"]').val()
        deleteComment(comment_id)
    })
})