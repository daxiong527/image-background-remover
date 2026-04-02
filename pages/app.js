// API 基础地址
const API_BASE = 'https://fortune-profiles-structured-phase.trycloudflare.com';

// 初始化
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const errorMessage = document.getElementById('errorMessage');
const previewArea = document.getElementById('previewArea');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');
const downloadBtn = document.getElementById('downloadBtn');

let processedBlob = null;

// 点击上传
dropzone.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

// 拖拽上传
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('active');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('active');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('active');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// 处理文件
async function handleFile(file) {
  // 重置状态
  hideError();
  previewArea.classList.add('hidden');
  processedBlob = null;

  // 显示原图预览
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // 上传处理
  await uploadAndProcess(file);
}

// 上传并处理
async function uploadAndProcess(file) {
  progress.classList.remove('hidden');
  progressBar.style.width = '30%';
  progressText.textContent = '上传中...';

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(API_BASE + '/api/remove-bg', {
      method: 'POST',
      body: formData,
    });

    progressBar.style.width = '80%';
    progressText.textContent = '处理中...';

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '处理失败');
    }

    // 获取处理后的图片
    processedBlob = await response.blob();
    const url = URL.createObjectURL(processedBlob);
    processedImage.src = url;

    progressBar.style.width = '100%';
    progressText.textContent = '完成！';

    // 显示预览区
    setTimeout(() => {
      progress.classList.add('hidden');
      previewArea.classList.remove('hidden');
    }, 500);

  } catch (error) {
    progress.classList.add('hidden');
    showError(error.message);
  }
}

// 下载
downloadBtn.addEventListener('click', () => {
  if (!processedBlob) return;
  
  const url = URL.createObjectURL(processedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'removed-bg.png';
  a.click();
  URL.revokeObjectURL(url);
});

// 显示错误
function showError(message) {
  errorMessage.querySelector('p').textContent = message;
  errorMessage.classList.remove('hidden');
}

// 隐藏错误
function hideError() {
  errorMessage.classList.add('hidden');
}
