


// gnb, 참조 열고닫기
function layoutEvt() {

  const minRight = 440; // 👉 rightDiv 최소 너비 (변경 가능)
  let splitterInitialized = false;

  // 닫기 버튼
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-collapse');
    if (!btn) return;

    const wrapper = btn.closest('.sidebar, .reference-document-wrap');
    if (!wrapper) return;

    wrapper.classList.add('closed');

    // 👉 reference 닫힐 때
    if (wrapper.classList.contains('reference-document-wrap')) {
      $('.container').removeClass('ref-open');
      $('#leftDiv').removeAttr('style');
      $('#rightDiv').removeAttr('style');

      splitterInitialized = false;
    }

    if (wrapper.classList.contains('sidebar')) {
      document.querySelectorAll('.btn-aside-open, .btn-header-open').forEach(function(el) {
        el.style.display = 'inline-block';
      });
    } else {
      const openBtn = document.querySelector('.btn-ref-open');
      if (openBtn) openBtn.style.display = 'inline-flex';
    }
  });

  // 열기 버튼
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-aside-open, .btn-header-open, .btn-ref-open');
    if (!btn) return;

    let wrapper = null;

    if (btn.classList.contains('btn-aside-open') || btn.classList.contains('btn-header-open')) {
      wrapper = document.querySelector('.sidebar');
    } else {
      wrapper = document.querySelector('.reference-document-wrap');
    }

    if (wrapper) {
      wrapper.classList.remove('closed');

      if (wrapper.classList.contains('reference-document-wrap')) {
        const $container = $('.container');
        const containerWidth = $container.width();
        const leftWidth = containerWidth - minRight;

        $('.container').addClass('ref-open');
        $('#leftDiv').width(leftWidth);

        initSplitter();
      }
    }

    document.querySelectorAll('.btn-aside-open, .btn-header-open').forEach(function(el) {
      el.style.display = 'none';
    });
  });

  // splitter 초기화
function initSplitter() {
  if (splitterInitialized) return;

  $('#splitDiv').jSplitter({
    leftdiv: 'leftDiv',
    rightdiv: 'rightDiv',
    flex: true,
    minright: minRight,
  });

  // 👉 드래그 중 body에 클래스 추가
  $('#splitDiv')
    .on('mousedown', function () {
      document.body.classList.add('jSplitter-ing');
    });

  document.addEventListener('mouseup', function () {
    document.body.classList.remove('jSplitter-ing');
  });

  splitterInitialized = true;
}


  // header 반응형 처리
  function resizeHeaderCheck() {
    const header = document.querySelector('.sidebar');
    if (!header) return;

    if (window.innerWidth <= 1200) {
      header.classList.add('closed');
      $('#leftDiv').removeAttr('style');
      document.querySelectorAll('.btn-aside-open, .btn-header-open').forEach(function(el) {
        el.style.display = 'inline-block';
      });
    } else {
      header.classList.remove('closed');
      document.querySelectorAll('.btn-aside-open, .btn-header-open').forEach(function(el) {
        el.style.display = 'none';
      });
    }
  }

  resizeHeaderCheck();
  window.addEventListener('resize', resizeHeaderCheck);
}



function starGrade(){
  document.querySelectorAll('.star-grade button').forEach(btn => {
    btn.addEventListener('click', function () {
      const val = Number(this.dataset.val);
      const buttons = document.querySelectorAll('.star-grade button');

      buttons.forEach(b => {
        b.classList.remove('on', 'low');
      });

      buttons.forEach(b => {
        if (Number(b.dataset.val) <= val) {
          b.classList.add('on');
        }
      });

      if (val <= 2) {
        buttons.forEach((b, idx) => {
          if (idx < val) b.classList.add('low'); 
        });
      }
    });
  });
}

function tooltipOver() {
  let btn = null, txt = '', layer = null;
  let lastLeaveTime = 0;
  let tooltipTimeout = null;

  if (!document.querySelector('.tooltip-wrap')) {
    layer = document.createElement('div');
    layer.className = 'tooltip-wrap';
    layer.style.position = 'fixed';
    layer.style.display = 'none';
    layer.innerHTML = '<div class="tooltip-txt"></div>';
    document.body.appendChild(layer);
  } else {
    layer = document.querySelector('.tooltip-wrap');
    layer.style.position = 'fixed';
  }

  document.addEventListener('mouseover', function(e) {
    const target = e.target.closest('[data-evt~="tooltip"]');
    if (!target) return;

    txt = target.dataset.tooltipTxt || '';
    layer.querySelector('.tooltip-txt').textContent = txt;
    btn = target;

    const btnRect = btn.getBoundingClientRect();

    // 툴팁 먼저 보여주고 width 계산
    layer.style.display = 'block';
    const layerRect = layer.getBoundingClientRect();

    let top = btnRect.bottom + 8;
    let left = btnRect.left + (btnRect.width / 2) - (layerRect.width / 2);

    layer.classList.remove('up');

    // 화면 우측 경계 체크
    if (left + layerRect.width > window.innerWidth) {
      left = window.innerWidth - layerRect.width - 20;
    }
    if (left < 0) left = 10;

    // 화면 아래쪽 경계 체크
    if (top + layerRect.height > window.innerHeight) {
      top = btnRect.top - layerRect.height - 8;
      layer.classList.add('up');
    }

    const currentTime = Date.now();
    const timeSinceLastLeave = currentTime - lastLeaveTime;

    clearTimeout(tooltipTimeout);
    if (timeSinceLastLeave > 800) {
      tooltipTimeout = setTimeout(() => {
        layer.style.top = top + 'px';
        layer.style.left = left + 'px';
        layer.style.display = 'block';
      }, 0);
    } else {
      layer.style.top = top + 'px';
      layer.style.left = left + 'px';
      layer.style.display = 'block';
    }
  });

  document.addEventListener('mouseout', function(e) {
    const target = e.target.closest('[data-evt~="tooltip"]');
    if (!target) return;

    lastLeaveTime = Date.now();
    clearTimeout(tooltipTimeout);
    layer.style.display = 'none';
  });
}


function completeCheck(obj){
  let html = `<i class="ico-ani-check"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2"> 
      <polyline class="check" fill="none" stroke="#6D6D6D" stroke-width="8" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/> 
    </svg></i>`
  if(!document.querySelector('.ico-ani-check')) $(obj).append(html)
  $(obj).find('i:first-child').hide();

  setTimeout(function(){
    $(obj).find('i:first-child').show();
    $(obj).find('.ico-ani-check').remove();
  }, 2000);
}

function printAnswer(obj){
  const target = obj.closest('.ai-answer-comp');
  if(!target) return;
  const clone = target.cloneNode(true);
  clone.classList.add('print-clone');
  clone.removeAttribute('style');
  document.body.appendChild(clone);
  document.body.classList.add('print-mode');
  const cleanup = function(){
    clone.remove();
    document.body.classList.remove('print-mode');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}

function allCheck() {
  const allCheckBoxes = document.querySelectorAll('input[data-evt="all-check"]');

  allCheckBoxes.forEach(allCheckBox => {
    const groupName = allCheckBox.name;
    const groupItems = Array.from(document.querySelectorAll(`input[name="${groupName}"]`));
    const itemBoxes = groupItems.filter(item => item.dataset.evt !== "all-check");

    allCheckBox.addEventListener("change", function () {
      const checked = this.checked;

      itemBoxes.forEach(box => {
        box.checked = checked;
      });
    });


    itemBoxes.forEach(box => {
      box.addEventListener("change", function () {
        const allChecked = itemBoxes.every(b => b.checked);
        allCheckBox.checked = allChecked;
      });
    });
  });
}

// 커스텀 셀렉트 생성 함수
function selectUi(id, data) {
    const container = document.getElementById(id);
    container.innerHTML = `
      <div class="select-head" aria-haspopup="listbox" aria-expanded="false">
        <button type="button" class="placeholder">${data.placeholder}</button>
        <button type="button" class="selected" style="display:none;"></button>
      </div>
    `;

    const head = container.querySelector(".select-head");
    const placeholderEl = head.querySelector(".placeholder");
    const selectedBtn = head.querySelector(".selected");

    let dropdownEl = null;
    let selectedValue = data.selected;
    const changeHandlers = [];

    const triggerChange = v => changeHandlers.forEach(fn => fn(v));

    const updateVisibleButton = () => {
      if (selectedValue) {
        placeholderEl.style.display = "none";
        selectedBtn.style.display = "";
      } else {
        placeholderEl.style.display = "";
        selectedBtn.style.display = "none";
      }
    };

    updateVisibleButton();

    const focusVisibleButton = (root = head) => {
      const btn = [...root.querySelectorAll('button')].find(b =>
        b.style.display !== "none" &&
        b.style.visibility !== "hidden"
      );
      if (btn) btn.focus();
    };

    const createDropdown = () => {
      if (dropdownEl) return;

      dropdownEl = document.createElement("div");
      dropdownEl.className = "select-dropdown";

      // container의 클래스 중 select-ui 제외하고 dropdown에 복사
      container.classList.forEach(cls => {
        if (cls !== "select-ui") {
          dropdownEl.classList.add(cls);
        }
      });

      dropdownEl.setAttribute("role", "listbox");
      dropdownEl.innerHTML = `
        <ul>
          ${data.options.map(opt => `
            <li>
              <button type="button" role="option"
                ${opt.disabled ? "disabled" : ""}
                data-value="${opt.value}">
                ${opt.label}
              </button>
            </li>
          `).join("")}
        </ul>
      `;
      document.body.appendChild(dropdownEl);

      const rect = head.getBoundingClientRect();
      const dropdownHeight = dropdownEl.offsetHeight;
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      } else {
        top = rect.bottom + window.scrollY + 5;
      }

      Object.assign(dropdownEl.style, {
        top: `${top}px`,
        left: `${rect.left + window.scrollX}px`,
        minWidth: `${rect.width}px`
      });

      const options = dropdownEl.querySelectorAll("button:not([disabled])");
      options[0]?.focus();

      options.forEach((btn, idx) => {
        btn.addEventListener("click", () => {
          const value = btn.dataset.value;
          const label = btn.textContent;

          dropdownEl.querySelectorAll("li.selected").forEach(li => li.classList.remove("selected"));
          btn.closest("li").classList.add("selected");

          selectedValue = value;
          selectedBtn.textContent = label;

          updateVisibleButton();

          closeDropdown();
          focusVisibleButton();
          triggerChange(selectedValue);
        });

        btn.addEventListener("keydown", e => {
          const last = options.length - 1;
          const moveFocus = i => options[i]?.focus();

          switch (e.key) {
            case "ArrowDown": e.preventDefault(); moveFocus((idx + 1) % options.length); break;
            case "ArrowUp": e.preventDefault(); moveFocus((idx - 1 + options.length) % options.length); break;
            case "Escape": e.preventDefault(); closeDropdown(); break;
            case "Tab":
              if ((!e.shiftKey && idx === last) || (e.shiftKey && idx === 0)) {
                e.preventDefault();
                closeDropdown();
              }
              break;
          }
        });
      });

      if (selectedValue) {
        const selectedLi = dropdownEl.querySelector(`[data-value="${selectedValue}"]`)?.closest("li");
        if (selectedLi) selectedLi.classList.add("selected");
      }

      setTimeout(() => document.addEventListener("click", onClickOutside), 0);
    };

    const closeDropdown = () => {
      if (!dropdownEl) return;
      dropdownEl.remove();
      dropdownEl = null;
      document.removeEventListener("click", onClickOutside);

      setTimeout(() => {
        if (!container.contains(document.activeElement)) {
          focusVisibleButton(); 
        }
        container.classList.remove("focus");
      }, 10);
    };


    const onClickOutside = e => {
      if (!container.contains(e.target) && !dropdownEl?.contains(e.target)) {
        closeDropdown();
      }
    };

    head.addEventListener("click", () => dropdownEl ? closeDropdown() : createDropdown());
    head.addEventListener("keydown", e => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        dropdownEl ? closeDropdown() : createDropdown();
      }
    });

    document.querySelectorAll(`label[for="${id}"]`).forEach(label =>
      label.addEventListener("click", () => focusVisibleButton(container))
    );

    const root = container;
    const headButtons = head.querySelectorAll("button");

    headButtons.forEach(btn => {
      btn.addEventListener("focus", () => {
        root.classList.add("focus");
      });

      btn.addEventListener("blur", () => {
        setTimeout(() => {
          // head도 아니고 dropdown도 아니면 focus 제거
          if (
            !root.contains(document.activeElement) &&
            !(dropdownEl?.contains(document.activeElement))
          ) {
            root.classList.remove("focus");
          }
        }, 10);
      });
    });

    return {
      get value() { return selectedValue; },
      set value(v) {
        const opt = data.options.find(o => o.value === v);
        if (!opt) return;

        selectedValue = opt.value;
        selectedBtn.textContent = opt.label;

        updateVisibleButton();

        triggerChange(selectedValue);
      },
      addEventListener(type, fn) {
        if (type === "change") changeHandlers.push(fn);
      }
    };
}

function tooltipMenu() {
  const container = document;
  let lastFocusedButton = null;
  let openMenuElement = null;

  // 메뉴 닫기
  function closeMenu() {
    if (!openMenuElement) return;

    openMenuElement.classList.remove('active');
    openMenuElement.style.display = 'none';
    openMenuElement.querySelectorAll('button, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));

    if (lastFocusedButton) {
      const liParent = lastFocusedButton.closest('li');
      if (liParent) {
        liParent.classList.remove('on');
      }
    }

    openMenuElement = null;
    lastFocusedButton = null;
  }


  // 메뉴 열기
function openMenu(btn, menu) {
    if (!menu) return;

    const rect = btn.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const viewportHeight = window.innerHeight;

    // 메뉴 높이 계산을 위해 보이지 않게 표시
    menu.style.visibility = 'hidden';
    menu.style.display = 'block';
    menu.classList.add('active');

    const menuHeight = menu.offsetHeight;
    const menuWidth = menu.offsetWidth;

    let top;
    let left = rect.left + scrollLeft;

    // 아랫공간 계산
    const spaceBelow = viewportHeight - rect.bottom;
    if (spaceBelow >= menuHeight + 20) {
      top = rect.bottom + scrollTop; // 버튼 바로 아래
    }
    else {
      top = rect.top + scrollTop - menuHeight - 10; // 10px 여유
      if (top < 10) top = 10;
    }

    // 우측 경계 체크
    const viewportWidth = window.innerWidth;
    if (left + menuWidth > viewportWidth + scrollLeft) {
      left = rect.right + scrollLeft - menuWidth;
      if (left < scrollLeft + 10) left = scrollLeft + 10;
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
    menu.style.visibility = 'visible';

    openMenuElement = menu;
    lastFocusedButton = btn;

    const focusableItems = Array.from(menu.querySelectorAll('button, [tabindex]'));
    focusableItems.forEach(el => el.setAttribute('tabindex', '0'));
    if (focusableItems.length > 0) focusableItems[0].focus();


    const liParent = btn.closest('li');
    if (liParent) {
      liParent.classList.toggle('on');
    }
  }



  // 메뉴 토글
  function toggleMenu(btn) {
    const menuId = btn.dataset.id;
    if (!menuId) return;
    const menu = document.getElementById(menuId);
    if (!menu) return;

    if (openMenuElement === menu && lastFocusedButton === btn) {
      closeMenu();
    } else {
      closeMenu();
      openMenu(btn, menu);
    }
  }


  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-evt~="tooltip-menu"]');
    if (btn) {
      e.stopPropagation();
      toggleMenu(btn);
      return;
    }

    if (openMenuElement && e.target.closest('.dropdown-menu-layer button')) {
      closeMenu();
      if (lastFocusedButton) lastFocusedButton.focus();
      return;
    }

    closeMenu();
  });

  // ---------------------------
  // 키보드 이벤트
  // ---------------------------
  container.addEventListener('keydown', (e) => {
    if (!openMenuElement) return;

    const focusableItems = Array.from(openMenuElement.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'));
    const index = focusableItems.indexOf(document.activeElement);

    if (e.key === 'Escape') {
      if (lastFocusedButton) lastFocusedButton.focus();
      closeMenu();
    } else if (e.key === 'Tab') {
      if (!e.shiftKey && index === focusableItems.length - 1) {
        e.preventDefault();
        if (lastFocusedButton) lastFocusedButton.focus();
        closeMenu();
      } else if (e.shiftKey && index === 0) {
        e.preventDefault();
        if (lastFocusedButton) lastFocusedButton.focus();
        closeMenu();
      }
    }
  });
}

// 참조여역 타이틀 말풍선
function popoverMoreView() {
  let popover = document.querySelector('.popover-more-view');
  if (!popover) {
    popover = document.createElement('div');
    popover.className = 'popover-more-view';
    document.body.appendChild(popover);
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-evt="more-view"]');
    if (!target) return;

    popover.textContent = target.textContent;

    const rect = target.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 5}px`;
    popover.style.left = `${rect.left + window.scrollX}px`;
    popover.style.width = `${rect.width}px`;
    popover.style.display = 'block';
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-evt="more-view"]');
    if (!target) return;

    popover.style.display = 'none';
  });
}


// 팝업
let lastFocusedElement = null;

function popClose(popup){
  let $popup = $(popup);
  $popup.fadeOut();
  $('body, html').css('overflow', '');
  $('body').removeClass('pop-open');
  
  // 팝업을 닫을 때 원래 포커스 위치로 복귀
  if(lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function popOpen(popup, callback){
  let $popup = $(popup);
  scrollPosition = $(window).scrollTop();
  
  // 팝업을 연 버튼 저장
  lastFocusedElement = document.activeElement;

  $popup.removeAttr('style');
  $popup.fadeIn();
  $('body, html').css('overflow', 'hidden');
  $('body').addClass('pop-open');
  
  // 팝업이 열린 후 닫기 버튼으로 포커스 이동
  setTimeout(() => {
    $popup.find('.btn-close').focus();
  }, 100);
  
  $popup.find('.btn-close').on('click', function(){
    popClose(popup);
  });

  // 포커스 트랩 설정
  setupFocusTrap($popup);

  if(callback) callback();
}

function setupFocusTrap($popup) {
  // 팝업 내부의 포커스 가능한 모든 요소 찾기
  const focusableElements = $popup.find(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ).filter(':visible');
  
  if(focusableElements.length === 0) return;
  
  const firstElement = focusableElements.first()[0];
  const lastElement = focusableElements.last()[0];
  
  // 기존 이벤트 제거 (중복 방지)
  $popup.off('keydown.focustrap');
  
  // 탭 키 이벤트 처리
  $popup.on('keydown.focustrap', function(e) {
    // Tab 키가 아니면 무시
    if(e.key !== 'Tab') return;
    
    // Shift + Tab (역방향)
    if(e.shiftKey) {
      if(document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } 
    // Tab (정방향)
    else {
      if(document.activeElement === lastElement) {
        e.preventDefault();
        // 마지막 요소에서 Tab을 누르면 팝업 닫기
        popClose('#' + $popup.attr('id'));
      }
    }
  });
  
  // ESC 키로 팝업 닫기
  $popup.off('keydown.escape');
  $popup.on('keydown.escape', function(e) {
    if(e.key === 'Escape') {
      popClose('#' + $popup.attr('id'));
    }
  });
}

// 인풋 바이트
function initByteFields() {
  const fields = document.querySelectorAll('[data-evt="byte"]');

  fields.forEach(field => {
    const max = Number(field.dataset.byte) || 100;

    // 이미 byte 박스가 추가되지 않은 경우만 추가
    if (!field.previousElementSibling || !field.previousElementSibling.classList.contains("byte")) {
      const byteBox = document.createElement("div");
      byteBox.className = "byte-input";
      byteBox.innerHTML = `<em>0</em>/${max}`;
      field.insertAdjacentElement("afterend", byteBox);
    }

    const byteBox = field.nextElementSibling.querySelector("em");

    field.addEventListener("input", () => {
      const length = getByteLength(field.value);
      byteBox.textContent = length;

      // 초과 입력 방지
      if (length > max) {
        field.value = trimToMaxByte(field.value, max);
        byteBox.textContent = max;
      }
    });
  });
}

// 바이트 계산
function getByteLength(str) {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    byte += (str.charCodeAt(i) > 128) ? 2 : 1;
  }
  return byte;
}

// 최대 바이트
function trimToMaxByte(str, maxByte) {
  let byte = 0;
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const charByte = (str.charCodeAt(i) > 128) ? 2 : 1;
    if (byte + charByte > maxByte) break;
    byte += charByte;
    result += str[i];
  }
  return result;
}

// 얼럿
function customAlert(message, type, icon = "") {
  return new Promise((resolve) => {
    $(".alert-popup").remove();

    const $popup = $(`
      <section class="alert-popup" role="alertdialog" style="display: block;">
        <div class="dim"></div>
        <div class="popup" role="document" tabindex="-1" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-desc">
          <div class="pop-body">
            <div class="alert-txt ${icon}">
              <p id="alert-desc">${message}</p>
            </div>
          </div>
          <div class="pop-footer"> 
            <div class="btn-wrap">
              ${
                type === "confirm" 
                ? `<button type="button" class="btn-alert st-blue-line btn-no">취소</button>
                   <button type="button" class="btn-alert st-blue btn-yes">확인</button>`
                : `<button type="button" class="btn-alert st-blue btn-yes">확인</button>`
              }
            </div>
          </div>
        </div>
      </section>
    `); 

    $("body").append($popup);
    $popup.find(".popup").focus();

    $popup.on("click", ".btn-close, .btn-no", function () {
      $popup.remove();
      resolve(false);
    });

    $popup.on("click", ".btn-yes", function () {
      $popup.remove();
      resolve(true);
    });
  });
}


function tabEvt(){
  let tabs = [];
  $(document).on('click', '[data-tab-id]', function(e){
    e.stopPropagation();
    let tabid = $(this).data('tab-id');

    tabs = [];
    tabs.push(tabid);

    $(this).parents('li').addClass('on');
    $(this).parents('li').siblings().find('[data-tab-id]').each(function(){
      $(this).parents('li').removeClass('on');
      tabs.push($(this).data('tab-id'));
    });

    if (tabid === "total") {
      tabs.forEach(function(v){
        $('#' + v).show();
      });
    } else {
      tabs.forEach(function(v){
        $('#' + v).hide();
      });
      $('#' + tabid).show();
    }

    if($(this).parents('.tab-condition').length > 0){
      let $selectd = $(this).parents('.tab-condition').find('.selected');
      $selectd.find('button').text($(this).text())
    }
  })
}


// loading
function loading(){
  const loadingHtml = `<div class="loading-bar">
		<div class="three-bounce">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  </div>`

  const $loading = $(loadingHtml);  
  $('body').append($loading);  
  $('body, html').css('overflow', 'hidden');
}

// multi select
function createMultiSelect(containerSelector, title, items, allCheck) {
  const $container = $(containerSelector);
  if ($container.length === 0) return;

  const uid = containerSelector.replace("#", "");

  const extraClasses = ($container.attr("class") || "")
    .split(/\s+/)
    .filter(cls => cls && cls !== "select-multi")
    .join(" ");

  const html = `
      <div class="select-head">
        <input type="hidden" class="select-value">
        <button type="button" class="placeholder" arial-label="필터 선택">${title}</button>
        <button type="button" class="selected" style="display:none"></button>
      </div>
  `;
  $container.html(html);

  const htmlDropdown = `
      <div class="select-multi-dropdown ${extraClasses}" data-owner="${uid}" style="display:none; position:absolute;">
        <div class="input-choice">
          <input type="checkbox" id="${uid}_all" class="select-all-toggle">
          <i></i>
          <label for="${uid}_all">전체</label>
        </div>
        ${items.map(item => `
          <div class="input-choice">
            <input type="checkbox"
                   class="option"
                   id="${uid}_${item.value}"
                   value="${item.value}">
            <i></i>
            <label for="${uid}_${item.value}">${item.label}</label>
          </div>
        `).join("")}
      </div>
  `;
  $("body").append(htmlDropdown);

  const $multi = $container;
  const $dropdown = $(`.select-multi-dropdown[data-owner="${uid}"]`);
  const $hidden = $multi.find(".select-value");
  const $options = $dropdown.find(".option");
  const $selectedText = $multi.find(".selected");
  const $toggle = $dropdown.find(".select-all-toggle");

  /* 선택 업데이트 */
function updateSelectedText() {
  const allChecked = ($options.length === $options.filter(":checked").length);

  if (allChecked) {
    $selectedText.text("전체");
    $multi.find(".placeholder").hide();
    $selectedText.show();

    $hidden.val("ALL"); 
    return;
  }

  // 개별 선택 처리
  const selected = $options.filter(":checked").map(function () {
    return $dropdown.find(`label[for="${$(this).attr('id')}"]`).text();
  }).get();

  const selectedValues = $options.filter(":checked").map(function () {
    return $(this).val();
  }).get();

  if (selected.length > 0) {
    $selectedText.text(selected.join(", "));
    $multi.find(".placeholder").hide();
    $multi.find(".selected").show();
  } else {
    $selectedText.text(title);
    $multi.find(".placeholder").show();
    $multi.find(".selected").hide();
  }

  $hidden.val(selectedValues.join(","));
}

  /* dropdown 열기 */
$multi.find(".select-head").on("click", function (e) {
  e.stopPropagation();

  const $head = $(this);

  // 이미 열려 있으면 닫기
  if ($dropdown.is(":visible")) {
    $dropdown.hide();
    $head.removeClass("focus");
    return;
  }

  $(".select-multi-dropdown").hide();
  $(".select-head").removeClass("focus");

  const offset = $head.offset();
  const headW = $head.outerWidth();
  const headH = $head.outerHeight();

  // 🔹 크기 측정용 (안 보이게 열기)
  $dropdown.css({
    display: "block",
    visibility: "hidden",
    width: headW
  });

  const dropW = $dropdown.outerWidth();
  const dropH = $dropdown.outerHeight();

  const winW = $(window).width();
  const winH = $(window).height();
  const scrollT = $(window).scrollTop();
  const scrollL = $(window).scrollLeft();

  // 기본 위치
  let top = offset.top + headH + 5;
  let left = offset.left;

  //세로 보정
  if (top + dropH > scrollT + winH) {
    top = offset.top - dropH - 5; // 위로
  }
  if (top < scrollT) {
    top = offset.top + headH + 5; // 그래도 넘치면 아래
  }

  // 가로 보정
  if (left + dropW > scrollL + winW) {
    left = scrollL + winW - dropW - 15;
  }
  if (left < scrollL) {
    left = scrollL + 15;
  }

  // 최종 적용
  $dropdown.css({
    top,
    left,
    visibility: "visible"
  });

  $dropdown.show();
  $head.addClass("focus");
});

$options.on("change", function () {
  const checkedCount = $options.filter(":checked").length;
  const isAllChecked = checkedCount === $options.length;

  $toggle.prop("checked", isAllChecked);

  $(this)
    .closest(".input-choice")
    .toggleClass("on", $(this).is(":checked"));

  $toggle.closest(".input-choice").toggleClass("on", isAllChecked);

  updateSelectedText();
});

  /* 전체 선택 */
  $toggle.on("change", function () {
    const isChecked = this.checked;

    $options.prop("checked", isChecked);
    $dropdown.find(".input-choice").toggleClass("on", isChecked);

    updateSelectedText();
  });

  if (allCheck === true) {
    $toggle.prop("checked", true);
    $options.prop("checked", true);
    $dropdown.find(".input-choice").addClass("on");
    updateSelectedText();
  }  

  // 닫기
  $(document).on("click", function (e) {
    if (
      !$(e.target).closest($multi).length &&
      !$(e.target).closest($dropdown).length
    ) {
      $dropdown.hide();
       $multi.find(".select-head").removeClass("focus");
    }
  });

  $("body").on("scroll", function () {
    $dropdown.hide();
     $multi.find(".select-head").removeClass("focus");
  });//

  $(window).on("scroll resize", function () { 
    $dropdown.hide(); 
    $multi.find(".select-head").removeClass("focus");
  });

  $multi.parents().each(function () {
    $(this).on("scroll", function () {
      $dropdown.hide();
       $multi.find(".select-head").removeClass("focus");
    });
  });
}


function initTextareaPlaceholder() {
  document.querySelectorAll('.textarea .textarea-placeholder').forEach(ph => {
    const textarea = ph.parentElement.querySelector('textarea');
    if (!textarea) return;
    const toggle = () => { ph.style.display = textarea.value ? 'none' : ''; };
    textarea.addEventListener('input', toggle);
    toggle();
  });
}

// ready
$(function(){
  layoutEvt();
  starGrade();
  tooltipOver();
  tooltipMenu();
  allCheck();
  tabEvt();
  popoverMoreView();
  initByteFields();
  initTextareaPlaceholder();

})