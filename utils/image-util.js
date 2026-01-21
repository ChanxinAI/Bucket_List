// 图片生成和保存工具

/**
 * 生成分享图片
 * @param {Array} selectedExperiences - 选中的体验项
 * @param {Function} callback - 回调函数，返回生成的图片路径
 */
function generateShareImage(selectedExperiences, callback) {
  const query = wx.createSelectorQuery();
  query.select('#shareCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
      if (!res[0]) {
        callback(new Error('Canvas 节点获取失败'));
        return;
      }

      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');

      // 设置画布实际尺寸
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = 375 * dpr;
      canvas.height = 667 * dpr;
      ctx.scale(dpr, dpr);

      // 设置画布背景
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, 375, 667);

      // 绘制标题
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#C4A2FF';
      ctx.textAlign = 'center';
      ctx.fillText('我的学生时代人生体验清单', 187.5, 50);

      // 绘制选中的体验项
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';

      let y = 100;
      selectedExperiences.forEach((experience, index) => {
        ctx.fillText(`${index + 1}. ${experience}`, 40, y);
        y += 30;

        // 控制画布高度
        if (y > 600) {
          ctx.fillText('...', 40, y);
          return false;
        }
      });

      // 绘制底部信息
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'center';
      ctx.fillText(`共${selectedExperiences.length}条体验`, 187.5, 640);

      // 将画布转换为图片
      wx.canvasToTempFilePath({
        canvas: canvas,
        success: function(res) {
          callback(null, res.tempFilePath);
        },
        fail: function(err) {
          callback(err);
        }
      });
    });
}

/**
 * 保存图片到本地
 * @param {string} imagePath - 图片路径
 * @param {Function} callback - 回调函数
 */
function saveImageToLocal(imagePath, callback) {
  // 检查权限
  wx.getSetting({
    success: function(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        // 请求权限
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function() {
            // 保存图片
            wx.saveImageToPhotosAlbum({
              filePath: imagePath,
              success: function() {
                callback(null, true);
              },
              fail: function(err) {
                callback(err);
              }
            });
          },
          fail: function(err) {
            callback(err);
          }
        });
      } else {
        // 已有权限，直接保存
        wx.saveImageToPhotosAlbum({
          filePath: imagePath,
          success: function() {
            callback(null, true);
          },
          fail: function(err) {
            callback(err);
          }
        });
      }
    }
  });
}

module.exports = {
  generateShareImage,
  saveImageToLocal
};