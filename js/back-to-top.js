document.addEventListener('DOMContentLoaded', function() {
    // 创建返回顶部按钮
    const button = document.createElement('div');
    button.className = 'back-to-top';
    button.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(-90 12 12)"/>
        </svg>
    `;
    document.body.appendChild(button);

    let hideTimeout;
    let scrollTimeout;

    // 检查滚动位置并显示/隐藏按钮
    function checkScroll() {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }

    // 设置自动隐藏
    function startHideTimer() {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (window.pageYOffset > 300) {
                button.classList.remove('visible');
            }
        }, 2000);
    }

    // 使用防抖处理滚动事件
    function handleScroll() {
        checkScroll();
        clearTimeout(scrollTimeout);
        
        // 清除之前的隐藏计时器
        clearTimeout(hideTimeout);
        
        // 如果页面滚动超过阈值，显示按钮
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        }
        
        // 设置新的滚动超时
        scrollTimeout = setTimeout(() => {
            startHideTimer();
        }, 150); // 150ms后判断是否停止滚动
    }

    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);

    // 初始检查
    checkScroll();
    startHideTimer();

    // 点击返回顶部
    button.addEventListener('click', function() {
        // 使用requestAnimationFrame实现更快的滚动
        const duration = 500; // 滚动持续时间（毫秒）
        const start = window.pageYOffset;
        const startTime = performance.now();

        function scroll() {
            const currentTime = performance.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // 使用easeOutQuad缓动函数使动画更自然
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            
            window.scrollTo(0, start * (1 - easeProgress));

            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        }

        requestAnimationFrame(scroll);
    });
}); 