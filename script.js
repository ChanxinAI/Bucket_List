// 全局变量
let selectedExperiences = [];

// 人生段位数据
const lifeRanks = [
    {
        level: 1,
        name: "世界观察员",
        englishName: "World Observer",
        range: [0, 5],
        quote: "故事才刚刚翻开第一页。",
        emoji: "🔍"
    },
    {
        level: 2,
        name: "好奇漫游者",
        englishName: "Curious Roamer",
        range: [6, 20],
        quote: "保持好奇，去更大的世界撒野。",
        emoji: "🚶‍♂️"
    },
    {
        level: 3,
        name: "闪光收藏家",
        englishName: "Sparkle Collector",
        range: [21, 50],
        quote: "你收集的每一个瞬间，都是限量版。",
        emoji: "✨"
    },
    {
        level: 4,
        name: "极致生活家",
        englishName: "Ultimate Liver",
        range: [51, 80],
        quote: "把生活调成自己喜欢的频道。",
        emoji: "🎨"
    },
    {
        level: 5,
        name: "人间满级玩家",
        englishName: "Max Level Human",
        range: [81, 100],
        quote: "通关地球副本，也是一种天赋。",
        emoji: "🎮"
    }
];

/**
 * 根据选中数量获取人生段位
 */
function getCurrentRank(completedCount) {
    for (const rank of lifeRanks) {
        if (completedCount >= rank.range[0] && completedCount <= rank.range[1]) {
            return rank;
        }
    }
    return lifeRanks[0]; // 默认返回最低段位
}

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
    const fragment = document.createDocumentFragment();
    
    // 获取体验数据
    const experiences = window.experiences || [];
    
    experiences.forEach((categoryData) => {
        const category = categoryData.category;
        const items = categoryData.items;
        
        // 创建分类标题
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category;
        fragment.appendChild(categoryTitle);
        
        // 创建分类容器
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        
        // 渲染分类下的体验项
        items.forEach((experience) => {
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';
            experienceItem.dataset.experience = experience;
            experienceItem.innerHTML = `<text class="experience-text">${experience}</text>`;
            
            // 绑定点击事件
            experienceItem.addEventListener('click', toggleExperience);
            
            categoryContainer.appendChild(experienceItem);
        });
        
        fragment.appendChild(categoryContainer);
        
        // 检查是否是最后一个分类（第五章），如果是，添加Buy Me a Coffee按钮
        const lastCategoryIndex = experiences.length - 1;
        if (experiences.indexOf(categoryData) === lastCategoryIndex) {
            const coffeeButtonContainer = document.createElement('div');
            coffeeButtonContainer.style.display = 'flex';
            coffeeButtonContainer.style.justifyContent = 'center';
            coffeeButtonContainer.style.margin = '30px 0';
            
            const coffeeButton = document.createElement('button');
            coffeeButton.style.background = 'white';
            coffeeButton.style.color = '#8B4513';
            coffeeButton.style.border = '1px solid #8B4513';
            coffeeButton.style.borderRadius = '30px';
            coffeeButton.style.padding = '12px 30px';
            coffeeButton.style.fontSize = '16px';
            coffeeButton.style.fontWeight = '600';
            coffeeButton.style.cursor = 'pointer';
            coffeeButton.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.1)';
            coffeeButton.style.transition = 'all 0.3s ease';
            coffeeButton.textContent = 'Buy Me a Coffee';
            
            // 添加鼠标悬停效果
            coffeeButton.addEventListener('mouseover', function() {
                this.style.background = '#8B4513';
                this.style.color = 'white';
            });
            
            coffeeButton.addEventListener('mouseout', function() {
                this.style.background = 'white';
                this.style.color = '#8B4513';
            });
            
            // 添加点击事件，显示咖啡二维码弹框
            coffeeButton.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                showCoffeeModal();
            });
            
            coffeeButtonContainer.appendChild(coffeeButton);
            fragment.appendChild(coffeeButtonContainer);
        }
    });
    
    // 一次性更新DOM
    grid.innerHTML = '';
    grid.appendChild(fragment);
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
    // 生成报告按钮点击事件
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', generateExperienceReport);
    
    // 下载海报按钮点击事件
    const downloadBtn = document.getElementById('download-poster');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPoster);
    }
    
    // 昵称输入模态框事件
    const nicknameCancel = document.getElementById('nickname-cancel');
    if (nicknameCancel) {
        nicknameCancel.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            hideNicknameModal();
        });
    }
    
    const nicknameConfirm = document.getElementById('nickname-confirm');
    if (nicknameConfirm) {
        nicknameConfirm.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const nickname = document.getElementById('nickname-input').value;
            if (nickname && nickname.trim() !== '') {
                hideNicknameModal();
                proceedWithReport(nickname.trim());
            }
        });
    }
    
    // 咖啡二维码弹框事件
    const coffeeClose = document.getElementById('coffee-close');
    if (coffeeClose) {
        coffeeClose.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            hideCoffeeModal();
        });
    }
    
    // 为咖啡弹框添加点击事件阻止冒泡
    const coffeeModal = document.getElementById('coffee-modal');
    if (coffeeModal) {
        coffeeModal.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
        });
    }
    
    // 为输入框添加点击事件阻止冒泡
    const nicknameInput = document.getElementById('nickname-input');
    if (nicknameInput) {
        nicknameInput.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
        });
    }
    
    // 点击蒙层关闭预览
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            closePreview();
            hideNicknameModal();
            hideCoffeeModal();
        });
    }
    
    // 点击预览外部关闭预览
    document.addEventListener('click', function(e) {
        const posterPreview = document.getElementById('poster-preview');
        const nicknameModal = document.getElementById('nickname-modal');
        const coffeeModal = document.getElementById('coffee-modal');
        const overlay = document.getElementById('overlay');
        const shareBtn = document.getElementById('share-btn');
        const downloadBtn = document.getElementById('download-poster');
        const nicknameInput = document.getElementById('nickname-input');
        
        // 检查是否点击了预览外部
        if (posterPreview && posterPreview.style.display === 'block') {
            const isClickInside = posterPreview.contains(e.target);
            const isClickOnShareBtn = e.target === shareBtn;
            const isClickOnDownloadBtn = e.target === downloadBtn;
            
            if (!isClickInside && !isClickOnShareBtn && !isClickOnDownloadBtn) {
                closePreview();
            }
        }
        
        // 检查是否点击了昵称模态框外部
        if (nicknameModal && nicknameModal.style.display === 'block') {
            const isClickInside = nicknameModal.contains(e.target);
            const isClickOnShareBtn = e.target === shareBtn;
            
            if (!isClickInside && !isClickOnShareBtn) {
                hideNicknameModal();
            }
        }
        
        // 检查是否点击了咖啡模态框外部
        if (coffeeModal && coffeeModal.style.display === 'block') {
            const isClickInside = coffeeModal.contains(e.target);
            
            if (!isClickInside) {
                hideCoffeeModal();
            }
        }
    });
}

/**
 * 生成体验报告
 */
function generateExperienceReport(e) {
    // 阻止事件冒泡，防止点击分享按钮后模态框立即消失
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (selectedExperiences.length === 0) {
        alert('请先选择体验项');
        return;
    }
    
    // 显示昵称输入模态框
    showNicknameModal();
}

/**
 * 显示昵称输入模态框
 */
function showNicknameModal() {
    const modal = document.getElementById('nickname-modal');
    const overlay = document.getElementById('overlay');
    const input = document.getElementById('nickname-input');
    
    if (modal && overlay) {
        // 显示蒙层和模态框
        overlay.style.display = 'block';
        modal.style.display = 'block';
        
        // 重置输入框并设置焦点（添加延迟确保模态框完全显示）
        setTimeout(function() {
            if (input) {
                input.value = '';
                input.focus();
                // 对于移动设备，尝试触发虚拟键盘
                if ('focus' in input && 'select' in input) {
                    input.focus();
                    input.select();
                }
            }
        }, 100);
    }
}

/**
 * 隐藏昵称输入模态框
 */
function hideNicknameModal() {
    const modal = document.getElementById('nickname-modal');
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

/**
 * 显示咖啡二维码弹框
 */
function showCoffeeModal() {
    const modal = document.getElementById('coffee-modal');
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        overlay.style.display = 'block';
        modal.style.display = 'block';
    }
}

/**
 * 隐藏咖啡二维码弹框
 */
function hideCoffeeModal() {
    const modal = document.getElementById('coffee-modal');
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

/**
 * 确认昵称后继续生成报告
 */
function proceedWithReport(nickname) {
    // 更新海报标题
    const posterTitle = document.getElementById('poster-title-text');
    if (posterTitle) {
        posterTitle.textContent = `${nickname} 的人生体验报告`;
    }
    
    // 填充预览内容
    populatePreview(selectedExperiences);
    
    // 显示预览
    showPreview();
}

/**
 * 填充预览内容
 */
function populatePreview(selectedExperiences) {
    // 获取当前段位
    const rank = getCurrentRank(selectedExperiences.length);
    
    // 更新进度
    const completedCountEl = document.getElementById('completed-count');
    if (completedCountEl) {
        completedCountEl.textContent = selectedExperiences.length;
    }
    
    // 更新进度圈
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progress = selectedExperiences.length / 100;
        const rotation = -45 + (progress * 360);
        progressFill.style.transform = `rotate(${rotation}deg)`;
        
        // 使用统一的颜色
        progressFill.style.borderTopColor = '#f99d33';
    }
    
    // 更新段位信息
    const rankNameEl = document.getElementById('rank-name');
    const rankQuoteEl = document.getElementById('rank-quote');
    
    if (rankNameEl) rankNameEl.textContent = `${rank.emoji} ${rank.name}`;
    if (rankQuoteEl) rankQuoteEl.textContent = `"${rank.quote}"`;
    
    // 更新体验项模块展示
    const wordcloudEl = document.getElementById('experience-wordcloud');
    if (wordcloudEl) {
        wordcloudEl.innerHTML = '';
        wordcloudEl.style.display = 'flex';
        wordcloudEl.style.flexDirection = 'column';
        wordcloudEl.style.alignItems = 'center';
        wordcloudEl.style.flexGrow = '1';
        wordcloudEl.style.padding = '0';
        wordcloudEl.style.boxSizing = 'border-box';
        wordcloudEl.style.marginBottom = '20px';
        
        if (selectedExperiences.length === 0) {
            // 没有选中体验项
            const emptyMessage = document.createElement('div');
            emptyMessage.style.width = '100%';
            emptyMessage.style.background = 'white';
            emptyMessage.style.border = '2px solid #E6E6FA';
            emptyMessage.style.borderRadius = '15px';
            emptyMessage.style.padding = '40px 20px';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.innerHTML = '<p style="margin: 0; font-size: 16px; color: #8B4513;">还没有选择体验项，快去探索吧！</p>';
            wordcloudEl.appendChild(emptyMessage);
        } else {
            // 处理选中项，超过6个时随机选择6个
            let displayExperiences = selectedExperiences;
            if (selectedExperiences.length > 6) {
                // 随机选择6个
                displayExperiences = [];
                const tempExperiences = [...selectedExperiences];
                for (let i = 0; i < 6 && tempExperiences.length > 0; i++) {
                    const randomIndex = Math.floor(Math.random() * tempExperiences.length);
                    displayExperiences.push(tempExperiences.splice(randomIndex, 1)[0]);
                }
            }
            
            // 创建标题
            const moduleTitle = document.createElement('h3');
            moduleTitle.style.margin = '0 0 15px 0';
            moduleTitle.style.fontSize = '18px';
            moduleTitle.style.fontWeight = '600';
            moduleTitle.style.color = 'rgba(0, 0, 0, 0.9)';
            moduleTitle.style.textAlign = 'center';
            moduleTitle.textContent = '✨ 人生高光时刻 ✨';
            wordcloudEl.appendChild(moduleTitle);
            
            // 创建体验项列表（两列布局）
            const experienceList = document.createElement('div');
            experienceList.style.display = 'flex';
            experienceList.style.flexWrap = 'wrap';
            experienceList.style.gap = '10px';
            experienceList.style.justifyContent = 'space-between';
            
            // 定义卡片颜色（使用浅色）
            const cardColors = ['#FFFFFF', '#FFF9C4', '#FFEBEE', '#E0F7FA', '#E1F5FE', '#E8F5E9'];
            
            displayExperiences.forEach((experience, index) => {
                const experienceItem = document.createElement('div');
                const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];
                
                experienceItem.style.display = 'flex';
                experienceItem.style.flexDirection = 'column';
                experienceItem.style.alignItems = 'flex-start';
                experienceItem.style.justifyContent = 'center';
                experienceItem.style.padding = '10px';
                experienceItem.style.background = randomColor;
                experienceItem.style.borderRadius = '15px';
                experienceItem.style.width = 'calc(50% - 5px)';
                experienceItem.style.boxSizing = 'border-box';
                experienceItem.style.minHeight = '80px';
                
                // 添加文字
                const itemText = document.createElement('div');
                itemText.style.fontSize = '13px';
                itemText.style.color = '#333333';
                itemText.style.lineHeight = '1.4';
                itemText.style.textAlign = 'left';
                itemText.style.fontWeight = '500';
                itemText.textContent = experience;
                
                experienceItem.appendChild(itemText);
                experienceList.appendChild(experienceItem);
            });
            
            wordcloudEl.appendChild(experienceList);
        }
    }
}

/**
 * 保存图片到本地
 */
function saveImageToLocal(imageUrl) {
    // 创建下载链接
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = '人生必做的 100 件事.png';
    link.click();
    
    // 显示成功提示
    alert('保存成功');
}

/**
 * 显示预览
 */
function showPreview() {
    const posterPreview = document.getElementById('poster-preview');
    const overlay = document.getElementById('overlay');
    const downloadBtn = document.querySelector('.download-btn');
    if (posterPreview && overlay) {
        overlay.style.display = 'block';
        posterPreview.style.display = 'block';
        if (downloadBtn) {
            downloadBtn.style.display = 'block';
        }
    }
}

/**
 * 关闭预览
 */
function closePreview() {
    const posterPreview = document.getElementById('poster-preview');
    const overlay = document.getElementById('overlay');
    const downloadBtn = document.querySelector('.download-btn');
    if (posterPreview && overlay) {
        overlay.style.display = 'none';
        posterPreview.style.display = 'none';
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
    }
}

/**
 * 下载海报
 */
function downloadPoster() {
    const posterPreview = document.getElementById('poster-preview');
    if (!posterPreview) return;
    
    // 检查html2canvas是否加载
    if (typeof html2canvas === 'undefined') {
        // 动态加载html2canvas
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = function() {
            capturePoster(posterPreview);
        };
        script.onerror = function() {
            alert('下载失败：无法加载必要的库');
        };
        document.head.appendChild(script);
    } else {
        // 直接使用html2canvas
        capturePoster(posterPreview);
    }
}

/**
 * 捕获海报为图片
 */
function capturePoster(element) {
    // 使用html2canvas捕获海报
    html2canvas(element, {
        scale: 2, // 提高清晰度
        useCORS: true, // 允许加载跨域图片
        logging: false,
        backgroundColor: null
    }).then(function(canvas) {
        // 转换为图片URL
        const imageUrl = canvas.toDataURL('image/png');
        
        // 保存图片
        saveImageToLocal(imageUrl);
    }).catch(function(error) {
        console.error('下载失败:', error);
        alert('下载失败，请重试');
    });
}

/**
 * 生成随机颜色
 */
function getRandomColor() {
    const colors = [
        '#FFB6C1', // 浅粉红
        '#87CEFA', // 浅天蓝
        '#98FB98', // 浅绿
        '#FFDAB9', // 浅橙
        '#D8BFD8', // 淡紫
        '#FFA07A', // 浅鲑鱼色
        '#90EE90', // 淡绿
        '#B0E0E6', // 粉蓝
        '#FFB6C1', // 浅粉红
        '#FFC0CB'  // 粉红
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 获取对比色（黑色或白色）
 */
function getContrastColor(backgroundColor) {
    // 简单的颜色亮度计算
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#333333' : '#FFFFFF';
}

/**
 * 生成随机旋转角度
 */
function getRandomRotation() {
    const rotations = [-15, -10, -5, 0, 5, 10, 15];
    return rotations[Math.floor(Math.random() * rotations.length)];
}
