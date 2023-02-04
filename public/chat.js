
function checkLogin() {
    if (!localStorage.getItem("token")) {
        window.location = "/login.html";
    }
}
checkLogin();

const chatForm = document.getElementById("chatForm");
const addFriendForm = document.getElementById("addFriendForm");
const addGroupForm = document.getElementById("addGroupForm");
const list = document.getElementById("list");
const gList = document.getElementById("gList");
const chatNav = document.getElementById("chatNav");
const chatDiv = document.getElementById("chatDiv");
const messages = document.getElementById("messages");
const logOut = document.getElementById("logOut");
logOut.onclick = () => {
    localStorage.clear();
    checkLogin();
}
var chatType, convId, conv;


const listListner = (e) => {
    if (e.target.id != "list" && convId != e.target.id) {
        chatType = "ooo";
        chatDiv.style = "";
        conv && conv.classList.remove("text-success");
        conv = e.target;
        conv.classList.add("text-success")
        convId = e.target.id;
        // console.log(chatType,convId);
        localStorage.removeItem("messages")
        localStorage.removeItem("myMsg")

        preData = [];
        preMy = [];
        messages.innerHTML = "";
        chatNav.innerHTML = ""
        loadData(e.target);
    }
    // 
}
list.addEventListener("click", listListner);



gList.addEventListener("click", (e) => {
    console.log(e.target.id, convId, chatType);
    if (e.target.id != "gList" && convId != e.target.id) {

        conv && conv.classList.remove("text-success");
        conv = e.target;
        conv.classList.add("text-success")

        messages.innerHTML = ""
        chatDiv.style = "";
        chatType = "group";
        convId = e.target.id;
        localStorage.removeItem("messages")
        localStorage.removeItem("myMsg")
        preData = [];
        preMy = [];
        loadData(conv, gFirst = true);
    }
    console.log(e.target.id, convId, chatType);
})

var preData = JSON.parse(localStorage.getItem("messages"));
var preMy = JSON.parse(localStorage.getItem("myMsg"));
if (!preData) preData = [];
if (!preMy) preMy = [];


const intervalId = setInterval(() => {
    // loadData();
    loadFriendList();
    loadGroupList();
}, 1000);

async function loadData(ele, gFirst) {
    try {
        // console.log(preData,preMy);
        let messages;
        if (chatType === "ooo") {
            ele && ele.classList.remove("text-danger");
            messages = await axios.get(`/message?lastId=${preData.length && preData[0].id}&&chatType=${chatType}&&convId=${convId}`);
        }
        else if (chatType === "group") {
            ele && ele.classList.remove("text-danger")
            messages = await axios.get(`/message/group?lastId=${preData.length && preData[0].id}&&chatType=${chatType}&&convId=${convId}`);
            if (gFirst && messages.data.isAdmin) adminRights();
        }
        chatType && console.log(messages.data.data);
        if (chatType && messages.data.data[0].length) {
            console.log("inside");
            const preLength = messages.data.data[0].length + preData.length;
            const preMyLength = messages.data.data[1].length + preMy.length
            preData = messages.data.data[0].concat(preData.slice(0, preLength > 13 ? preLength - messages.data.data[0].length - 1 : preLength));
            preMy = messages.data.data[1].concat(preMy.slice(0, preMyLength > 13 ? preMyLength - messages.data.data[1].length - 1 : preMyLength));
            console.log(preData[0], preMy);
            localStorage.setItem("messages", JSON.stringify(preData));
            localStorage.setItem("myMsg", JSON.stringify(preMy));
            displayMsg(preData, preMy);
        }

    } catch (error) {
        intervalId && clearInterval(intervalId);
        console.log(error);
    }

}

async function loadFriendList() { //........OK..........
    try {
        const friends = await axios.get("/user/friend");
        list.innerHTML = ""
        for (const friend of friends.data.friends) {
            const li = document.createElement("li");
            li.classList = "nav-item nav-link border border-secondary text-center rounded-pill m-1 friends";
            if (chatType === "ooo" && friend.id == convId) li.classList.add("text-success");
            if (friend.notification) {
                li.classList.add("text-danger");
                if (chatType === "ooo" && friend.id == convId) loadData(li);
            }
            li.innerText = friend.name;
            li.id = friend.id;
            list.appendChild(li);
        }

    } catch (error) {
        console.log(error);
    }
}

async function loadGroupList() {
    try {
        const groups = await axios.get("/user/group");
        gList.innerHTML = "";
        for (const group of groups.data.groups) {
            const li = document.createElement("li");
            li.classList = "nav-item nav-link border border-secondary text-center rounded-pill m-1 groups";
            if (chatType === "group" && group.id == convId) li.classList += (" text-success");
            if (group.notification) {
                li.classList += " text-danger";
                if (chatType === "group" && group.id == convId) loadData(li)
            }

            li.innerText = group.name;
            li.id = group.id;
            gList.appendChild(li);
        }
    } catch (error) {

    }
}

function adminRights(params) {
    chatNav.innerHTML = "";
    const addMem = document.createElement("button");
    addMem.classList = "btn btn-sm btn-warning d-flex justify-content-end m-1";
    addMem.innerText = "Edit Group";
    chatNav.prepend(addMem);
    const dltBtn = document.createElement("button");
    dltBtn.classList = "btn btn-sm btn-danger d-flex justify-content-end m-1";
    dltBtn.innerText = "Delete Group";
    chatNav.prepend(dltBtn);
    const adminBtn = document.createElement("button");
    adminBtn.classList = "btn btn-sm btn-warning d-flex justify-content-end m-1";
    adminBtn.innerText = "Add Admin";
    chatNav.prepend(adminBtn);
    dltBtn.addEventListener("click", deleteGroup)
    addMem.addEventListener("click", addMember);
    adminBtn.addEventListener("click", addAdmin);
}

async function deleteGroup(params) {
    if (confirm("Are you sure you want to delete this Group?")) {
        try {
            const status = await axios.delete(`/user/group?chatType=${chatType}&&convId=${convId}`);
            chatType = null;
            convId = null
            messages.innerHTML = "";

        } catch (error) {
            console.log(error);
        }

    }
}
async function addMember(e) {
    try {
        // async get group mem
        const memebers = await axios.get(`/user/group/member?chatType=${chatType}&&convId=${convId}`);
        console.log(memebers.data.members);
        //if get response
        if (memebers.data.members) {
            messages.innerHTML = '<h4>Group members</h4><h6>click on member to remove from group</h6><div id="groupsMembers" class="mt-5"></div><hr><h4>All friends</h4><h6>click on friend to add to group</h6><div id="allFriends"></div>';
            const groupsMembers = document.getElementById("groupsMembers");
            const allFriends = document.getElementById("allFriends");

            const friends = document.querySelectorAll(".friends");
            for (const friend of friends) {
                let flag = true;
                for (const member of memebers.data.members) {
                    if (member.id == friend.id) flag = false;
                }
                if (flag) {
                    const btn = document.createElement("button");
                    btn.classList = "btn btn-light m-2";
                    btn.innerText = friend.innerText;
                    btn.id = friend.id;
                    btn.addEventListener("click", (e) => {
                        e.target.classList.toggle("btn-light");
                        e.target.classList.toggle("btn-success");
                        e.target.classList.toggle("addMemGroup");
                    })
                    allFriends.appendChild(btn);
                }
            }
            for (const member of memebers.data.members) {
                const btn = document.createElement("button");
                btn.classList = "btn btn-secondary m-2";
                btn.innerText = member.name;
                btn.id = member.id;
                console.log(memebers.data.adminId, member.id);
                if (!member.isAdmin) {
                    btn.addEventListener("click", (e) => {
                        e.target.classList.toggle("btn-danger");
                        e.target.classList.toggle("removeMemGroup");
                    })
                } else btn.classList = "btn btn-warning m-2";
                groupsMembers.appendChild(btn);
            }

        }
        e.target.innerText = "Confirm";
        e.target.removeEventListener("click", addMember);
        e.target.addEventListener("click", editGroup)
    } catch (error) {

    }
}
async function addAdmin(e) {
    try {
        const memebers = await axios.get(`/user/group/member?chatType=${chatType}&&convId=${convId}`);
        messages.innerHTML = '<h4>Group members</h4><h6>click on member to add as admin of group</h6><div id="groupsMembers" class="mt-5"></div><hr>';
        const groupsMembers = document.getElementById("groupsMembers");
        for (const member of memebers.data.members) {
            const btn = document.createElement("button");
            btn.classList = "btn btn-secondary m-2";
            btn.innerText = member.name;
            btn.id = member.id;
            if (!member.isAdmin) {
                btn.addEventListener("click", (e) => {
                    e.target.classList.toggle("btn-warning");
                    e.target.classList.toggle("addAdminGroup");
                })
            } else btn.classList = "btn btn-warning m-2";
            groupsMembers.appendChild(btn);
        }
        e.target.innerText = "Confirm";
        e.target.removeEventListener("click", addAdmin);
        e.target.addEventListener("click", addAdminGroup);
    } catch (error) {
        console.log(error);
    }

}

async function addAdminGroup(e) {
    try {
        let adminList = [...document.querySelectorAll(".addAdminGroup")];
        // let removeList = [...document.querySelectorAll(".removeMemGroup")];
        adminList = adminList.map(e => e.id);
        console.log(adminList);
        await axios.post("/user/group/addAdmin", { adminList, convId, chatType });
        messages.innerHTML = "";
        e.target.removeEventListener("click", addAdminGroup);
        e.target.addEventListener("click", addAdmin);
        e.target.innerText = "Add Admin";
        displayMsg();
    } catch (error) {
        console.log(error);
    }
}


async function editGroup(e) {
    try {
        let addList = [...document.querySelectorAll(".addMemGroup")];
        let removeList = [...document.querySelectorAll(".removeMemGroup")];
        addList = addList.map(e => e.id);
        removeList = removeList.map(e => e.id);
        console.log(addList, removeList);
        await axios.post("/user/group/member", { addList, removeList, convId, chatType });
        messages.innerHTML = "";
        e.target.removeEventListener("click", editGroup);
        e.target.addEventListener("click", addMember);
        e.target.innerText = "Edit Group";
        displayMsg();
    } catch (error) {
        console.log(error);
    }
}

chatForm.onsubmit = async (e) => {
    e.preventDefault();
    try {
        const fileInput = document.querySelector("#formFileMultiple");
        const formData = new FormData();
        for (let i = 0; i < fileInput.files.length; i++)
            formData.append('files', fileInput.files[i]);
        // console.log(Array.from(formData.entries()));
        const msg = e.target.msg.value;


        formData.append("text", msg);
        formData.append("convId", convId);
        formData.append("chatType", chatType);

        e.target.msg.value = '';
        if (chatType === "ooo")
            await axios.post("/message", formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
        else if (chatType === "group")
            await axios.post("/message/group", formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });

        loadData();
    } catch (error) {
        console.log(error.response.data.msg);
        // giveFeed(error.response.data.msg);
    }
}

addFriendForm.onsubmit = async (e) => {
    try {
        e.preventDefault();
        const number = e.target.number.value;
        e.target.number.value = "";
        if (number) {
            const response = await axios.post("/user/friend", { number });
            console.log(response);
        }

        loadFriendList();
    } catch (error) {
        console.log(error);
    }
}

addGroupForm.onsubmit = async (e) => {
    try {
        e.preventDefault();
        const name = e.target.group.value;
        e.target.group.value = "";
        const description = e.target.des.value;
        e.target.des.value = "";
        // console.log(name,description);
        if (name) {
            const response = await axios.post("/user/group", { name, description });
            console.log(response);
            loadGroupList();
        }


    } catch (error) {
        console.log(error);
    }
}

