const input = document.querySelector("input");
const form = document.querySelector("form");
const todayList = document.querySelector(".ul__today");
const tomorrowList = document.querySelector(".ul__tomorrow");
const select = document.querySelector("select");
const uls = document.querySelectorAll("ul");

function dragStart(e) {

    const todayTexts = Array.from(uls[0].querySelectorAll(".text"));
    const tomorrowTexts = Array.from(uls[1].querySelectorAll(".text"));
    const statusToday = todayTexts.some((text) => text.classList.contains("invisible"));
    const statusTomorrow = tomorrowTexts.some((text) => text.classList.contains("invisible"));
    if (!(statusToday || statusTomorrow)) {
        e.dataTransfer.setData("text / plain", e.target.id);
        setTimeout(() => {
            e.target.classList.add("dragstart");
        }, 0);
    } else {
        alert("Please finish your edit before dragging!")
    }

    // const status = ArrUls.every((ul)=>{
    //     const ArrTexts = Array.from(ul.querySelectorAll(".text"));
    //     return ul.querySelectorAll(".text").classList.contains("invisible");
    // })
    // console.log(status);
    //拖曳時儲存目標的ID;

}

function dragEnd(e) {
    e.target.classList.remove("dragstart");
}

uls.forEach((ul) => {
    ul.addEventListener("dragenter", dragEnter);
    ul.addEventListener("dragleave", dragLeave);
    ul.addEventListener("dragover", dragOver);
    ul.addEventListener("drop", drop);
})

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
    const todayTexts = Array.from(uls[0].querySelectorAll(".text"));
    const tomorrowTexts = Array.from(uls[1].querySelectorAll(".text"));
    const statusToday = todayTexts.some((text) => text.classList.contains("invisible"));
    const statusTomorrow = tomorrowTexts.some((text) => text.classList.contains("invisible"));
    //放下時用先前儲存的ID來新增節點
    if (!(statusToday || statusTomorrow)) {
        const sourceId = e.dataTransfer.getData("text / plain");
        this.appendChild(document.getElementById(sourceId));
        this.classList.remove("dragenter");
    }
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
    }else{
        alert("Don't leave it blank!")
    }

}

form.addEventListener("submit", onSubmit);