const input = document.querySelector("input");
const form = document.querySelector("form");
const todayList = document.querySelector(".ul__today");
const tomorrowList = document.querySelector(".ul__tomorrow");
const select = document.querySelector("select");
const uls = document.querySelectorAll("ul");

function dragStart(e) {
    //拖曳時儲存目標的ID;
    e.dataTransfer.setData("text / plain", e.target.id);
}

function dragEnd() {

}

uls.forEach((ul) => {
    ul.addEventListener("dragenter", dragEnter);
    ul.addEventListener("dragleave", dragLeave);
    ul.addEventListener("dragover", dragOver);
    ul.addEventListener("drop", drop);
})

function dragEnter() {

}

function dragLeave() {

}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    //放下時用先前儲存的ID來新增節點
    const sourceId = e.dataTransfer.getData("text / plain");
    this.appendChild(document.getElementById(sourceId))
}


function check() {
    this.classList.toggle("complete");
    const text = this.parentNode.previousSibling.previousSibling;
    const edit = this.nextSibling;
    edit.classList.toggle("delete");
    text.classList.toggle("strike");
    text.classList.toggle("delete");
}


function onSubmit(e) {
    e.preventDefault();
    let value = input.value;

    //新增list item以及icon
    const li = document.createElement("li");
    li.innerHTML = `
            <span class="list-item">${value}</span>
            <span class="icon-box">
            <i class="far fa-check-circle" onclick="check.call(this)" ></i><i class="far fa-edit"></i>
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
}

form.addEventListener("submit", onSubmit);


