let userArr = [];
var userId;


//发送请求
$.ajax({
    url:'/users',
    type:'get',
    success:function(res){
        userArr = res;
        render();
    }
})

//封装render方法 用于渲染页面
function render(){
    let html = template('userTpl',{data:userArr});
    $('tbody').html(html);
}

//上传头像功能实现
$('#avatar').on('change', function () {
    var formData = new FormData();
    formData.append('avatar', this.files[0]);

    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉$.ajax不要解析请求参数
        processData: false,
        //告诉$.ajax方法不要设置请求参数的类型
        contentType: false,
        success:function(res){
            //实现头像预览 
            $('#previewImg').attr("src",res[0].avatar);
            $('#hidden').val(res[0].avatar);
        }
    })
})

//当用户点击提交按钮
$('#btnAdd').on('click', function () {
    //jquery中提供serialize()获取表单提交的内容，将内容装化为参数字符串
    let data = $("#userForm").serialize();
    $.ajax({
        type: 'post',
        url: '/users',
        data: data,
        success: function (res) {
            // location.reload();
            userArr.shift(res);
            render();
            //将表单数据清空
            $("input[type = 'email']").val('');
            $("input[name = 'nickName']").val('');
            $("input[name = 'password']").val('');
            $("#status0").prop('checked',false);
            $("#status1").prop('checked',false);
            $("#admin").prop('checked',false);
            $("#normal1").prop('checked',false);
            $("#hidden").val('');
            $("#previewImg").attr('src','../assets/img/default.png')
        },
        error: function (err) {
            console.log(err);
        }
    });
});

// 给编辑按钮注册点击事件 事件委托 因为有事件冒泡机制
$('#userBox').on('click', '.edit', function () {
     userId = $(this).attr('data-id');

    $('h2').html('编辑用户');
    // 获取当前被点击的这个元素的父级元素 tr 
    let tr = $(this).parents('tr');
        // console.log(tr);
        
    $('#previewImg').attr("src", tr.find('img').attr('src'));
    $('#hidden').val(tr.find('img').attr('src'));
    $('input[name="email"]').val(tr.children().eq(2).text());
    $('input[name="nickName"]').val(tr.children().eq(3).text());

    if (tr.children().eq(4).text() == '激活') {
        $('#status1').prop('checked', true);
    } else {
        $('#status0').prop('checked', true);
    }


    if (tr.children().eq(5).text() == '超级管理员') {
        $('#admin').prop('checked', true);
    } else {
        $('#normal').prop('checked', true);
    }

    // 将添加按钮隐藏 同时 将遍历按钮显示出来 
    $('#btnAdd').hide();
    $('#btnEdit').show();
});

//完成编辑功能
$('#btnEdit').on('click',function(){
    // 收集表单提交数据
    let data  = $("#userForm").serialize();

    $.ajax({
        type:'PUT',
        url:'/users/' + userId,
        data:data,
        success: function(res){
            // 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置
            let index = userArr.findIndex(item => res._id == item._id);
            // console.log(index);
            // userArr存放了所有get请求的来的数据，让返回来的值重新赋值给对应id的数组中的元素项
            userArr[index] = res;
            //userArr改变后重新渲染到页面
            render();
            // 渲染完毕后还原
            $('h2').text('添加新用户');

            $('#previewImg').attr("src", '../assets/img/default.png');
            $('#hidden').val('');
            // 表示将这个输入框 设置为启用
            $('input[name="email"]').prop('disabled', false).val('');
            $('input[name="nickName"]').val('');
            // 表示将这个输入框 设置为启用
            $('input[name="password"]').prop('disabled', false);

            $('#status0').prop('checked', false)
            $('#status1').prop('checked', false)
            $('#admin').prop('checked', false)
            $('#normal').prop('checked', false)

            $('#btnAdd').show();
            $('#btnEdit').hide();
        },
        error:function(err){
            console.log(err);
        }
    })

})

//单个用户的删除
$('#userBox').on('click','.del',function(){
    let id = $(this).attr('data-id');
    let flag = confirm('您确定删除此用户吗？');
    if(flag){
        $.ajax({
            type:'delete',
            url:'/users/' + id,
            success:function(res){
                let index = userArr.findIndex(item=>{
                    return item._id === res._id;
                });
                userArr.splice(index,1);
                render();
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    
})