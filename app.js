const input = document.querySelector("input");
const form = document.querySelector("form");
const todayList = document.querySelector(".ul__today");
const tomorrowList = document.querySelector(".ul__tomorrow");
const select = document.querySelector("select");
const uls = document.querySelectorAll("ul");
const trashCan = document.querySelector(".trash-can");

addItem();

// const collection = {
//     textValue : textValue,
//     textInv : textInv,
//     textStr : textStr,
//     textDe : textDe,
//     textareaInv : textareaInv,
//     checkCo : checkCo,
//     editDe : editDe,
//     day : day
// }
function addItem(){
    const lis = JSON.parse(localStorage.getItem("lis"));    
    if(lis){
        lis.forEach((listItem)=>{
            const li = document.createElement("li");
            li.innerHTML = `
                <textarea class="textarea invisible ${listItem.textareaInv ? "invisible" : ""}" rows="1" >${listItem.textValue}</textarea>
                <span class="text
                ${listItem.textInv ? "invisible" : ""}
                ${listItem.textStr ? "strike" : ""}
                ${listItem.textDe ? "delete" : ""}
                ">${listItem.textValue}</span>
                <span class="icon-box">
                <i class="far fa-check-circle ${listItem.checkCo ? "complete" : ""}" onclick="check.call(this)" ></i>
                <i class="far fa-edit ${listItem.editDe ? "delete" : ""}" onclick="edit.call(this)"></i>
                </span>
            `;
    
            li.setAttribute("id", listItem.textValue);
            li.setAttribute("draggable", true);
            li.addEventListener("dragstart", dragStart);
            li.addEventListener("dragend", dragEnd);
            if(listItem.day){
                todayList.append(li);
            }else{
                tomorrowList.append(li);
            }
        })    
    }
    
}

form.addEventListener("submit", onSubmit);

trashCan.addEventListener("dragover", dragOver);
trashCan.addEventListener("drop", dropTr);

uls.forEach((ul) => {
    ul.addEventListener("dragenter", dragEnter);
    ul.addEventListener("dragleave", dragLeave);
    ul.addEventListener("dragover", dragOver);
    ul.addEventListener("drop", drop);
})

function dragStart(e) {
    const todayTexts = Array.from(uls[0].querySelectorAll(".text"));
    const tomorrowTexts = Array.from(uls[1].querySelectorAll(".text"));
    const statusToday = todayTexts.some((text) => text.classList.contains("invisible"));
    const statusTomorrow = tomorrowTexts.some((text) => text.classList.contains("invisible"));
    //拖曳時儲存目標的ID;
    //如果有任何一個item正在編輯中則無法拖曳
    if (!(statusToday || statusTomorrow)) {
        e.dataTransfer.setData("text / plain", e.target.id);
        setTimeout(() => {
            e.target.classList.add("dragstart");
        }, 0);
    } else {
        alert("Please finish your edit before dragging!")
    }
}

function dragEnd(e) {
    e.target.classList.remove("dragstart");
}

function dragEnter() {
    const todayTexts = Array.from(uls[0].querySelectorAll(".text"));
    const tomorrowTexts = Array.from(uls[1].querySelectorAll(".text"));
    const statusToday = todayTexts.some((text) => text.classList.contains("invisible"));
    const statusTomorrow = tomorrowTexts.some((text) => text.classList.contains("invisible"));
    if (!(statusToday || statusTomorrow)) {
        this.classList.add("dragenter");
    }
}

function dragLeave() {
    this.classList.remove("dragenter");
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    // 放下時用先前儲存的ID來新增節點
    const sourceId = e.dataTransfer.getData("text / plain");
    this.appendChild(document.getElementById(sourceId));
    this.classList.remove("dragenter");
    updateLS();
}

//按下打勾icon之後的效果,delete是變灰色,strike是加入畫線效果
function check() {
    const text = this.parentElement.previousElementSibling;
    const edit = this.nextElementSibling;
    const textarea = text.previousElementSibling;
    if (textarea.classList.contains("invisible")) {
        this.classList.toggle("complete");
        edit.classList.toggle("delete");
        text.classList.toggle("strike");
        text.classList.toggle("delete");
    }
}

function edit() {
    function oninput(e, text) {
        text.innerHTML = e.target.value;
    }
    const text = this.parentElement.previousElementSibling;
    const textarea = text.previousElementSibling;

    textarea.addEventListener("input", (e) => oninput(e, text));
    if (!this.classList.contains("delete")) {
        textarea.classList.toggle("invisible");
        text.classList.toggle("invisible");
    }
}

function onSubmit(e) {
    e.preventDefault();
    let value = input.value;
    const checkValue = value.split("").every((string) => string == " ");
    //檢查是否輸入空白
    if (value && !checkValue) {

        //新增list item以及icon
        const li = document.createElement("li");
        li.innerHTML = `
            <textarea class="textarea invisible" rows="1">${value}</textarea>
            <span class="text">${value}</span>
            <span class="icon-box">
            <i class="far fa-check-circle" onclick="check.call(this)" ></i><i class="far fa-edit" onclick="edit.call(this)"></i>
            </span>
        `;

        li.setAttribute("id", value);
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragend", dragEnd);

        //依照選項新增至不同欄位
        if (select.value === "today") {
            todayList.append(li);
        } else if (select.value === "tomorrow") {
            tomorrowList.append(li);
        }

        input.value = "";
        updateLS()
    } else {
        alert("Don't leave it blank!")
    }
    
    updateLS()
}

//拖曳到垃圾桶就刪除節點
function dropTr(e) {
    const sourceId = e.dataTransfer.getData("text / plain");
    document.getElementById(sourceId).remove();
    updateLS();
}

function updateLS(){
    const lis = Array.from(document.querySelectorAll("li"));
    const arr = [];

    // console.log(liS[1].querySelector(".text").classList.contains("invisible"));

    lis.forEach(li =>{
        const textValue = li.querySelector(".text").innerHTML;
        const textInv = li.querySelector(".text").classList.contains("invisible");
        const textStr = li.querySelector(".text").classList.contains("strike");
        const textDe = li.querySelector(".text").classList.contains("delete");
        const textareaInv = li.querySelector(".textarea").classList.contains("invisible");
        const checkCo = li.querySelector(".fa-check-circle").classList.contains("complete");
        const editDe = li.querySelector(".fa-edit").classList.contains("delete");
        const day = li.parentElement.classList.contains("ul__today");
        const collection = {
            textValue : textValue,
            textInv : textInv,
            textStr : textStr,
            textDe : textDe,
            textareaInv : textareaInv,
            checkCo : checkCo,
            editDe : editDe,
            day : day
        }
        arr.push(collection);
    })

    localStorage.setItem("lis", JSON.stringify(arr));
}

