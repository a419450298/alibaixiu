$('#userForm').on('submit',function(){
    //获取表单提交的内容，将内容装化为参数字符串
    var formData = $(this).serialize();
    $.ajax({
        type:'post',
        url:'/users',
        data: formData,
        success:function(){
            location.reload();
        },
        error:function(){
            alert('用户添加失败');
        }
    })


    return false;
})