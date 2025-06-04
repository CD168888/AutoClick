// 创建并插入悬浮窗口
function createFloatingWindow() {
  const floatingDiv = document.createElement('div');
  floatingDiv.className = 'auto-clicker-floating-window';
  floatingDiv.innerHTML = `
    <div class="container">
      <div class="drag-handle">
        <div class="window-controls">
          <span class="control close"></span>
          <span class="control minimize"></span>
          <span class="control maximize"></span>
        </div>
        <span class="title">自动点击助手</span>
        <span class="spacer"></span>
      </div>
      <div class="content">
        <div class="status-container">
          <span>状态</span>
          <span id="auto-clicker-status" class="status-badge">未运行</span>
        </div>
        <button id="auto-clicker-toggle">开启自动点击</button>
        <div class="info">
          <svg class="info-icon" viewBox="0 0 24 24" width="12" height="12">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>每10秒自动检测并点击按钮</span>
        </div>
        <div class="author">by 蒋小渡</div>
      </div>
    </div>
  `;
  document.body.appendChild(floatingDiv);

  // 添加拖动功能
  const dragHandle = floatingDiv.querySelector('.drag-handle');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  dragHandle.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target.classList.contains('control')) return;
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === dragHandle || e.target.classList.contains('title')) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      setTranslate(currentX, currentY, floatingDiv);
    }
  }

  function dragEnd() {
    isDragging = false;
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

  // 最小化功能
  const minimizeBtn = floatingDiv.querySelector('.control.minimize');
  const content = floatingDiv.querySelector('.content');
  let isMinimized = false;

  minimizeBtn.addEventListener('click', () => {
    content.style.display = isMinimized ? 'block' : 'none';
    floatingDiv.classList.toggle('minimized');
    isMinimized = !isMinimized;
  });

  // 关闭功能
  const closeBtn = floatingDiv.querySelector('.control.close');
  closeBtn.addEventListener('click', () => {
    floatingDiv.style.display = 'none';
  });

  // 添加自动点击功能
  const toggleButton = floatingDiv.querySelector('#auto-clicker-toggle');
  const statusElement = floatingDiv.querySelector('#auto-clicker-status');
  let isRunning = false;

  toggleButton.addEventListener('click', () => {
    if (!isRunning) {
      startAutoClick();
      toggleButton.textContent = '停止自动点击';
      toggleButton.classList.add('stop');
      statusElement.textContent = '运行中';
      statusElement.classList.add('running');
      isRunning = true;
    } else {
      stopAutoClick();
      toggleButton.textContent = '开启自动点击';
      toggleButton.classList.remove('stop');
      statusElement.textContent = '已停止';
      statusElement.classList.remove('running');
      isRunning = false;
    }
  });
}

// 开始自动点击的函数
function startAutoClick() {
  if (!window.autoClickInterval) {
    window.autoClickInterval = setInterval(function () {
      const button = document.querySelector(
        '.dialog-button-container button[type="button"]'
      );
      if (button) {
        console.log('找到按钮，执行点击');
        button.click();
      } else {
        console.log('未找到目标按钮');
      }
    }, 10000);
    console.log('自动点击已启动');
  }
}

// 停止自动点击的函数
function stopAutoClick() {
  if (window.autoClickInterval) {
    clearInterval(window.autoClickInterval);
    window.autoClickInterval = null;
    console.log('自动点击已停止');
  }
}

// 注入样式
const style = document.createElement('style');
style.textContent = `
  .auto-clicker-floating-window {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1),
                0 0 1px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
    user-select: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .auto-clicker-floating-window.minimized {
    height: 32px;
    overflow: hidden;
  }

  .auto-clicker-floating-window .container {
    width: 240px;
    overflow: hidden;
  }

  .auto-clicker-floating-window .drag-handle {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .window-controls {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .control {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .control.close {
    background-color: #ff5f57;
  }

  .control.minimize {
    background-color: #febc2e;
  }

  .control.maximize {
    background-color: #28c840;
  }

  .control:hover {
    filter: brightness(0.9);
  }

  .title {
    font-size: 12px;
    color: #1c1c1e;
    margin-left: 4px;
    font-weight: 500;
  }

  .spacer {
    flex-grow: 1;
  }

  .auto-clicker-floating-window .content {
    padding: 12px;
  }

  .status-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 12px;
    color: #1c1c1e;
  }

  .status-badge {
    background: rgba(0, 0, 0, 0.05);
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    color: #1c1c1e;
  }

  .status-badge.running {
    background: rgba(52, 199, 89, 0.1);
    color: #34c759;
  }

  button {
    background: #007aff;
    color: white;
    padding: 8px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button:hover {
    transform: translateY(-1px);
    background: #0071eb;
    box-shadow: 0 4px 8px rgba(0, 122, 255, 0.1);
  }

  button:active {
    transform: translateY(0);
  }

  button.stop {
    background: #ff3b30;
  }

  button.stop:hover {
    background: #ff2d55;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #8e8e93;
    font-size: 11px;
    line-height: 1.3;
    padding: 8px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }

  .info-icon {
    flex-shrink: 0;
    opacity: 0.7;
    width: 10px;
    height: 10px;
  }

  .author {
    font-size: 10px;
    color: #8e8e93;
    text-align: right;
    padding-top: 8px;
    opacity: 0.7;
    font-style: italic;
  }
`;

document.head.appendChild(style);

// 创建悬浮窗口
createFloatingWindow();
