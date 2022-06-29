//Step2 요구사항 
//상태 관리로 메뉴 관리하기

//TODO localStorage Read & Write
//- [x] localStorage에 데이터를 저장한다.
// - [x] 메뉴를 추가할 때
// - [x] 메뉴를 수정할 때
// - [x] 메뉴를 삭제할 때
//- [] localStorage에 있는 데이터를 읽어온다.

//TODO 카테고리별 메뉴판 관리
//- [] 에스프레소 메뉴판 관리
//- [] 프라푸치노 메뉴판 관리
//- [] 블렌디드 메뉴판 관리 
//- [] 티바나 메뉴판 관리
//- [] 디저트 메뉴판 관리

//TODO 페이지 접근시 최초 데이터 Read & Rendering
//- [] 페이지에 최초로 접근할 때, localStorage에서 에스프레소 메뉴를 읽어온다.
//- [] 에스프레소 메뉴가 먼저 페이지에 그려준다.

//TODO 품절 상태 관리
//- [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
//- [] 품절 버튼을 추가한다.
//- [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
//- [] 클릭 이벤트에서 가장 가까운 li태그의 class 속성 값에 sold-out을 추가한다.
const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
      localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  // 상태 : 변하는 데이터, 이 앱에서 변하는 것이 무엇인가 - 메뉴명
  this.menu = [];
  this.init = () => {
    if (store.getLocalStorage().length > 1){
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu
    .map((item, index) => {
      return `
      <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${item.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        > 
        수정
        </button>
        <button
         type="button"
         class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
        삭제
        </button>
      </li>`;
    })
    .join("");

    $("#espresso-menu-list").innerHTML = template;
    countUpdateMenu();
  };

  const countUpdateMenu = () => {
  const menuCount = $("#espresso-menu-list").querySelectorAll("li").length
  $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    this.menu.push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#espresso-menu-name").value = "";
  };

  // TODO 메뉴 수정 & 삭제
    const updatedMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId
    const $menuName = e.target.closest("li").querySelector(".menu-name")
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  }

  const removeMenuName = (e) => {
    if(confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu.splice(menuId, 1);
      e.target.closest("li").remove();
      store.setLocalStorage(this.menu);
      countUpdateMenu();
    }
  }

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updatedMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  // form 태그가 자동으로 전송되는 걸 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });



  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);
 
  // 메뉴의 이름을 입력받는건
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !=="Enter") {
      return;
    }
    addMenuName();
  });
}
const app = new App();
app.init();


