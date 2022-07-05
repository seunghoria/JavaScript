//step3 요구사항 - 서버와의 통신을 통해 메뉴 관리하기

//TODO 서버 요청 부분
//- [x] 웹서버를 띄운다.
//- [x] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
//- [] 서버에 카테고리별 메뉴리스트를 불러온다.
//- [] 서버에 메뉴가 수정될 수 있도록 요청한다.
//- [] 서버에 메뉴의 품절상태를 토글될 수 있도록 요청한다.
//- [] 서버에 메뉴가 삭제될 수 있도록 요청한다.

//TODO 리팩터링 부분
//- [x] localStorage에 저장하는 로직은 지운다.
//- [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

//TODO 사용자 경험
//- [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
//- [] 중복되는 메뉴는 추가할 수 없다.
import { $ } from "./utils/dom.js";
import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api"

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`)
    return response.json();
  },
};


function App() {
  // 상태 : 변하는 데이터, 이 앱에서 변하는 것이 무엇인가 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    console.log(this.menu[this.currentCategory]);
    render();
    initEventListners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
    .map((menuItem, index) => {
      return `
      <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${
          menuItem.soldOut ? "sold-out": ""
        }">${menuItem.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
        품절
        </button>
        
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

    $("#menu-list").innerHTML = template;
    countUpdateMenu();
  };

  const countUpdateMenu = () => {
  const menuCount = this.menu[this.currentCategory].length
  $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const menuName = $("#menu-name").value;

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    })
    .then((response) => {
      return response.json();
    });

    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    $("#menu-name").value = "";
  };


  // TODO메뉴 수정 & 삭제 & 품절 관리
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId
    const $menuName = e.target.closest("li").querySelector(".menu-name")
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if(confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = 
     !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });
  
    // form 태그가 자동으로 전송되는 걸 막아준다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });
  
    $("#menu-submit-button").addEventListener("click", addMenuName);
   
    // 메뉴의 이름을 입력받는건
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !=="Enter") {
        return;
      }
      addMenuName();
    });
  
    $("nav").addEventListener("click", (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name")
      if (isCategoryButton) {
          const categoryName = e.target.dataset.categoryName;
          this.currentCategory = categoryName;
          $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
          render();
      }
    });
  };
}
const app = new App();
app.init();
