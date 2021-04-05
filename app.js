const input = document.querySelector("input");
const form = document.querySelector("form");
const todayList = document.querySelector(".ul__today");
const tomorrowList = document.querySelector(".ul__tomorrow");
const select = document.querySelector("select");
const uls = document.querySelectorAll("ul");
const trashCan = document.querySelector(".trash-can");

class List {
    dragStart(e) {
        const todayTexts = Array.from(uls[0].querySelectorAll(".text"));
        const tomorrowTexts = Array.from(uls[1].querySelectorAll(".text"));
        //確認是否正在編輯中, 若編輯中則text的class會包含invisible
        const statusToday = todayTexts.some((text) => text.classList.contains("invisible"));
        const statusTomorrow = tomorrowTexts.some((text) => text.classList.contains("invisible"));
        //如果有任何一個item正在編輯中則無法拖曳,拖曳時儲存目標的ID;
        if (!(statusToday || statusTomorrow)) {
            e.dataTransfer.setData("text / plain", e.target.id);
            setTimeout(() => {
                e.target.classList.add("dragstart");
            }, 0);
        } else {
            alert("Please finish your edit before dragging!")
        }
    }

    dragEnd(e) {
        e.target.classList.remove("dragstart");
    }

    //如果不是在編輯中的狀態,在拖曳進入時出現特定的樣式
    dragEnter() {
        const todayTexts = Array.from(uls[0].querySelectorAll(".text"));
        const tomorrowTexts = Array.from(uls[1].querySelectorAll(".text"));
        const statusToday = todayTexts.some((text) => text.classList.contains("invisible"));
        const statusTomorrow = tomorrowTexts.some((text) => text.classList.contains("invisible"));
        if (!(statusToday || statusTomorrow)) {
            this.classList.add("dragenter");
        }
    }

    dragLeave() {
        this.classList.remove("dragenter");
    }

    //取消預設行為才能利用setData和getData傳送資料
    dragOver(e) {
        e.preventDefault();
    }

    drop(e) {
        // 放下時用先前儲存的ID來新增節點
        const sourceId = e.dataTransfer.getData("text / plain");
        this.appendChild(document.getElementById(sourceId));
        this.classList.remove("dragenter");
        Ls.updateLS();
    }
}

class ListItem {
    //按下打勾icon之後的效果,delete是變灰色,strike是加入畫線效果
    check() {
        const text = this.parentElement.previousElementSibling;
        const edit = this.nextElementSibling;
        const textarea = text.previousElementSibling;
        //如果不是在編輯模式下的話才可以打勾
        if (textarea.classList.contains("invisible")) {
            this.classList.toggle("complete");
            edit.classList.toggle("delete");
            text.classList.toggle("strike");
            text.classList.toggle("delete");
            Ls.updateLS();
        }
    }

    edit() {
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
}

const listEvent = new List();
const ListItemEvent = new ListItem();

class LS {
    addItem() {
        const lis = JSON.parse(localStorage.getItem("lis"));
        if (lis) {
            lis.forEach((listItem) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <textarea class="textarea invisible" rows="1" >${listItem.textValue}</textarea>
                    <span class="text
                    ${listItem.textStr ? "strike" : ""}
                    ${listItem.textDe ? "delete" : ""}
                    ">${listItem.textValue}</span>
                    <span class="icon-box">
                    <i class="far fa-check-circle ${listItem.checkCo ? "complete" : ""}" onclick="ListItemEvent.check.call(this)" ></i>
                    <i class="far fa-edit ${listItem.editDe ? "delete" : ""}" onclick="ListItemEvent.edit.call(this)"></i>
                    </span>
                `;

                li.setAttribute("id", listItem.textValue);
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", listEvent.dragStart);
                li.addEventListener("dragend", listEvent.dragEnd);
                if (listItem.day) {
                    todayList.append(li);
                } else {
                    tomorrowList.append(li);
                }
            })
        }
    }
    updateLS() {
        const lis = Array.from(document.querySelectorAll("li"));
        const arr = [];

        lis.forEach(li => {
            const textValue = li.querySelector(".text").innerHTML;
            const textStr = li.querySelector(".text").classList.contains("strike");
            const textDe = li.querySelector(".text").classList.contains("delete");
            const checkCo = li.querySelector(".fa-check-circle").classList.contains("complete");
            const editDe = li.querySelector(".fa-edit").classList.contains("delete");
            const day = li.parentElement.classList.contains("ul__today");
            const collection = {
                textValue: textValue,
                textStr: textStr,
                textDe: textDe,
                checkCo: checkCo,
                editDe: editDe,
                day: day
            }
            arr.push(collection);
        })
        localStorage.setItem("lis", JSON.stringify(arr));
    }
}
//開啟頁面時如果localstorage有東西就顯示於網頁上
const Ls = new LS();
Ls.addItem();

class Form {
    //依照選擇today或tomorror新增到不同List, 並儲存localstorage
    onSubmit(e) {
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
                <i class="far fa-check-circle" onclick="ListItemEvent.check.call(this)" ></i><i class="far fa-edit" onclick="ListItemEvent.edit.call(this)"></i>
                </span>
            `;

            li.setAttribute("id", value);
            li.setAttribute("draggable", true);
            li.addEventListener("dragstart", listEvent.dragStart);
            li.addEventListener("dragend", listEvent.dragEnd);

            //依照選項新增至不同欄位
            if (select.value === "today") {
                todayList.append(li);
            } else if (select.value === "tomorrow") {
                tomorrowList.append(li);
            }

            input.value = "";
            Ls.updateLS()
        } else {
            alert("Don't leave it blank!")
        }

        Ls.updateLS()
    }
}

const formEvent = new Form();
form.addEventListener("submit", formEvent.onSubmit);

uls.forEach((ul) => {
    ul.addEventListener("dragenter", listEvent.dragEnter);
    ul.addEventListener("dragleave", listEvent.dragLeave);
    ul.addEventListener("dragover", listEvent.dragOver);
    ul.addEventListener("drop", listEvent.drop);
})

//拖曳到垃圾桶就刪除節點
function dropTr(e) {
    const sourceId = e.dataTransfer.getData("text / plain");
    document.getElementById(sourceId).remove();
    Ls.updateLS();
}

trashCan.addEventListener("dragover", listEvent.dragOver);
trashCan.addEventListener("drop", dropTr);