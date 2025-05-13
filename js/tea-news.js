document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const globalSearchBox = document.querySelector('.global-search');
    const rightSearchBox = document.querySelector('.input-box');
    const globalSearchInput = document.getElementById('globalSearch');
    const globalSearchBtn = document.getElementById('globalSearchBtn');
    const newsArticles = document.querySelectorAll('.tea-news-text');
    const suggestions = document.querySelectorAll('.search-suggestions');
    
    let isGlobalSearchVisible = false;
    let lastHighlightedArticle = null;
    let lastScrollTop = 0;
    let searchTimeout;

    // 创建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !isGlobalSearchVisible) {
                globalSearchBox.classList.add('visible');
                isGlobalSearchVisible = true;
            } else if (entry.isIntersecting && isGlobalSearchVisible) {
                globalSearchBox.classList.remove('visible');
                isGlobalSearchVisible = false;
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
    });

    observer.observe(rightSearchBox);

    // 搜索功能
    function performSearch(searchTerm, suggestionsList) {
        if (!searchTerm.trim()) {
            suggestionsList.classList.remove('active');
            return;
        }

        const results = [];
        newsArticles.forEach(article => {
            const title = article.querySelector('h2').textContent;
            const content = article.querySelector('p').textContent;
            
            if (title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                content.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    title,
                    content,
                    element: article,
                    score: calculateRelevanceScore(title, content, searchTerm)
                });
            }
        });

        // 按相关度排序
        results.sort((a, b) => b.score - a.score);
        
        // 显示搜索建议
        showSuggestions(results, searchTerm, suggestionsList);
    }

    // 计算相关度分数
    function calculateRelevanceScore(title, content, searchTerm) {
        let score = 0;
        searchTerm = searchTerm.toLowerCase();
        
        // 标题匹配权重更高
        if (title.toLowerCase().includes(searchTerm)) score += 10;
        
        // 计算内容中关键词出现的次数
        const contentMatches = (content.toLowerCase().match(new RegExp(searchTerm, 'g')) || []).length;
        score += contentMatches;
        
        return score;
    }

    // 显示搜索建议
    function showSuggestions(results, searchTerm, suggestionsList) {
        suggestionsList.innerHTML = '';
        
        if (results.length > 0) {
            results.forEach(result => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                
                const titleHtml = highlightText(result.title, searchTerm);
                const contentPreview = createContentPreview(result.content, searchTerm);
                
                div.innerHTML = `
                    <div class="suggestion-title">${titleHtml}</div>
                    <div class="suggestion-preview">${contentPreview}</div>
                `;
                
                div.addEventListener('click', () => {
                    handleSuggestionClick(result);
                    suggestionsList.classList.remove('active');
                });
                
                suggestionsList.appendChild(div);
            });
            
            suggestionsList.classList.add('active');
        } else {
            suggestionsList.innerHTML = '<div class="no-results">未找到相关内容</div>';
            suggestionsList.classList.add('active');
        }
    }

    // 创建内容预览
    function createContentPreview(content, searchTerm) {
        const maxLength = 100;
        const lowerContent = content.toLowerCase();
        const lowerSearchTerm = searchTerm.toLowerCase();
        const index = lowerContent.indexOf(lowerSearchTerm);
        
        if (index === -1) {
            return content.slice(0, maxLength) + '...';
        }

        const start = Math.max(0, index - 30);
        const end = Math.min(content.length, index + searchTerm.length + 30);
        let preview = content.slice(start, end);
        
        if (start > 0) preview = '...' + preview;
        if (end < content.length) preview += '...';
        
        return highlightText(preview, searchTerm);
    }

    // 高亮文本
    function highlightText(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // 处理建议点击
    function handleSuggestionClick(result) {
        // 移除之前的高亮
        removeHighlights();
        
        // 高亮选中的文章
        result.element.classList.add('highlight-article');
        
        // 高亮标题和内容中的关键词
        const title = result.element.querySelector('h2');
        const content = result.element.querySelector('p');
        
        title.innerHTML = result.title;
        content.innerHTML = result.content;
        
        // 滚动到文章位置
            const headerHeight = document.querySelector('.header').offsetHeight;
        const offset = headerHeight + 20;
            
                window.scrollTo({
            top: result.element.offsetTop - offset,
                    behavior: 'smooth'
                });
                
        // 15秒后移除高亮
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(removeHighlights, 15000);
    }

    // 移除高亮
    function removeHighlights() {
        newsArticles.forEach(article => {
            article.classList.remove('highlight-article');
            const highlights = article.querySelectorAll('.highlight');
            highlights.forEach(highlight => {
                const text = highlight.textContent;
                highlight.parentNode.replaceChild(document.createTextNode(text), highlight);
            });
        });
    }

    // 事件监听
    [globalSearchInput, rightSearchBox.querySelector('input')].forEach((input, index) => {
        const suggestionsList = suggestions[index];
        
        input.addEventListener('input', function() {
            performSearch(this.value, suggestionsList);
        });
        
        input.addEventListener('focus', function() {
            if (this.value.trim()) {
                suggestionsList.classList.add('active');
            }
        });
    });

    // 点击外部关闭建议框
    document.addEventListener('click', (e) => {
        suggestions.forEach(suggestionsList => {
            if (!suggestionsList.contains(e.target) && 
                !e.target.closest('.global-search') && 
                !e.target.closest('.input-box')) {
                suggestionsList.classList.remove('active');
            }
        });
    });

    // 搜索按钮点击事件
    [globalSearchBtn, rightSearchBox.querySelector('button')].forEach((button, index) => {
        button.addEventListener('click', function() {
            const input = index === 0 ? globalSearchInput : rightSearchBox.querySelector('input');
            const suggestionsList = suggestions[index];
            performSearch(input.value, suggestionsList);
        });
    });
}); 