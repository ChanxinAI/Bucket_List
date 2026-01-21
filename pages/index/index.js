// 导入体验数据和图片工具
const experiences = require('../../utils/experiences');
const imageUtil = require('../../utils/image-util');

Page({
  data: {
    experiences: experiences,
    selectedExperiences: [],
    showCanvas: false
  },

  onLoad: function() {
    console.log('页面加载完成');
  },

  /**
   * 切换体验项选中状态
   */
  toggleExperience: function(e) {
    const experience = e.currentTarget.dataset.experience;
    const selectedExperiences = [...this.data.selectedExperiences];
    
    const index = selectedExperiences.indexOf(experience);
    if (index > -1) {
      // 取消选中
      selectedExperiences.splice(index, 1);
    } else {
      // 选中
      selectedExperiences.push(experience);
    }
    
    console.log('选中项:', selectedExperiences);
    
    this.setData({
      selectedExperiences: selectedExperiences
    });
  },

  /**
   * 分享人生
   */
  shareLife: function() {
    const selectedExperiences = this.data.selectedExperiences;
    
    if (selectedExperiences.length === 0) {
      wx.showToast({
        title: '请先选择体验项',
        icon: 'none'
      });
      return;
    }
    
    // 显示加载提示
    wx.showLoading({
      title: '生成图片中...'
    });
    
    // 生成分享图片
    imageUtil.generateShareImage(selectedExperiences, (err, imagePath) => {
      if (err) {
        wx.hideLoading();
        wx.showToast({
          title: '生成图片失败',
          icon: 'none'
        });
        console.error('生成图片失败:', err);
        return;
      }
      
      // 保存图片到本地
      imageUtil.saveImageToLocal(imagePath, (err, success) => {
        wx.hideLoading();
        
        if (err) {
          wx.showToast({
            title: '保存失败，请检查权限',
            icon: 'none'
          });
          console.error('保存图片失败:', err);
          return;
        }
        
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      });
    });
  }
})