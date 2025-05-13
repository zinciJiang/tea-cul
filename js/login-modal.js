document.addEventListener('DOMContentLoaded', function() {
    // 获取所有登录和注册按钮
    const loginBtns = document.querySelectorAll('.login-btn a');
    const registerBtns = document.querySelectorAll('.register-btn a');
    
    // 创建模态框HTML
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-container">
                <span class="modal-close">&times;</span>
                <div class="modal-header">
                    <h2>欢迎回来</h2>
                </div>
                <div class="modal-tabs">
                    <div class="modal-tab active" data-tab="login">登录</div>
                    <div class="modal-tab" data-tab="register">注册</div>
                </div>
                <div class="modal-forms-container">
                    <form class="modal-form active" id="loginForm">
                        <div class="form-group">
                            <input type="text" id="loginUsername" required>
                            <label for="loginUsername">用户名</label>
                        </div>
                        <div class="form-group">
                            <input type="password" id="loginPassword" required>
                            <label for="loginPassword">密码</label>
                        </div>
                        <button type="submit" class="form-submit">登录</button>
                        <div class="form-footer">
                            <a href="#" class="forgot-password">忘记密码？</a>
                        </div>
                    </form>
                    <form class="modal-form" id="registerForm">
                        <div class="form-group">
                            <input type="text" id="registerUsername" required>
                            <label for="registerUsername">用户名</label>
                        </div>
                        <div class="form-group">
                            <input type="email" id="registerEmail" required>
                            <label for="registerEmail">邮箱</label>
                        </div>
                        <div class="form-group">
                            <input type="password" id="registerPassword" required>
                            <label for="registerPassword">密码</label>
                        </div>
                        <div class="form-group">
                            <input type="password" id="confirmPassword" required>
                            <label for="confirmPassword">确认密码</label>
                        </div>
                        <button type="submit" class="form-submit">注册</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // 将模态框添加到body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 获取模态框元素
    const modal = document.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const tabs = modal.querySelectorAll('.modal-tab');
    const forms = modal.querySelectorAll('.modal-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const header = modal.querySelector('.modal-header h2');

    // 显示模态框函数
    function showModal(activeTab = 'login') {
        modal.classList.add('active');
        setTimeout(() => {
            switchTab(activeTab);
        }, 50);
    }

    // 关闭模态框函数
    function closeModal() {
        modal.style.opacity = '0';
        modal.querySelector('.modal-container').style.transform = 'translateY(-20px) scale(0.95)';
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.opacity = '';
            modal.querySelector('.modal-container').style.transform = '';
            // 重置表单
            resetForms();
            loginForm.reset();
            registerForm.reset();
        }, 300);
    }

    // 切换标签函数
    function switchTab(tabName) {
        // 更新标题
        const newTitle = tabName === 'login' ? '欢迎回来' : '创建账号';
        header.style.opacity = '0';
        header.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            header.textContent = newTitle;
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 200);

        // 切换标签和表单
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // 表单切换动画
        const currentForm = document.getElementById(`${tabName}Form`);
        const otherForm = tabName === 'login' ? registerForm : loginForm;

        // 重置所有输入框状态
        const allInputs = modal.querySelectorAll('input');
        allInputs.forEach(input => {
            input.parentElement.classList.remove('focused');
        });

        // 设置当前表单的初始位置
        currentForm.style.transform = 'translateX(50px)';
        currentForm.style.display = 'block';
        
        // 触发重排以应用过渡
        currentForm.offsetHeight;
        
        // 移出当前活动表单
        otherForm.style.transform = 'translateX(-50px)';
        otherForm.style.opacity = '0';
        
        // 移入新表单
        currentForm.style.transform = 'translateX(0)';
        currentForm.style.opacity = '1';
        
        setTimeout(() => {
            otherForm.style.display = 'none';
            // 重置表单位置
            otherForm.style.transform = '';
            currentForm.classList.add('active');
            otherForm.classList.remove('active');

            // 检查当前表单中是否有已填写的输入框
            const currentInputs = currentForm.querySelectorAll('input');
            currentInputs.forEach(input => {
                if (input.value) {
                    input.parentElement.classList.add('focused');
                }
            });
        }, 300);
    }

    // 绑定登录按钮点击事件
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('login');
        });
    });

    // 绑定注册按钮点击事件
    registerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('register');
        });
    });

    // 绑定关闭按钮点击事件
    modalClose.addEventListener('click', closeModal);

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 标签切换事件
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const activeTab = tab.dataset.tab;
            if (!tab.classList.contains('active')) {
                switchTab(activeTab);
            }
        });
    });

    // 添加输入框焦点效果
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        const formGroup = input.parentElement;
        
        // 如果输入框已有值，添加focused类
        if (input.value) {
            formGroup.classList.add('focused');
        }

        input.addEventListener('focus', () => {
            formGroup.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                formGroup.classList.remove('focused');
            }
        });

        // 监听输入事件
        input.addEventListener('input', () => {
            if (input.value) {
                formGroup.classList.add('focused');
            } else {
                formGroup.classList.remove('focused');
            }
        });
    });

    // 表单验证函数
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        // 密码至少8位，包含大小写字母和数字
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    }

    function validateUsername(username) {
        // 用户名4-20位，只能包含字母、数字和下划线
        const re = /^[a-zA-Z0-9_]{4,20}$/;
        return re.test(username);
    }

    // 显示错误信息
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorDiv);
        }
        formGroup.classList.add('error');
    }

    // 清除错误信息
    function clearError(input) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            formGroup.removeChild(errorDiv);
        }
        formGroup.classList.remove('error');
    }

    // 登录表单提交处理
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = loginForm.querySelector('.form-submit');

        // 清除之前的错误信息
        clearError(document.getElementById('loginUsername'));
        clearError(document.getElementById('loginPassword'));

        // 表单验证
        let hasError = false;
        if (!validateUsername(username)) {
            showError(document.getElementById('loginUsername'), '用户名格式不正确');
            hasError = true;
        }
        if (!password) {
            showError(document.getElementById('loginPassword'), '请输入密码');
            hasError = true;
        }

        if (hasError) return;

        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.textContent = '登录中...';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 登录成功
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                closeModal();
                updateLoginStatus(true);
                showToast('登录成功');
            } else {
                // 登录失败
                showError(document.getElementById('loginUsername'), data.message || '用户名或密码错误');
            }
        } catch (error) {
            showError(document.getElementById('loginUsername'), '网络错误，请稍后重试');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '登录';
        }
    });

    // 注册表单提交处理
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = registerForm.querySelector('.form-submit');

        // 清除之前的错误信息
        clearError(document.getElementById('registerUsername'));
        clearError(document.getElementById('registerEmail'));
        clearError(document.getElementById('registerPassword'));
        clearError(document.getElementById('confirmPassword'));

        // 表单验证
        let hasError = false;
        if (!validateUsername(username)) {
            showError(document.getElementById('registerUsername'), '用户名必须是4-20位的字母、数字或下划线');
            hasError = true;
        }
        if (!validateEmail(email)) {
            showError(document.getElementById('registerEmail'), '请输入有效的邮箱地址');
            hasError = true;
        }
        if (!validatePassword(password)) {
            showError(document.getElementById('registerPassword'), '密码必须至少8位，包含大小写字母和数字');
            hasError = true;
        }
        if (password !== confirmPassword) {
            showError(document.getElementById('confirmPassword'), '两次输入的密码不一致');
            hasError = true;
        }

        if (hasError) return;

        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.textContent = '注册中...';

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 注册成功
                showToast('注册成功，请登录');
                switchTab('login');
            } else {
                // 注册失败
                showError(document.getElementById('registerUsername'), data.message || '注册失败，请稍后重试');
            }
        } catch (error) {
            showError(document.getElementById('registerUsername'), '网络错误，请稍后重试');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '注册';
        }
    });

    // 更新登录状态
    function updateLoginStatus(isLoggedIn) {
        const loginContainer = document.querySelector('.login-container');
        if (isLoggedIn) {
            const user = JSON.parse(localStorage.getItem('user'));
            loginContainer.innerHTML = `
                <div class="user-menu">
                    <span class="username">${user.username}</span>
                    <div class="dropdown-menu">
                        <a href="/profile">个人中心</a>
                        <a href="#" class="logout-btn">退出登录</a>
                    </div>
                </div>
            `;
            
            // 绑定退出登录事件
            document.querySelector('.logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                updateLoginStatus(false);
                showToast('已退出登录');
            });
        } else {
            loginContainer.innerHTML = `
                <div class="login-btn"><a href="#">登录</a></div>
                <div class="register-btn"><a href="#">注册</a></div>
            `;
            // 重新绑定登录注册按钮事件
            bindLoginButtons();
        }
    }

    // 显示提示消息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 2000);
        }, 100);
    }

    // 检查登录状态
    const token = localStorage.getItem('token');
    if (token) {
        updateLoginStatus(true);
    }

    // 绑定登录注册按钮事件
    function bindLoginButtons() {
        const loginBtns = document.querySelectorAll('.login-btn a');
        const registerBtns = document.querySelectorAll('.register-btn a');
        
        loginBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('login');
            });
        });
        
        registerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('register');
            });
        });
    }

    // 初始绑定登录注册按钮事件
    bindLoginButtons();

    // 关闭模态框时重置所有表单状态
    function resetForms() {
        const allInputs = modal.querySelectorAll('input');
        allInputs.forEach(input => {
            input.value = '';
            input.parentElement.classList.remove('focused');
        });
    }
}); 