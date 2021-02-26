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

console.dir(select);

function onSubmit(e) {
    e.preventDefault();
    let value = input.value;

    const li = document.createElement("li");
    li.innerHTML = `${value}`;
    li.setAttribute("id", value);
    li.setAttribute("draggable", true);
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragend", dragEnd);

    if (select.value === "today") {
        todayList.append(li);
    } else if (select.value === "tomorrow") {
        tomorrowList.append(li);
    }

    input.value = "";
}

form.addEventListener("submit", onSubmit);
