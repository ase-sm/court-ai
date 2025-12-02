
  // gnb메누
  function gnbMenu(){
      const $gnb = $('.gnb > li > a');

      $gnb.on('click', function (e) {
        if($(this).next('ul').length > 0) e.preventDefault();

          const $parentLi = $(this).parent('li');
          const $submenu = $parentLi.children('ul');

          $parentLi.siblings().removeClass('on').find('ul').slideUp(200);

          if ($submenu.length) {
              $parentLi.toggleClass('on');
              $submenu.stop(true, true).slideToggle(200);
          } else {
              $parentLi.addClass('on').siblings().removeClass('on');
          }
      });

      $('.gnb > li.selected').each(function () {
          $(this).children('ul').show();
      });  
  }

  // DATE
  function datepicker(){
    if($(".datepicker").length <= 0) return;
    $(".datepicker").datepicker({
      showOn: 'focus', 
      dateFormat:"yy.mm.dd",
      changeYear:true,
      changeMonth:true,
      showMonthAfterYear:true,
      monthNames:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      monthNamesShort:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      dayNames:['일','월','화','수','목','금','토'],
      dayNamesShort:['일','월','화','수','목','금','토'],
      dayNamesMin:['일','월','화','수','목','금','토'],
      minDate: '',
      maxDate: '',
      // yearSuffix: '년',
      onClose: function( selectedDate ) {
        //add on event 
      }	,
      beforeShow: function(input, inst) {
        
        if($(input).data('min')) $(input).datepicker('option', 'minDate', $(input).data('min'));
        if($(input).data('max')) $(input).datepicker('option', 'maxDate', $(input).data('max'));
  
        setTimeout(function(){
          if($('.ui-datepicker-year option').text().indexOf('년') == -1) $('.ui-datepicker-year option').append('년')
        }, 10)
        },
        onChangeMonthYear: function(input, inst) {
        setTimeout(function(){
          if($('.ui-datepicker-year option').text().indexOf('년') == -1) $('.ui-datepicker-year option').append('년')
        }, 10)
        },
    });
  }
function dateSet(){
    $("[data-evt=date-menu]").children("label").each(function () {
        var radioLabel = $(this);

        radioLabel.on("click", function (e) {
            var value = radioLabel.find("input:radio").val();

            radioLabel.find("input:radio").prop("checked", true);

            const $row = radioLabel.closest(".row");

            $row.find('.start-date').val(extractDate(value));
            $row.find('.end-date').val(extractDate("today"));

            e.preventDefault();
        });
    });

    function extractDate(val) {
        var nowDate = new Date();

        switch (val) {
            case "today":
                break;
            case "oneWeek":
                nowDate.setDate(nowDate.getDate() - 7);
                break;
            case "threeDay":
                nowDate.setDate(nowDate.getDate() - 3);
                break;
            case "oneMonth":
                nowDate.setMonth(nowDate.getMonth() - 1);
                break;
        }

        var year = nowDate.getFullYear();
        var month = ("0" + (1 + nowDate.getMonth())).slice(-2);
        var day = ("0" + nowDate.getDate()).slice(-2);

        return year + "-" + month + "-" + day;
    }    
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
      Object.assign(dropdownEl.style, {
        top: `${rect.bottom + window.scrollY + 5}px`,
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



// 팝업
function popClose(popup){
  let $popup = $(popup);
  $popup.fadeOut();
  $('body, html').css('overflow', '');
  $('body').removeClass('pop-open');
}

function popOpen(popup, callback){
  let $popup = $(popup);
  scrollPosition = $(window).scrollTop();

  $popup.fadeIn();
  $('body, html').css('overflow', 'hidden');
  $('body').addClass('pop-open');

  $popup.find('.btn-close').on('click', function(){
    popClose(popup)
  });

  if(callback) callback();
}

function sidePopClose(popup){
  let $popup = $(popup);
  let $dim = $(popup).find('.dim');

    $popup.removeClass('on');
    $dim.fadeOut();
    setTimeout(function(){$popup.fadeOut();}, 200)
    $('body, html').css('overflow', '');
    $('body').removeClass('side-pop-open');
}

function sidePopOpen(popup, callback){
  let $popup = $(popup);
  let $dim = $(popup).find('.dim');

  $popup.show();
  setTimeout(function(){$popup.addClass('on');}, 100)
  $dim.fadeIn();
  $('body, html').css('overflow', 'hidden');
  $('body').addClass('side-pop-open');

  $popup.find('.btn-close').on('click', function(){
    sidePopClose(popup);
  });

  if(callback) callback();
}


// 파일업로드
function initFileUpload(wrapperSelector) {

    const wrap = document.querySelector(wrapperSelector);
    if (!wrap) return console.error(`wrap not found: ${wrapperSelector}`);

    const fileInput         = wrap.querySelector("input[type=file]");
    const fileUl            = wrap.querySelector(".file-ul");
    const fileCountEm       = wrap.querySelector(".upload-file-list .info .num em");
    const btnDeleteAll      = wrap.querySelector(".btn-delete-all");
    const totalByteEl       = wrap.querySelector(".upload-file-list .info .byte");
    const maxByteDisplayEl  = wrap.querySelector(".file-upload .file-info .byte");
    const maxFileCountEl    = wrap.querySelector(".file-upload .file-info .num em");

    let MAX_FILES = Number(maxFileCountEl?.innerText || 10);
    let MAX_TOTAL_SIZE = 800 * 1024 * 1024; // fallback
    const ALLOWED_EXT = ["pdf", "hwp", "doc", "ppt", "pptx", "xlsx", "txt"];
    let fileList = [];


    function parseSizeStringToBytes(sizeStr) {
        if (!sizeStr) return null;
        const m = sizeStr.trim().match(/^([\d.,]+)\s*(b|kb|mb|gb)?$/i);
        if (!m) return null;
        const val = parseFloat(m[1].replace(",", "."));
        const unit = (m[2] || "b").toLowerCase();

        switch (unit) {
            case "gb": return val * 1024 * 1024 * 1024;
            case "mb": return val * 1024 * 1024;
            case "kb": return val * 1024;
            default:   return val;
        }
    }

    function formatBytes(bytes) {
        if (bytes === 0) return "0B";
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(1) + sizes[i];
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function readMaxSizeFromDOM() {
        if (!maxByteDisplayEl) return;

        const text = maxByteDisplayEl.innerText || "";
        const match = text.match(/[\d.,]+\s*(GB|MB|KB|B)?/i);

        if (match) {
            const bytes = parseSizeStringToBytes(match[0]);
            if (bytes != null) MAX_TOTAL_SIZE = bytes;
        }
    }

    readMaxSizeFromDOM();


    // events
    wrap.querySelector(".btn-upload")?.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        const selectedFiles = Array.from(fileInput.files || []);

        for (let file of selectedFiles) {
            const ext = file.name.split(".").pop().toLowerCase();

            if (!ALLOWED_EXT.includes(ext)) {
                customAlert(`${file.name} 은(는) 업로드할 수 없는 확장자입니다.`, "alert");  
                continue;
            }

            if (fileList.length >= MAX_FILES) {
                customAlert(`최대 ${MAX_FILES}개의 파일까지 업로드할 수 있습니다.`, "alert");  
                break;
            }

            fileList.push(file);
        }

        const totalSize = fileList.reduce((sum, f) => sum + f.size, 0);

        if (totalSize > MAX_TOTAL_SIZE) {
            customAlert(`총 용량이 최대(${formatBytes(MAX_TOTAL_SIZE)})를 초과했습니다.`, "alert");  

            let acc = 0;
            const allowed = [];

            for (let f of fileList) {
                if (acc + f.size <= MAX_TOTAL_SIZE && allowed.length < MAX_FILES) {
                    allowed.push(f);
                    acc += f.size;
                }
            }
            fileList = allowed;
        }

        fileInput.value = "";
        render();
    });

    btnDeleteAll.addEventListener("click", () => {
        if (fileList.length === 0) return;
        customAlert("전체 삭제하시겠습니까?", "confirm").then(result => {
          if (result) {
            fileList = [];render();
          }
        });
    });

    // render
    function render() {

        const fileListBox = wrap.querySelector(".upload-file-list");
        if (fileListBox) {
            fileListBox.style.display = fileList.length > 0 ? "block" : "none";
        }

        fileUl.innerHTML = "";

        fileList.forEach((file, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="file-name">
                    <span class="name">${escapeHtml(file.name)}</span>
                    <span class="file-info">${(file.size/1024/1024).toFixed(1)}MB</span>
                </div>
                <div class="file-menu">
                    <button type="button" class="btn-delete" data-idx="${index}"><span class="hidden">삭제</span></button>
                </div>
            `;
            fileUl.appendChild(li);
        });

        fileCountEm.textContent = fileList.length;

        const totalSize = fileList.reduce((sum, f) => sum + f.size, 0);
        if (totalByteEl) totalByteEl.textContent = formatBytes(totalSize);

        wrap.querySelectorAll(".btn-delete[data-idx]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.currentTarget.dataset.idx);
                fileList.splice(idx, 1);
                render();
            });
        });

    }

    render();
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

// 탭
function tabEvt(){
  let tabs = [];
  $('[data-tab-id]').on('click', function(e){
    e.stopPropagation();
    let tabid = $(this).data('tab-id');

    tabs = [];
    tabs.push(tabid);

    $(this).parents('li').addClass('on');
    $(this).parents('li').siblings().find('[data-tab-id]').each(function(){
      $(this).parents('li').removeClass('on');
      tabs.push($(this).data('tab-id'));
    });

    tabs.forEach(function(v){
      $('#'+v).hide();
    });
    $('#'+tabid).show();

    if($(this).parents('.tab-condition').length > 0){
      let $selectd = $(this).parents('.tab-condition').find('.selected');
      $selectd.find('button').text($(this).text())
    }
  })

}

// 숫자 증감 인풋
function countInput(){	
  var obj = '[data-evt*="inp-number"]';
  if($(obj).length <= 0) return;
  var countChange = function(btn){
    var $obj = $(btn).closest(obj);
        var minCnt = $obj.data('min') != undefined ? $obj.data('min') : 0;
    var maxCnt = $obj.data('max') != undefined ? $obj.data('max') : 1000;
        var nowCnt	= parseInt($obj.find('.num').text());
    var modeStr = $(btn).hasClass('up') ? 'up' : 'dn';
        var salesUnit = 1;
    var maxCntChk = true;
        var cntInput =  $obj.find('.num');

    if (modeStr == 'up') {
      $(btn).siblings('.down').removeClass('disabled');			
      if(nowCnt >= maxCnt-1 ){
        $(btn).addClass('disabled');
      }
      if (maxCntChk === true && (nowCnt+salesUnit) > maxCnt) {
        var thisCnt	= nowCnt;
      } else {
        var thisCnt	= nowCnt + salesUnit;
      }
    } else if (modeStr == 'dn') {
      $(btn).siblings('.up').removeClass('disabled');
      if (nowCnt <= minCnt+1) {
        $(btn).addClass('disabled');
      }
      if (nowCnt > minCnt) {
        var thisCnt	= nowCnt - salesUnit;
      }else{
        var thisCnt = nowCnt;
      }
    }

    if(thisCnt > 0){$obj.addClass('active');}
    else{$obj.removeClass('active');}
    $(cntInput).text(thisCnt);
    }


  //초기화
  $(obj+' button').each(function(){
    var $obj = $(this).closest(obj);
    var minCnt = $obj.data('min') != undefined ? $obj.data('min') : 0;
    var maxCnt = $obj.data('max') != undefined ? $obj.data('max') : 1000;
    var cntInputNum =  $obj.find('.num').text();

    if($(this).hasClass('down') && cntInputNum <= minCnt) $(this).addClass('disabled');
    else if($(this).hasClass('up') && cntInputNum >= maxCnt)  $(this).addClass('disabled');
  });
  
  $(obj+' button').on('click', function(e){
    e.stopPropagation();
    countChange(this, 1);
    return false;
  });
}


const createCharts = (function () {
  const chartBase = {
    grid: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
      containLabel: true
    },
    tooltip : {
      backgroundColor: '#fff',
      borderColor: '#003675',
      borderWidth: 1,
      padding: 16,
      borderRadius: 8,      
      boxShadow: '3px 3px 10px rgba(85, 85, 85, 0.2)',      
    }
  };

  const baseYAxis = {
    type: 'value',
    splitLine: {
       show: true,
      lineStyle: {
        type: 'dashed',
        color: '#E6E8EA'
      }
    },
    axisLine: {
      lineStyle: {
        type: 'dashed',
        color: '#E6E8EA',
        width: 1
      }
    },
    axisLabel: {
      color: '#95989D',
      lineHeight: 15,
      fontSize: 10,
      // fontFamily: "NanumSquareNeo",
      interval: 0
    }
  };

  const baseXAxis = (data) => ({
    type: 'category',
    data,
    axisTick: { show: false },
    axisLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#E6E8EA',
        width: 1
      }
    },
    axisLabel: {
      color: '#95989D',
      lineHeight: 15,
      fontSize: 10,
      fontFamily: "Pretendard GOV",
      interval: 0
    }
  });

  function createCharts(id, customOptions = {}) {
    const el = document.getElementById(id.replace('#', ''));
    echarts.dispose(el);
    const chart = echarts.init(el);

    // pie, gauge, radar, scatter 등 축이 필요 없는 타입 감지
    const hasAxis = !customOptions.series ||
                    customOptions.series.some(s => ['pie', 'gauge', 'radar'].includes(s.type)) === false;

    const mergedOptions = {
      ...chartBase,
      ...(hasAxis ? { yAxis: customOptions.yAxis || baseYAxis } : {}),
      ...customOptions,
        tooltip: {
        ...chartBase.tooltip,
        ...customOptions.tooltip
      }
    };

    chart.setOption(mergedOptions);
    window.addEventListener('resize', () => chart.resize());
  }

  createCharts.baseYAxis = baseYAxis;
  createCharts.baseXAxis = baseXAxis;
  return createCharts;
})();


// 얼럿
function customAlert(message, type = "") {
  return new Promise((resolve) => {
    $(".alert-popup").remove();

    const $popup = $(`
      <section class="alert-popup" role="alertdialog" style="display: block;">
        <div class="dim"></div>
        <div class="popup" role="document" tabindex="-1" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-desc">
          <div class="pop-body">
            <p id="alert-desc" class="alert-txt">${message}</p>
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


// ready
$(function(){
  datepicker();
  dateSet();
  gnbMenu();
  initByteFields();
  tabEvt();
  countInput();
})