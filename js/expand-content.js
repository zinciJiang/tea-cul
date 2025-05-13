document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const contentModal = document.querySelector('.content-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTitle = document.querySelector('.modal-title');
    const modalText = document.querySelector('.modal-text');

    // 打开模态框
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.card');
            const title = card.querySelector('.name').textContent;
            const expandedContent = card.querySelector('.expanded-content').innerHTML;
            
            modalTitle.textContent = title;
            modalText.innerHTML = expandedContent;
            
            modalOverlay.style.display = 'block';
            contentModal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            // 添加动画
            setTimeout(() => {
                contentModal.classList.add('active');
            }, 10);

            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭模态框
    function closeModal() {
        contentModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            contentModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // 阻止模态框内容点击事件冒泡
    contentModal.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}); 