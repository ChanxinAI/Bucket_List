// 全局变量
let selectedExperiences = [];

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    initApp();
});

/**
 * 初始化应用
 */
function initApp() {
    renderExperiences();
    bindEvents();
    updateSelectedCount();
}

/**
 * 渲染体验项
 */
function renderExperiences() {
    const grid = document.getElementById('experiences-grid');
    grid.innerHTML = '';
    
    // 获取体验数据
    const experiences = window.experiences || [];
    
    experiences.forEach((categoryData, categoryIndex) => {
        const category = categoryData.category;
        const items = categoryData.items;
        
        // 创建分类标题
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category;
        grid.appendChild(categoryTitle);
        
        // 创建分类容器
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        
        // 渲染分类下的体验项
        items.forEach((experience, index) => {
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';
            experienceItem.dataset.experience = experience;
            experienceItem.innerHTML = `<text class="experience-text">${experience}</text>`;
            
            // 绑定点击事件
            experienceItem.addEventListener('click', toggleExperience);
            
            categoryContainer.appendChild(experienceItem);
        });
        
        grid.appendChild(categoryContainer);
    });
}

/**
 * 切换体验项选中状态
 */
function toggleExperience(e) {
    const experienceItem = e.currentTarget;
    const experience = experienceItem.dataset.experience;
    
    const index = selectedExperiences.indexOf(experience);
    if (index > -1) {
        // 取消选中
        selectedExperiences.splice(index, 1);
        experienceItem.classList.remove('selected');
    } else {
        // 选中
        selectedExperiences.push(experience);
        experienceItem.classList.add('selected');
    }
    
    console.log('选中项:', selectedExperiences);
    updateSelectedCount();
}

/**
 * 更新选中数量
 */
function updateSelectedCount() {
    const countElement = document.getElementById('selected-count');
    if (countElement) {
        countElement.textContent = `已选择 ${selectedExperiences.length} 项体验`;
    }
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 分享按钮点击事件
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', shareLife);
}

/**
 * 分享人生
 */
function shareLife() {
    if (selectedExperiences.length === 0) {
        alert('请先选择体验项');
        return;
    }
    
    // 生成分享图片
    generateShareImage(selectedExperiences, function(err, imageUrl) {
        if (err) {
            console.error('生成图片失败:', err);
            alert('生成图片失败');
            return;
        }
        
        // 保存图片
        saveImageToLocal(imageUrl);
    });
}

/**
 * 生成分享图片
 */
function generateShareImage(selectedExperiences, callback) {
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    
    // 获取所有体验数据
    const allExperiences = [];
    window.experiences.forEach(category => {
        category.items.forEach(item => {
            allExperiences.push(item);
        });
    });
    
    // 设置画布尺寸为9:16
    const width = 750;
    const height = 1334; // 9:16比例
    canvas.width = width;
    canvas.height = height;
    
    // 设置画布背景
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制标题
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#C4A2FF';
    ctx.textAlign = 'center';
    ctx.fillText('人生体验清单(学生时代)', width / 2, 60);
    
    // 绘制选中数量
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`已选择 ${selectedExperiences.length} 项体验`, width / 2, 100);
    
    // 绘制所有体验项 - 4列布局，等宽
    ctx.font = '14px sans-serif';
    
    const padding = 20;
    const columnCount = 4;
    const itemWidth = (width - padding * 2) / columnCount;
    const rowHeight = 28;
    let x = padding;
    let y = 140;
    
    allExperiences.forEach((experience, index) => {
        const isSelected = selectedExperiences.includes(experience);
        
        // 检查是否需要换行
        if (index > 0 && index % columnCount === 0) {
            x = padding;
            y += rowHeight + 6;
        }
        
        // 设置背景颜色
        if (isSelected) {
            ctx.fillStyle = '#C4A2FF'; // 选中：紫色背景
        } else {
            ctx.fillStyle = '#333333'; // 未选中：灰色背景
        }
        
        // 绘制背景矩形
        ctx.fillRect(x, y, itemWidth, rowHeight);
        
        // 设置文字颜色
        if (isSelected) {
            ctx.fillStyle = '#391085'; // 选中：深紫色文字
        } else {
            ctx.fillStyle = '#FFFFFF'; // 未选中：白色文字
        }
        
        // 绘制文字（不带编号）
        ctx.textAlign = 'center';
        ctx.fillText(experience, x + itemWidth / 2, y + rowHeight / 2 + 4);
        
        // 调整位置
        x += itemWidth;
    });
    
    // 绘制二维码提示文字
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('用微信扫码，获取我的体验清单', width / 2, y + 100);
    
    // 绘制实际二维码
    var qrCodeImg = new Image();
    qrCodeImg.crossOrigin = 'Anonymous';
    qrCodeImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://chanxinai.github.io/Bucket_List/';
    qrCodeImg.onload = function() {
        ctx.drawImage(qrCodeImg, width / 2 - 80, y + 120, 160, 160);
        
        // 将画布转换为图片
        const imageUrl = canvas.toDataURL('image/png');
        callback(null, imageUrl);
    };
    qrCodeImg.onerror = function() {
        // 出错时绘制占位符
        ctx.fillStyle = '#333333';
        ctx.fillRect(width / 2 - 80, y + 120, 160, 160);
        
        ctx.font = 'bold 80px sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText('H', width / 2, y + 200);
        
        const imageUrl = canvas.toDataURL('image/png');
        callback(null, imageUrl);
    };
    return; // 等待图片加载完成后再执行回调
    
    // 将画布转换为图片
    const imageUrl = canvas.toDataURL('image/png');
    callback(null, imageUrl);
}

/**
 * 保存图片到本地
 */
function saveImageToLocal(imageUrl) {
    // 创建下载链接
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = '人生体验清单.png';
    link.click();
    
    // 显示成功提示
    alert('保存成功');
}