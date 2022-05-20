(function(){
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0 ){
            return;
        }
        socket.emit('newuser',username);
        uname = username;
        app.querySelector('.join-screen').classList.remove("active")
        app.querySelector('.chat-screen').classList.add("active")
    })

    app.querySelector("#send-msg").addEventListener("click",function(){
        let msg = app.querySelector("#msg-input").value;
        if(msg.length == 0 ){
            return;
        }
        renderMessage("my",{
            username:uname,
            text:msg
        });
        socket.emit("chat",{
            username:uname,
            text:msg
        })
        msg = app.querySelector("#msg-input").value = '';
    });

    app.querySelector("#exit-chat").addEventListener('click',function(){
        socket.emit("exituser",uname);
        window.location.href = window.location.href;
    });

    socket.on("update",function(update){
        renderMessage("update",update)
    })
    socket.on("chat",function(msg){
        renderMessage("other",msg)
    })

    function renderMessage(type,msg){
        let msgcontainer = app.querySelector(".msgs");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class"," msg my-msg")
            el.innerHTML = `
                <div>
                    <div class="name" style=' font-weight:bold; ' > You </div>
                    <div class="text"> ${msg.text} </div>
                </div>
            `
            msgcontainer.appendChild(el);

        }else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class"," msg other-msg")
            el.innerHTML = `
                <div>
                    <div class="name"> ${msg.username} </div>
                    <div class="text"> ${msg.text} </div>
                </div>
            `
            msgcontainer.appendChild(el);

        } else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update")
            el.innerText = msg
            msgcontainer.appendChild(el);
        }
        msgcontainer.scrollTop = msgcontainer.scrollHeight - msgcontainer.clientHeight;
    }


})()